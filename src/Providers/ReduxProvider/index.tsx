'use client';
import { AppStore, makeStore } from '@/lib/redux/store';
import React, { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<AppStore>();

  if (!storeRef.current) storeRef.current = makeStore();

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxProvider;
