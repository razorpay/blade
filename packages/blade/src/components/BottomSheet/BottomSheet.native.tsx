/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-empty-function */
import GorhomBottomSheet, {
  BottomSheetFooter as GorhomBottomSheetFooter,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import React from 'react';
import { Portal } from '@gorhom/portal';
import { Dimensions, AccessibilityInfo, findNodeHandle, View, Keyboard } from 'react-native';
import { BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import { BottomSheetBody } from './BottomSheetBody';
import { BottomSheetFooter } from './BottomSheetFooter';
import type { BottomSheetProps } from './types';
import { computeMaxContent } from './utils';
import { ComponentIds } from './componentIds';
import type { BottomSheetContextProps } from './BottomSheetContext';
import { BottomSheetContext, useBottomSheetAndDropdownGlue } from './BottomSheetContext';
import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { useBottomSheetStack } from './BottomSheetStack';
import { DropdownContext, useDropdown } from '~components/Dropdown/useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { useId } from '~utils/useId';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSpace } from '~utils/makeSpace';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { componentZIndices } from '~utils/componentZIndices';

const BottomSheetBackground = ({ style }: BottomSheetBackgroundProps): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <View
      pointerEvents="none"
      style={[
        style,
        {
          borderTopLeftRadius: makeSpace(theme.spacing[5]),
          borderTopRightRadius: makeSpace(theme.spacing[5]),
          backgroundColor: theme.colors.popup.background.gray.subtle,
        },
      ]}
    />
  );
};

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
  isDismissible = true,
  enableContentPanningGesture = true,
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
  const lastSnappedIndexRef = React.useRef<number | null>(null);
  const isOpenRef = React.useRef(Boolean(_isOpen));
  isOpenRef.current = Boolean(_isOpen);
  // Gorhom emits `onClose` for programmatic snap/close as well as user dismiss.
  // Suppress parent `onDismiss` during our own sheet animations.
  const suppressDismissRef = React.useRef(false);
  const suppressDismissTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const suppressDismiss = React.useCallback((duration = 600): void => {
    if (suppressDismissTimeoutRef.current) {
      clearTimeout(suppressDismissTimeoutRef.current);
    }
    suppressDismissRef.current = true;
    suppressDismissTimeoutRef.current = setTimeout(() => {
      suppressDismissRef.current = false;
      suppressDismissTimeoutRef.current = null;
    }, duration);
  }, []);

  React.useEffect(() => {
    return () => {
      if (suppressDismissTimeoutRef.current) {
        clearTimeout(suppressDismissTimeoutRef.current);
      }
    };
  }, []);

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
    if (bottomSheetAndDropdownGlue?.hasAutoCompleteInHeader) {
      // In AutoComplete, we want to open BottomSheet with max height so we set this to last index
      initialSnapPoint.current = 2;
    } else if (totalHeight > 0) {
      // Content-fitted snap at index 0 once heights are measured
      initialSnapPoint.current = 0;
    } else {
      const height = Dimensions.get('window').height;
      const middleSnapPoint = snapPoints[1] * height;
      if (totalHeight > middleSnapPoint) {
        initialSnapPoint.current = 1;
      } else {
        initialSnapPoint.current = 0;
      }
    }
  }, [snapPoints, totalHeight, bottomSheetAndDropdownGlue?.hasAutoCompleteInHeader]);

  const windowHeight = Dimensions.get('window').height;
  const _snapPoints = React.useMemo(() => {
    if (totalHeight > 0) {
      const fittedHeight = computeMaxContent({
        maxHeight: windowHeight * snapPoints[2],
        headerHeight,
        footerHeight,
        contentHeight,
      });
      const fittedSnap = Math.min(
        Math.max(fittedHeight / windowHeight, snapPoints[0]),
        snapPoints[2],
      );
      return [`${fittedSnap * 100}%`, `${snapPoints[1] * 100}%`, `${snapPoints[2] * 100}%`];
    }
    return snapPoints.map((point) => `${point * 100}%`);
  }, [snapPoints, totalHeight, headerHeight, footerHeight, contentHeight, windowHeight]);

  const dismissSheet = React.useCallback(() => {
    if (!isDismissible) return;
    onDismiss?.();
    bottomSheetAndDropdownGlue?.onBottomSheetDismiss?.();
  }, [isDismissible, onDismiss, bottomSheetAndDropdownGlue]);

  const handleSheetClosed = React.useCallback(() => {
    if (!isDismissible) return;
    if (suppressDismissRef.current) return;
    // Ignore stale close events once React state is already closed.
    if (!isOpenRef.current) return;
    dismissSheet();
  }, [dismissSheet, isDismissible]);

  const handleOnOpen = React.useCallback(() => {
    suppressDismiss();
    const targetIndex = initialSnapPoint.current;
    lastSnappedIndexRef.current = targetIndex;
    sheetRef.current?.snapToIndex(targetIndex);
  }, [suppressDismiss]);

  const handleOnClose = React.useCallback(() => {
    suppressDismiss();
    sheetRef.current?.close();
    // We need this because if inside the BottomSheet there is a input which is focused
    // and user dragged down to close the sheet, even after closing the sheet the input will remain focused
    Keyboard.dismiss();
  }, [suppressDismiss]);

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
      lastSnappedIndexRef.current = null;
      handleOnClose();
    }
  }, [_isOpen, handleOnClose, handleOnOpen, initialFocusRef]);

  React.useEffect(() => {
    if (!_isOpen || totalHeight === 0) return;
    const targetIndex = initialSnapPoint.current;
    if (lastSnappedIndexRef.current === targetIndex) return;
    lastSnappedIndexRef.current = targetIndex;
    suppressDismiss();
    sheetRef.current?.snapToIndex(targetIndex);
  }, [_isOpen, totalHeight, suppressDismiss]);

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
      return (
        <BottomSheetBackdrop {...props} zIndex={bottomSheetZIndex} isDismissible={isDismissible} />
      );
    },
    [bottomSheetZIndex, isDismissible],
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
      close: dismissSheet,
      positionY: 0,
      headerHeight,
      contentHeight,
      footerHeight,
      setContentHeight,
      setFooterHeight,
      setHeaderHeight,
      isDismissible,
      scrollRef: () => {},
      bind: {} as never,
      defaultInitialFocusRef,
      isHeaderFloating,
      setHasBodyPadding,
      setIsHeaderEmpty,
    }),
    [
      _isOpen,
      contentHeight,
      footerHeight,
      dismissSheet,
      headerHeight,
      isHeaderFloating,
      isDismissible,
    ],
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
              _isOpen
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
            enablePanDownToClose={isDismissible}
            enableOverDrag
            enableContentPanningGesture={enableContentPanningGesture}
            ref={sheetRef}
            // on initial render if _isOpen is true we want to render the sheet at initialSnapPoint
            // otherwise we want to render it at -1 so that it is not visible
            index={_isOpen ? initialSnapPoint.current : -1}
            containerStyle={{ zIndex: bottomSheetZIndex, elevation: bottomSheetZIndex }}
            animateOnMount={true}
            handleComponent={renderHandle}
            backgroundComponent={BottomSheetBackground}
            footerComponent={renderFooter}
            backdropComponent={renderBackdrop}
            onClose={handleSheetClosed}
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
