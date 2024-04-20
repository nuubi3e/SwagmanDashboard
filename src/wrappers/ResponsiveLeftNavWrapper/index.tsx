'use client';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hook';
import { uiActions } from '@/lib/redux/features/uiSlice';
import { AnimatePresence, motion as m } from 'framer-motion';

import React, { ReactNode, useEffect, useState } from 'react';

const ResponsiveLeftNavWrapper = ({ children }: { children: ReactNode }) => {
  const ui = useAppSelector((st) => st.ui);
  const dispatch = useAppDispatch();
  const [width, setWidth] = useState(document.documentElement.clientWidth);

  useEffect(() => {
    const resizeHandler = () => setWidth(document.documentElement.clientWidth);
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return (
    <AnimatePresence mode='wait'>
      {width > 1024 ? (
        <section className='w-max sticky top-0 left-0 h-[100dvh] flex flex-col bg-darkSec text-drkTxtFocus'>
          {children}
        </section>
      ) : ui.showLeftNav ? (
        <m.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: 'easeOut' }}
          className='fixed z-[200] w-[100dvw] h-[100dvh] top-0 left-0'>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut' }}
            className='w-full h-full absolute top-0 left-0 bg-darkPr bg-opacity-15 backdrop-blur-[2px] z-[210]'
            onClick={() => dispatch(uiActions.closeNav())}
          />
          <m.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ ease: 'easeOut' }}
            className='relative h-full z-[250] w-max flex flex-col bg-darkSec text-drkTxtFocus'>
            {children}
          </m.div>
        </m.section>
      ) : null}
    </AnimatePresence>
  );
};

export default ResponsiveLeftNavWrapper;
