/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import React from 'react';

type BottomSheetContextProps = {
  headerHeight: number;
  contentHeight: number;
  footerHeight: number;
  setContentHeight: React.Dispatch<React.SetStateAction<number>>;
  setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
  setFooterHeight: React.Dispatch<React.SetStateAction<number>>;
  close: () => void;
  scrollRef: React.Ref<any>;
  bind: ((...args: any[]) => ReactDOMAttributes) | null;
  isOpen: boolean;
  posY: number;
};

const BottomSheetContext = React.createContext<BottomSheetContextProps>({
  headerHeight: 0,
  contentHeight: 0,
  footerHeight: 0,
  setContentHeight: () => {},
  setHeaderHeight: () => {},
  setFooterHeight: () => {},
  close: () => {},
  scrollRef: null,
  bind: null,
  isOpen: false,
  posY: 0,
});

const useBottomSheetContext = (): BottomSheetContextProps => {
  const state = React.useContext(BottomSheetContext);

  if (!state) {
    throw new Error(
      '[Blade BottomSheet]: useBottomSheetContext must be used within <BottomSheet />',
    );
  }

  return state;
};

export { BottomSheetContext, BottomSheetContextProps, useBottomSheetContext };
