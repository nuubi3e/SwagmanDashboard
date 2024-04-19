'use client';
import { categoryActions } from '@/lib/redux/features/categorySlice';
import { useAppSelector, useAppStore } from '@/lib/redux/hook';
import { CTCategory } from '@/lib/types/client.types';
import { getActionCP } from '@/lib/utils/client.utils';
import { ACTIONTYPE, dateConverter } from '@/lib/utils/global.utils';
import React, { useRef } from 'react';

const CategoryRows = ({
  categories,
  actions,
  searchStr,
}: {
  categories: string;
  actions: ACTIONTYPE[];
  searchStr: string;
}) => {
  const parsedCategories = JSON.parse(categories) as CTCategory[];
  // CODE to store roles in redux-store
  const initializedData = useRef(false);
  const store = useAppStore();
  if (!initializedData.current) {
    store.dispatch(categoryActions.storeCategories(parsedCategories));
    initializedData.current = true;
  }

  const reduxCat = useAppSelector((st) => st.category);
  const categoryData = searchStr ? parsedCategories : reduxCat.categories;

  const ActionJSX = getActionCP(actions);

  return (
    <>
      {categoryData.length > 0 &&
        categoryData.map((cat, i) => (
          <tr key={cat._id.toString()}>
            <td className='py-5 px-4 text-left'>{i + 1}</td>
            <td className='py-5 px-4 text-left capitalize'>{cat.name}</td>
            <td className='py-5 px-4 text-left'>
              <p className='flex flex-col gap-2'>
                <p>
                  <strong className='font-medium'> Created By: </strong>
                  <span>
                    {cat.createdBy.name} on {dateConverter(cat.createdAt)}
                  </span>
                </p>
                <p>
                  <strong className='font-medium'> Updated By: </strong>
                  <span>
                    {cat.updatedBy.name} on {dateConverter(cat.updatedAt)}
                  </span>
                </p>
              </p>
            </td>
            {ActionJSX.length > 0 && (
              <td className='py-5 px-4 text-left'>
                <div className='flex items-center gap-2'>
                  {ActionJSX.map(
                    (JSX, i) =>
                      JSX && <JSX key={i} id={cat._id} title='category' />
                  )}
                </div>
              </td>
            )}
          </tr>
        ))}
      {categoryData.length === 0 && (
        <tr>
          <td colSpan={5} className='py-5 px-4 text-center'>
            No Categories Found!!
          </td>
        </tr>
      )}
    </>
  );
};

export default CategoryRows;
