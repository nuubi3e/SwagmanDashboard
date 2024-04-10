'use client';
import {
  newProductAction,
  updateProductAction,
} from '@/lib/actions/product.action';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { CTAddEditForms } from '@/lib/types/client.types';
import { IngredientsPayload } from '@/lib/types/payload.types';
import FormWrapper from '@/wrappers/FormWrapper';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LuLoader, LuTrash2 } from 'react-icons/lu';
import FormInput from '../FormInput';
import { MdEdit } from 'react-icons/md';
import { generateId } from '@/lib/utils/client.utils';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { productActions } from '@/lib/redux/features/productSlice';
import { FaRegImage } from 'react-icons/fa6';
import Image from 'next/image';
import { Log } from '@/lib/logs';
// import { getCategoriesForDropDown } from '@/lib/server/get-data'

interface FormFields {
  name: string;
  price: number;
  description: string;
  images: string[];
  categoryId: string;
  ingName: string;
  ingDesc: string;
}

const ProductForm: CTAddEditForms = ({ closeModal, mode, id }) => {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState<string[]>([]);
  const isPrefilled = useRef(false);
  const [ingMode, setIngMode] = useState<'add' | 'update'>('add');
  const [editIngIndex, setEditIngIndex] = useState<number | null>(null);
  const categories = useAppSelector((st) => st.category);
  const products = useAppSelector((st) => st.product);
  const [uploading, setUploading] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientsPayload[]>([]);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    setFocus,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormFields>();

  const [submitting, setSubmitting] = useState(false);

  const productSubmitHandler = async (product: FormFields) => {
    setSubmitting(true);
    try {
      const prPy = {
        ...product,
        ingName: undefined,
        ingDesc: undefined,
      };

      const res = await (mode === 'add'
        ? newProductAction({ ...prPy, ingredients, images })
        : updateProductAction({ ...prPy, ingredients }, id!));

      if (!res?.ok) throw new Error(res?.message);

      mode === 'add'
        ? dispatch(
            productActions.addProduct(JSON.parse(res.data?.product || ''))
          )
        : dispatch(
            productActions.updateProduct(JSON.parse(res.data?.product || ''))
          );

      toast.success(res.message);
      closeModal();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const ingHandler = () => {
    const ingName = getValues('ingName');
    const ingDesc = getValues('ingDesc');

    if (!ingName || !ingDesc)
      return toast.error('Please Provide Ingredients name and description');

    if (ingredients.some((ing) => ing.name === ingName))
      return toast.error("Two Ingredients can't have same name.");

    setIngredients((lst) => {
      const allIng = [...lst];
      const newIng = { id: generateId(), name: ingName, description: ingDesc };

      ingMode === 'add' && allIng.push(newIng); // MODE = "ADD" we add new item
      ingMode === 'update' &&
        editIngIndex !== null &&
        allIng.splice(editIngIndex, 1, newIng); // MODE = "UPDATE" AND there is a index then we update value present at that index

      return allIng;
    });

    setValue('ingName', '');
    setValue('ingDesc', '');
    // MODE = "UPDATE" then SET index = null AND mode = "ADD"
    if (ingMode === 'update') {
      setEditIngIndex(null);
      setIngMode('add');
    }
  };

  const removeIngredients = (index: number) =>
    setIngredients((lst) => {
      const allIng = [...lst];

      allIng.splice(index, 1);

      return allIng;
    });

  const editHandler = (ing: IngredientsPayload, index: number) => {
    setIngMode('update');
    setFocus('ingName');
    setValue('ingName', ing.name);
    setValue('ingDesc', ing.description);
    setEditIngIndex(index);
  };

  // EFFECT to load categories
  // useEffect(() => {
  //   const fetchCat = async () => {
  //     try {
  //       const data = await getCategoriesForDropDown()

  //       if (!data.ok) throw new Error(data.message)

  //       dispatch(
  //         categoryActions.storeCategories(
  //           JSON.parse(data.data?.categories || '')
  //         )
  //       )
  //     } catch (err: any) {
  //       toast.error(err.message)
  //     }
  //   }

  //   fetchCat()
  // }, [dispatch])

  const curProduct =
    mode === 'edit' ? products.products.find((prd) => prd._id === id) : null;
  if (!isPrefilled.current && curProduct && id) {
    setValue('categoryId', curProduct.categoryId);
    setValue('name', curProduct.name);
    setValue('price', curProduct.price);
    setValue('description', curProduct.description);
    setIngredients(
      curProduct.ingredients.map((ing) => ({ ...ing, id: generateId() }))
    );
    isPrefilled.current = true;
  }

  // const uploadImages = async (files: FileList) => {
  //   setUploading(true);
  //   const imageSizeLimitInBytes = 1024 * 1024; // 1 MB

  //   try {
  //     // only 4 images are allowed
  //     if (images.length >= 4) throw new Error('Only four files are allowed');

  //     // creating a formdata to upload the images
  //     const formData = new FormData();

  //     // appending multiple images in formdata
  //     for (let i = 0; i < files.length; i++) {
  //       const file = files[i];
  //       if (!file.type.includes('image')) continue;
  //       if (file.size > imageSizeLimitInBytes) continue;
  //       if (i > 3) continue;

  //       // only upload images
  //       formData.append('images', file);
  //     }

  //     // if formdata is empty we'll not send data to api
  //     if (formData.getAll('images').length === 0)
  //       throw new Error('No Images found.');

  //     const res = await fetch(`/api/upload-image`, {
  //       method: 'POST',
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       const text = JSON.parse(await res.text());
  //       throw new Error(text.message);
  //     }

  //     const data = await res.json();

  //     setImages((prevImgs) => {
  //       const imgs = [...prevImgs];

  //       if (imgs.length <= 4)
  //         for (let i = 0; i < data.data.length; i++) {
  //           const img = data.data[i];
  //           if (imgs.length <= 4 && !img.includes(img)) imgs.push(img);
  //         }

  //       return imgs;
  //     });
  //     Log.log(data);
  //   } catch (err: any) {
  //     toast.error(err.message);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  Log.log('IMGS: ', images);

  return (
    <FormWrapper closeModal={closeModal} title={`${mode} Product`}>
      <form
        onSubmit={handleSubmit(productSubmitHandler)}
        noValidate
        className='flex flex-col gap-3'>
        {/* <p className='text-sm text-darkTxtFade self-end'>
          **Note: Only Image file are allowed, images must be less 100kb each
          and only 4 images are allowed per product
        </p> */}
        {/* <section className='flex gap-4'>
        
          {images.length !== 4 && (
            <div
              id='dragDropContainer'
              // preventing default behavior of opening images in new tab
              onDragOver={(e) => {
                e.preventDefault();
                (e.target as HTMLElement)
                  .closest('#dragDropContainer')
                  ?.classList.add('animate-border');
              }}
              onDrop={async (e) => {
                console.log(e.target);
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (!files || uploading) return;

                uploadImages(files);
              }}
              onDragEnter={(e) => {
                (e.target as HTMLElement)
                  .closest('#dragDropContainer')
                  ?.classList.add('animate-border');
              }}
              onDragLeave={(e) => {
                (e.target as HTMLElement)
                  .closest('#dragDropContainer')
                  ?.classList.remove('animate-border');
              }}
              className={`w-full aspect-[1/0.4] rounded-md dash-border flex flex-col flex-1 items-center justify-center overflow-hidden ${
                uploading && 'animate-border'
              }`}>
              <input
                type='file'
                id='productImages'
                multiple
                hidden
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files || uploading) return;
                  uploadImages(files);
                }}
              />
              <div className='gap-5 text-darkTxtFade flex flex-col items-center justify-center transition-all'>
                <FaRegImage className='text-[80px]' />

                <div className='flex flex-col gap-1 items-center'>
                  <p>Drag & Drop Files Here or</p>

                  <p>
                    <label
                      htmlFor='productImages'
                      className='transition-all cursor-pointer hover:text-white hover:font-medium'>
                      Click here
                    </label>{' '}
                    to upload
                  </p>
                </div>
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div className='grid grid-cols-2 gap-1 h-full aspect-square'>
              {images.map((image) => (
                <Image
                  key={image}
                  src={image}
                  alt={image}
                  width={100}
                  height={100}
                  className='w-full aspect-square object-cover object-center'
                />
              ))}
            </div>
          )}
        </section>  */}
        <FormInput
          errors={errors}
          id='name'
          type='text'
          register={register}
          title='Product Name'
          required
        />
        <FormInput
          type='text'
          maxLength={4}
          errors={errors}
          id='price'
          register={register}
          title='Price (₹)'
          validations={{
            valueAsNumber: true,
            validate: {
              isNum(val) {
                return !isNaN(+val) || 'Please provide a integer value';
              },
              isPostiveVal(val) {
                return +val > 0 || 'Please provide a +ve integer value';
              },
            },
          }}
          required
        />

        <div className='flex flex-col gap-2'>
          <label htmlFor='categoryId' className='font-medium self-start'>
            Category:
          </label>
          <input
            id='categoryId'
            {...register('categoryId', {
              required: 'role is required',
            })}
            className='hidden'
          />
          <Select
            value={watch('categoryId')}
            onValueChange={(roleVal) => {
              setValue('categoryId', roleVal);

              trigger('categoryId');
            }}>
            <SelectTrigger className='w-full capitalize py-2 px-3 bg-transparent outline-none  transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'>
              <SelectValue
                placeholder='Select Category'
                className='capitalize'
              />
            </SelectTrigger>
            <SelectContent className='z-[10001] bg-darkSec shadow-lg text-lightPr border-none'>
              <SelectGroup className='capitalize'>
                <SelectLabel>Categories</SelectLabel>
                {categories.categories.map((cat) => (
                  <SelectItem value={cat._id} key={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.categoryId.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='description' className='font-medium self-start'>
            Description
          </label>
          <textarea
            id='description'
            {...register('description', {
              required: 'Description is required',
            })}
            rows={4}
            className='w-full resize-none py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'></textarea>
          {errors.description && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.description.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='ingName' className='font-medium self-start'>
            Ingredient Name
          </label>
          <input
            type='text'
            id='ingName'
            {...register('ingName')}
            className='w-full resize-none py-2 px-3 bg-transparent outline-none transition-all border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'
          />
          {errors.ingName && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.ingName.message}
            </span>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='ingDesc' className='font-medium self-start'>
            Ingredient Description
          </label>
          <textarea
            id='ingDesc'
            {...register('ingDesc')}
            rows={4}
            className='w-full py-2 px-3 bg-transparent outline-none border-opacity-50 border rounded-md border-darkTxtFade text-lightPr focus:outline-lightPr focus:outline-offset-2 focus:outline-2 focus:border-transparent'></textarea>
          {errors.ingDesc && (
            <span className='text-sm text-red-500 font-medium'>
              {errors.ingDesc.message}
            </span>
          )}
        </div>

        <button
          type='button'
          onClick={ingHandler}
          className='capitalize max-md:self-stretch flex justify-center gap-2 items-center self-end py-2 outline-none rounded-md bg-lightPr text-darkPr px-6 font-semibold focus:outline-lightPr focus:outline-offset-4 focus:outline-2 disabled:bg-darkTxtFade disabled:cursor-not-allowed'>
          {ingMode}
        </button>

        {ingredients.length > 0 && (
          <div className='self-stretch flex flex-col gap-2'>
            <h3 className='text-xl font-medium'>Ingredient{"'"}s List</h3>
            <table className='w-full'>
              <thead>
                <tr className='text-grayPr bg-darkPr text-[15px]'>
                  <th className='text-left px-3 py-2'>S.No</th>
                  <th className='text-left px-3 py-2'>Name</th>
                  <th className='text-left px-3 py-2'>Description</th>
                  <th className='text-left px-3 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing, i) => (
                  <tr key={ing.id} className='text-lightPr'>
                    <td className='text-left px-3 py-2 align_td_top'>
                      {i + 1} )
                    </td>
                    <td className='text-left px-3 py-2 align_td_top'>
                      {ing.name}
                    </td>
                    <td className='text-left px-3 py-2'>{ing.description}</td>
                    <td className='text-left px-3 py-2 align_td_top'>
                      <p className='flex items-center gap-2'>
                        <MdEdit
                          className='text-lightPr text-xl cursor-pointer transition-all hover:scale-105'
                          role='button'
                          onClick={() => editHandler(ing, i)}
                        />
                        <LuTrash2
                          className='text-lightPr text-xl cursor-pointer transition-all hover:scale-105'
                          role='button'
                          onClick={() => removeIngredients(i)}
                        />
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          disabled={submitting || uploading}
          type='submit'
          className='max-md:self-stretch flex mt-3 justify-center gap-2 items-center self-start py-2 outline-none rounded-md bg-lightPr text-darkPr px-6 font-semibold focus:outline-lightPr focus:outline-offset-4 focus:outline-2 disabled:bg-darkTxtFade disabled:cursor-not-allowed'>
          {uploading ? 'Uploading' : 'Submit'}
          {(submitting || uploading) && <LuLoader className='animate-spin' />}
        </button>
      </form>
    </FormWrapper>
  );
};

export default ProductForm;
