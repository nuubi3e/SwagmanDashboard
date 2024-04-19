'use client';
import { productActions } from '@/lib/redux/features/productSlice';
import { useAppSelector, useAppStore } from '@/lib/redux/hook';
import { generateId, getActionCP } from '@/lib/utils/client.utils';
import { ACTIONTYPE, dateConverter } from '@/lib/utils/global.utils';
import React, { useRef } from 'react';
import { FaStar, FaStarHalfStroke, FaRegStar } from 'react-icons/fa6';

export const GenerateStars = (num: number) => {
  const starCount = num.toString().split('.');
  const stars: JSX.Element[] = [];

  // Adding Full Stars
  for (let i = 0; i < +starCount[0]; i++)
    stars.push(<FaStar key={generateId()} />);

  // Adding a half start if there is some decimal value
  starCount[1] && stars.push(<FaStarHalfStroke key={generateId()} />);

  // now filling rest array space with empty starts
  while (stars.length !== 5) {
    stars.push(<FaRegStar key={generateId()} />);
  }

  return stars;
};

const ProductRows = ({
  products,
  actions,
}: {
  products: string;
  actions: ACTIONTYPE[];
}) => {
  const store = useAppStore();
  const parsedProducts = JSON.parse(products);
  const isInitialized = useRef(false);
  if (!isInitialized.current) {
    isInitialized.current = true;
    store.dispatch(productActions.storeProducts(parsedProducts));
  }

  const productData = useAppSelector((st) => st.product);

  const ActionJSX = getActionCP(actions);

  return (
    <>
      {productData.products.length > 0 &&
        productData.products.map((prd, i) => (
          <tr key={prd._id.toString()}>
            <td className='py-5 px-4 text-left'>{i + 1}</td>
            <td className='py-5 px-4 text-left capitalize'>{prd.name}</td>
            <td className='py-5 px-4 text-left capitalize'>₹ {prd.price}</td>
            <td className='py-5 px-4 text-left capitalize'>
              {prd.reviews.length}
            </td>
            <td className='py-5 px-4 text-left capitalize'>
              <p className='flex items-center gap-2 text-xl'>
                {GenerateStars(prd.rating)}
              </p>
            </td>
            <td className='py-5 px-4 text-left capitalize'>
              {dateConverter(prd.updatedAt)}
            </td>

            {ActionJSX.length > 0 && (
              <td className='py-5 px-4 text-left'>
                <div className='flex items-center gap-2'>
                  {ActionJSX.map(
                    (JSX, i) =>
                      JSX && <JSX key={i} id={prd._id} title='product' />
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      {productData.products.length === 0 && (
        <tr>
          <td colSpan={7} className='py-5 px-4 text-center'>
            No Products Found!!
          </td>
        </tr>
      )}
    </>
  );
};

export default ProductRows;
