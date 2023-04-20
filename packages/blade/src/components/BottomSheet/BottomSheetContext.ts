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
  isInBottomSheet: boolean;
  defaultInitialFocusRef: React.MutableRefObject<any>;
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
  isInBottomSheet: false,
  defaultInitialFocusRef: { current: null },
});

const useBottomSheetContext = (): BottomSheetContextProps => {
  const state = React.useContext(BottomSheetContext);
  return state;
};

// This context provides the bridge between Dropdown And BottomSheet
type BottomSheetAndDropdownGlueContext = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectionType: 'single' | 'multiple';
  /**
   * This flag is true when <Dropdown> contains or renders <BottomSheet> inside of it
   * We can use this flag to alter behavior or styles of Dropdown
   */
  dropdownHasBottomSheet: boolean;
  /**
   * This is the setter for the flag, we set this flag to true inside <BottomSheet>
   */
  setDropdownHasBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
} | null;

const BottomSheetAndDropdownGlueContext = React.createContext<BottomSheetAndDropdownGlueContext>(
  null,
);
const useBottomSheetAndDropdownGlue = (): BottomSheetAndDropdownGlueContext => {
  const state = React.useContext(BottomSheetAndDropdownGlueContext);

  return state;
};

export {
  BottomSheetContext,
  BottomSheetContextProps,
  useBottomSheetContext,
  BottomSheetAndDropdownGlueContext,
  useBottomSheetAndDropdownGlue,
};
