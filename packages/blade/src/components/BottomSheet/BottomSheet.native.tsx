/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-empty-function */
import GorhomBottomSheet, {
  BottomSheetFooter as GorhomBottomSheetFooter,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { Portal } from '@gorhom/portal';
import styled from 'styled-components/native';
import { Dimensions, AccessibilityInfo, findNodeHandle, View } from 'react-native';
import { BottomSheetGrabHandle, BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetBody } from './BottomSheetBody';
import type { BottomSheetProps } from './types';
import { ComponentIds } from './componentIds';
import type { BottomSheetContextProps } from './BottomSheetContext';
import { BottomSheetContext, useBottomSheetAndDropdownGlue } from './BottomSheetContext';
import { BottomSheetCloseButton } from './BottomSheetCloseButton';
import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetFooter } from './BottomSheetFooter';
import { useBottomSheetStack } from './BottomSheetStack';
import { makeSpace, getComponentId } from '~utils';

import { DropdownContext, useDropdown } from '~components/Dropdown/useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { useId } from '~src/hooks/useId';
import { useIsomorphicLayoutEffect } from '~src/hooks/useIsomorphicLayoutEffect';

const BottomSheetSurface = styled(BaseBox)(({ theme }) => {
  return {
    // TODO: we do not have 16px radius token
    borderTopLeftRadius: makeSpace(theme.spacing[5]),
    borderTopRightRadius: makeSpace(theme.spacing[5]),
    backgroundColor: theme.colors.surface.background.level2.lowContrast,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };
});

const focusOnElement = (element: React.Component<any, any>): void => {
  const reactTag = findNodeHandle(element);
  if (reactTag) {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
};

const _BottomSheet = ({
  children,
  snapPoints = [0.35, 0.5, 0.85],
  isOpen,
  onDismiss,
  initialFocusRef,
}: BottomSheetProps): React.ReactElement => {
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();
  const defaultInitialFocusRef = React.useRef<any>(null);
  const sheetRef = React.useRef<GorhomBottomSheet>(null);
  const header = React.useRef<React.ReactNode>();
  const footer = React.useRef<React.ReactNode>();
  const body = React.useRef<React.ReactNode>();
  const _isOpen = bottomSheetAndDropdownGlue?.isOpen ?? isOpen;
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [footerHeight, setFooterHeight] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(0);
  const initialSnapPoint = React.useRef<number>(0);
  const totalHeight = React.useMemo(() => {
    return headerHeight + footerHeight + contentHeight;
  }, [contentHeight, footerHeight, headerHeight]);

  const id = useId();
  const {
    addBottomSheetToStack,
    removeBottomSheetFromStack,
    getCurrentStackIndexById,
  } = useBottomSheetStack();
  const currentStackIndex = getCurrentStackIndexById(id);
  const zIndex = 100 - currentStackIndex;

  // if bottomSheet height is >35% & <50% then set initial snapPoint to 35%
  useIsomorphicLayoutEffect(() => {
    const height = Dimensions.get('window').height;
    const middleSnapPoint = snapPoints[1] * height;
    if (totalHeight > middleSnapPoint) {
      initialSnapPoint.current = 1;
    }
  }, [snapPoints, totalHeight]);

  const _snapPoints = React.useMemo(() => snapPoints.map((point) => `${point * 100}%`), [
    snapPoints,
  ]);

  const close = React.useCallback(() => {
    onDismiss?.();
    bottomSheetAndDropdownGlue?.onBottomSheetDismiss();
  }, [bottomSheetAndDropdownGlue, onDismiss]);

  const handleOnOpen = React.useCallback(() => {
    sheetRef.current?.snapToIndex(initialSnapPoint.current);
  }, []);

  const handleOnClose = React.useCallback(() => {
    sheetRef.current?.close();
  }, [sheetRef]);

  // sync controlled state to our actions
  React.useEffect(() => {
    if (_isOpen) {
      handleOnOpen();
      if (!initialFocusRef) {
        // focus on close button
        focusOnElement(defaultInitialFocusRef.current);
      } else {
        // focus on the initialRef
        focusOnElement(initialFocusRef.current);
      }
    } else {
      handleOnClose();
    }
  }, [_isOpen, handleOnClose, handleOnOpen, initialFocusRef]);

  // let the Dropdown component know that it's rendering a bottomsheet
  React.useEffect(() => {
    if (!bottomSheetAndDropdownGlue) return;
    bottomSheetAndDropdownGlue.setDropdownHasBottomSheet(true);
  }, [bottomSheetAndDropdownGlue]);

  React.useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (getComponentId(child) === ComponentIds.BottomSheetHeader) {
        header.current = child;
      }
      if (getComponentId(child) === ComponentIds.BottomSheetFooter) {
        footer.current = child;
      }
      if (getComponentId(child) === ComponentIds.BottomSheetBody) {
        body.current = child;
      }
    });
  }, [children]);

  const renderFooter = React.useCallback((props): React.ReactElement => {
    return (
      <GorhomBottomSheetFooter {...props}>
        <View
          onLayout={(event) => {
            // save footer height so that later we can offset the marginBottom from body content
            // otherwise few elements gets hidden under the footer
            setFooterHeight(event.nativeEvent.layout.height);
          }}
        >
          {footer.current}
        </View>
      </GorhomBottomSheetFooter>
    );
  }, []);

  const renderBackdrop = React.useCallback(
    (props): React.ReactElement => {
      return <BottomSheetBackdrop {...props} zIndex={zIndex} />;
    },
    [zIndex],
  );

  const renderHandle = React.useCallback((): React.ReactElement => {
    return (
      <BaseBox
        onLayout={({ nativeEvent }) => {
          setHeaderHeight(nativeEvent.layout.height);
        }}
      >
        <BaseBox zIndex={zIndex}>
          <BottomSheetCloseButton />
          <BottomSheetGrabHandle />
        </BaseBox>
        {header.current}
      </BaseBox>
    );
  }, [zIndex]);

  const contextValue = React.useMemo<BottomSheetContextProps>(
    () => ({
      isInBottomSheet: true,
      isOpen: Boolean(_isOpen),
      close: handleOnClose,
      positionY: 0,
      headerHeight,
      contentHeight,
      footerHeight,
      setContentHeight,
      setFooterHeight,
      setHeaderHeight,
      scrollRef: () => {},
      bind: {} as never,
      defaultInitialFocusRef,
    }),
    [_isOpen, contentHeight, footerHeight, handleOnClose, headerHeight],
  );

  // Hack: We need to <Portal> the GorhomBottomSheet to the root of the react-native app
  // But the portalled component will no longer be able to access the parent contexts (Dropdown Context)
  // To workaround this, I'm portalling both the DropdownContext & BotomSheetContext along with the component
  const dropdownProps = useDropdown();

  // This will reset the BottomSheet body state
  // We need this because if inside the BottomSheet there is a input which is focused
  // and user dragged down to close the sheet, even after closing the sheet the input will remain focused
  // to remove the focus we are updating the key={} property of BottomSheetScrollView
  const bodyResetKey = _isOpen ? 'opened' : 'closed';

  // register and deregister in the stack
  React.useEffect(() => {
    if (_isOpen) {
      addBottomSheetToStack(id);
    } else {
      removeBottomSheetFromStack(id);
    }
  }, [addBottomSheetToStack, _isOpen, id, removeBottomSheetFromStack]);

  return (
    <Portal hostName="BladeBottomSheetPortal">
      {/* Portalling both the context */}
      <DropdownContext.Provider value={dropdownProps}>
        <BottomSheetContext.Provider value={contextValue}>
          <GorhomBottomSheet
            enablePanDownToClose
            enableOverDrag
            enableContentPanningGesture
            ref={sheetRef}
            index={-1}
            containerStyle={{ zIndex }}
            animateOnMount={false}
            handleComponent={renderHandle}
            backgroundComponent={BottomSheetSurface}
            footerComponent={renderFooter}
            backdropComponent={renderBackdrop}
            onClose={close}
            snapPoints={_snapPoints}
          >
            {body.current}
          </GorhomBottomSheet>
        </BottomSheetContext.Provider>
      </DropdownContext.Provider>
    </Portal>
  );
};

const BottomSheet = assignWithoutSideEffects(_BottomSheet, {
  componentId: ComponentIds.BottomSheet,
});

export { BottomSheet, BottomSheetBody, BottomSheetFooter, BottomSheetHeader };
