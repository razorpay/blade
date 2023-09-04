/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import React from 'react';

type BottomSheetContextProps = {
  headerHeight: number;
  contentHeight: number;
  footerHeight: number;
  isHeaderFloating: boolean;
  setContentHeight: React.Dispatch<React.SetStateAction<number>>;
  setHeaderHeight: React.Dispatch<React.SetStateAction<number>>;
  setFooterHeight: React.Dispatch<React.SetStateAction<number>>;
  setHasBodyPadding: React.Dispatch<React.SetStateAction<boolean>>;
  setIsHeaderEmpty: React.Dispatch<React.SetStateAction<boolean>>;
  /**
   * Closes the bottomsheet
   */
  close: () => void;
  /**
   * scrollRef is the ref to the BottomSheetBody's scrollable content
   *
   * We use this for two purposes:
   *
   * 1. Preventing the scrolling of the content, until the top snap point is reached
   * 2. We use it as the target for body scroll locking, so even when the body is locked this will remain scrollable
   */
  scrollRef: React.Ref<any>;
  /**
   * bind() function comes from useDrag hook
   * https://use-gesture.netlify.app/docs/gestures
   *
   * We spread this function's return values into the element which needs to be draggable
   */
  bind: ((...args: any[]) => ReactDOMAttributes) | null;
  /**
   * Indicates open state of bottomsheet
   */
  isOpen: boolean;
  /**
   * Vertical position of bottomsheet surface
   */
  positionY: number;
  /**
   * This flag is true whenever we access useBottomSheetContext inside BottomSheetContext provider
   */
  isInBottomSheet: boolean;
  /**
   * The element that will get focused when the bottomsheet first opens
   */
  defaultInitialFocusRef: React.MutableRefObject<any>;
};

const BottomSheetContext = React.createContext<BottomSheetContextProps>({
  headerHeight: 0,
  contentHeight: 0,
  footerHeight: 0,
  isHeaderFloating: false,
  setContentHeight: () => {},
  setHeaderHeight: () => {},
  setFooterHeight: () => {},
  setHasBodyPadding: () => {},
  setIsHeaderEmpty: () => {},
  close: () => {},
  scrollRef: null,
  bind: null,
  isOpen: false,
  positionY: 0,
  isInBottomSheet: false,
  defaultInitialFocusRef: { current: null },
});

const useBottomSheetContext = (): BottomSheetContextProps => {
  const state = React.useContext(BottomSheetContext);
  return state;
};

type BottomSheetAndDropdownGlueContext = {
  isOpen: boolean;
  /**
   * This flag is true when <Dropdown> contains or renders <BottomSheet> inside of it
   * We can use this flag to alter behavior or styles of Dropdown
   */
  dropdownHasBottomSheet: boolean;
  /**
   * This is the setter for the flag, we set this flag to true inside <BottomSheet>
   */
  setDropdownHasBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
  onBottomSheetDismiss: () => void;
} | null;

const BottomSheetAndDropdownGlueContext = React.createContext<BottomSheetAndDropdownGlueContext>(
  null,
);

/**
 * This hook provides the bridge between Dropdown And BottomSheet
 *
 * You can hover over the return types to get jsdoc and more information about each
 */
const useBottomSheetAndDropdownGlue = (): BottomSheetAndDropdownGlueContext => {
  const state = React.useContext(BottomSheetAndDropdownGlueContext);

  return state;
};

export type { BottomSheetContextProps };
export {
  BottomSheetContext,
  useBottomSheetContext,
  BottomSheetAndDropdownGlueContext,
  useBottomSheetAndDropdownGlue,
};
