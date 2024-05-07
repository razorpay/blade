/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-empty-function */
import GorhomBottomSheet, {
  BottomSheetFooter as GorhomBottomSheetFooter,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { Portal } from '@gorhom/portal';
import styled from 'styled-components/native';
import { Dimensions, AccessibilityInfo, findNodeHandle, View, Keyboard } from 'react-native';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import { BottomSheetBody } from './BottomSheetBody';
import { BottomSheetFooter } from './BottomSheetFooter';
import type { BottomSheetProps } from './types';
import { ComponentIds } from './componentIds';
import type { BottomSheetContextProps } from './BottomSheetContext';
import { BottomSheetContext, useBottomSheetAndDropdownGlue } from './BottomSheetContext';
import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { useBottomSheetStack } from './BottomSheetStack';
import { DropdownContext, useDropdown } from '~components/Dropdown/useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { useId } from '~utils/useId';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSpace } from '~utils/makeSpace';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { componentZIndices } from '~utils/componentZIndices';

const BottomSheetSurface = styled(BaseBox)(({ theme }) => {
  return {
    // TODO: we do not have 16px radius token
    borderTopLeftRadius: makeSpace(theme.spacing[5]),
    borderTopRightRadius: makeSpace(theme.spacing[5]),
    backgroundColor: theme.colors.popup.background.subtle,
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
  zIndex = componentZIndices.bottomSheet,
}: BottomSheetProps): React.ReactElement => {
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();
  const defaultInitialFocusRef = React.useRef<any>(null);
  const sheetRef = React.useRef<GorhomBottomSheet>(null);
  const [header, setHeader] = React.useState<React.ReactNode>();
  const [footer, setFooter] = React.useState<React.ReactNode>();
  const [body, setBody] = React.useState<React.ReactNode>();
  const _isOpen = isOpen ?? bottomSheetAndDropdownGlue?.isOpen;
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [footerHeight, setFooterHeight] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [hasBodyPadding, setHasBodyPadding] = React.useState(true);
  const [isHeaderEmpty, setIsHeaderEmpty] = React.useState(false);
  const initialSnapPoint = React.useRef<number>(0);
  const totalHeight = React.useMemo(() => {
    return headerHeight + footerHeight + contentHeight;
  }, [contentHeight, footerHeight, headerHeight]);

  const id = useId();
  const {
    addBottomSheetToStack,
    removeBottomSheetFromStack,
    getCurrentStackIndexById,
    getTopOfTheStack,
  } = useBottomSheetStack();
  const currentStackIndex = getCurrentStackIndexById(id);
  const bottomSheetZIndex = zIndex - currentStackIndex;

  // if bottomSheet height is >35% & <50% then set initial snapPoint to 35%
  useIsomorphicLayoutEffect(() => {
    if (bottomSheetAndDropdownGlue?.hasAutoCompleteInBottomSheetHeader) {
      // In AutoComplete, we want to open BottomSheet with max height so we set this to last index
      initialSnapPoint.current = 2;
    } else {
      const height = Dimensions.get('window').height;
      const middleSnapPoint = snapPoints[1] * height;
      if (totalHeight > middleSnapPoint) {
        initialSnapPoint.current = 1;
      }
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
    // We need this because if inside the BottomSheet there is a input which is focused
    // and user dragged down to close the sheet, even after closing the sheet the input will remain focused
    Keyboard.dismiss();
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

  React.useLayoutEffect(() => {
    React.Children.forEach(children, (child) => {
      if (getComponentId(child) === ComponentIds.BottomSheetHeader) {
        setHeader(child);
      }
      if (getComponentId(child) === ComponentIds.BottomSheetFooter) {
        setFooter(child);
      }
      if (getComponentId(child) === ComponentIds.BottomSheetBody) {
        setBody(child);
      }
    });
  }, [children]);

  const renderFooter = React.useCallback(
    (props: any): React.ReactElement => {
      return (
        <GorhomBottomSheetFooter {...props}>
          <View
            onLayout={(event) => {
              // save footer height so that later we can offset the marginBottom from body content
              // otherwise few elements gets hidden under the footer
              setFooterHeight(event.nativeEvent.layout.height);
            }}
          >
            {footer}
          </View>
        </GorhomBottomSheetFooter>
      );
    },
    [footer],
  );

  const renderBackdrop = React.useCallback(
    (props: any): React.ReactElement => {
      return <BottomSheetBackdrop {...props} zIndex={bottomSheetZIndex} />;
    },
    [bottomSheetZIndex],
  );

  const renderHandle = React.useCallback((): React.ReactElement => {
    return (
      <BaseBox
        position={isHeaderEmpty ? 'absolute' : 'relative'}
        top="spacing.0"
        left="spacing.0"
        right="spacing.0"
        onLayout={({ nativeEvent }) => {
          setHeaderHeight(nativeEvent.layout.height);
        }}
      >
        <BaseBox zIndex={bottomSheetZIndex}>
          <BottomSheetGrabHandle />
        </BaseBox>
        {header}
      </BaseBox>
    );
  }, [isHeaderEmpty, bottomSheetZIndex, header]);

  const isHeaderFloating = !hasBodyPadding && isHeaderEmpty;
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
      isHeaderFloating,
      setHasBodyPadding,
      setIsHeaderEmpty,
    }),
    [_isOpen, contentHeight, footerHeight, handleOnClose, headerHeight, isHeaderFloating],
  );

  // Hack: We need to <Portal> the GorhomBottomSheet to the root of the react-native app
  // But the portalled component will no longer be able to access the parent contexts (Dropdown Context)
  // To workaround this, I'm portalling both the DropdownContext & BotomSheetContext along with the component
  const dropdownProps = useDropdown();

  // register and deregister in the stack
  React.useEffect(() => {
    if (_isOpen) {
      addBottomSheetToStack(id);
    } else {
      removeBottomSheetFromStack(id);
    }
  }, [addBottomSheetToStack, _isOpen, id, removeBottomSheetFromStack]);

  // Handle TextInput inside BottomSheet
  // We expand the BottomSheet to the max snapPoint so that when the keyboard opens
  // the body content will be visible
  // There is a standard way to do this:
  // https://gorhom.github.io/react-native-bottom-sheet/keyboard-handling
  // But this didn't worked because:
  // https://github.com/gorhom/react-native-bottom-sheet/issues/618
  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      if (id && id === getTopOfTheStack()) {
        sheetRef.current?.expand();
      }
    });
    return () => {
      showSubscription.remove();
    };
  }, [getTopOfTheStack, id]);

  return (
    <Portal hostName="BladeBottomSheetPortal">
      {/* Portalling both the context */}
      <DropdownContext.Provider value={dropdownProps}>
        <BottomSheetContext.Provider value={contextValue}>
          <GorhomBottomSheet
            style={
              // only render shadow when the sheet is open,
              // otherwise there is visible shadow leak from the bottom edge of the screen
              isOpen
                ? {
                    // this is reverse top elevation of highRaised elevation token
                    shadowColor: 'hsla(217,56%,17%,0.64)',
                    shadowOffset: {
                      width: 0,
                      height: -18,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                    // this fails on andorid because its not handled on GorhomBottomSheet internally, hence tradeoff but its fine because visually this barely makes any difference its that nice design detail
                    // elevation: 40,
                  }
                : {}
            }
            enablePanDownToClose
            enableOverDrag
            enableContentPanningGesture
            ref={sheetRef}
            // on initial render if _isOpen is true we want to render the sheet at initialSnapPoint
            // otherwise we want to render it at -1 so that it is not visible
            index={_isOpen ? initialSnapPoint.current : -1}
            containerStyle={{ zIndex: bottomSheetZIndex }}
            animateOnMount={true}
            handleComponent={renderHandle}
            backgroundComponent={BottomSheetSurface}
            footerComponent={renderFooter}
            backdropComponent={renderBackdrop}
            onClose={close}
            snapPoints={_snapPoints}
          >
            {body}
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
