/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-empty-function */
import GorhomBottomSheet, {
  BottomSheetFooter as GorhomBottomSheetFooter,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { Portal } from '@gorhom/portal';
import styled from 'styled-components/native';
import { AccessibilityInfo, findNodeHandle, Platform, View } from 'react-native';
import { BottomSheetGrabHandle, BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetBody } from './BottomSheetBody';
import type { BottomSheetProps } from './types';
import { ComponentIds } from './componentIds';
import type { BottomSheetContextProps } from './BottomSheetContext';
import { BottomSheetContext, useBottomSheetAndDropdownGlue } from './BottomSheetContext';
import { BottomSheetBackdrop } from './BottomSheetBackdrop';
import { BottomSheetFooter } from './BottomSheetFooter';
import { useBottomSheetStack } from './BottomSheetStack';
import { makeSpace, getComponentId, usePrevious } from '~utils';

import { DropdownContext, useDropdown } from '~components/Dropdown/useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { useId } from '~src/hooks/useId';

const isAndroid = Platform.OS === 'android';
// TODO: Temporary workaround to make android shadows look as close as iOS
const androidShadow = {
  color: undefined,
  elevation: 2,
};
const BottomSheetSurface = styled(BaseBox)(({ theme }) => {
  const offsetX = theme.shadows.offsetX.level[1];
  const offsetY = theme.shadows.offsetY.level[1];
  const blur = theme.shadows.blurRadius.level[1];
  const shadowColor = theme.shadows.color.level[1];
  return {
    background: theme.colors.surface.background.level2.lowContrast,
    // TODO: we do not have 16px radius token
    borderTopLeftRadius: makeSpace(theme.spacing[5]),
    borderTopRightRadius: makeSpace(theme.spacing[5]),
    shadowOpacity: '1',
    shadowRadius: blur,
    shadowColor: isAndroid ? androidShadow.color : shadowColor,
    shadowOffset: `${offsetX}px ${offsetY}px`,
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
  const dropdownBottomSheetProps = useBottomSheetAndDropdownGlue();
  const defaultInitialFocusRef = React.useRef<any>(null);
  const sheetRef = React.useRef<GorhomBottomSheet>(null);
  const header = React.useRef<React.ReactNode>();
  const footer = React.useRef<React.ReactNode>();
  const body = React.useRef<React.ReactNode>();
  const _isOpen = dropdownBottomSheetProps?.isOpen ?? isOpen;
  const wasPreviouslyOpen = usePrevious(_isOpen);
  const [footerHeight, setFooterHeight] = React.useState(0);

  const id = useId();
  const {
    addBottomSheetToStack,
    removeBottomSheetFromStack,
    getCurrentStackIndexById,
  } = useBottomSheetStack();
  const currentStackIndex = getCurrentStackIndexById(id);
  const zIndex = 100 - currentStackIndex;

  const _snapPoints = React.useMemo(() => snapPoints.map((point) => `${point * 100}%`), [
    snapPoints,
  ]);

  const close = React.useCallback(() => {
    sheetRef.current?.close();
    // close the select dropdown as well
    dropdownBottomSheetProps?.setIsOpen(false);
    onDismiss?.();
  }, [dropdownBottomSheetProps, onDismiss]);

  const open = React.useCallback(() => {
    // Don't again set the snapToIndex to 0 if the bottomsheet was already open
    // We need to do this because since we set various dependency deps on the useEffect while opening
    // The useEffect runs multiple times and thus causes this function to get called multiple times
    if (!wasPreviouslyOpen) {
      sheetRef.current?.snapToIndex(0);
    }
  }, [wasPreviouslyOpen]);

  React.useEffect(() => {
    if (isOpen === true) {
      open();
      if (!initialFocusRef) {
        // focus on close button
        focusOnElement(defaultInitialFocusRef.current);
      } else {
        // focus on the initialRef
        focusOnElement(initialFocusRef.current);
      }
    }
    if (isOpen === false) {
      close();
    }
  }, [close, initialFocusRef, isOpen, open]);

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
      <BaseBox>
        <BaseBox zIndex={zIndex}>
          <BottomSheetGrabHandle />
        </BaseBox>
        {header.current}
      </BaseBox>
    );
  }, [zIndex]);

  // sync the select dropdown's state with bottomsheet's state
  React.useEffect(() => {
    if (!dropdownBottomSheetProps) return;

    // this will let the Dropdown component know that it's rendering a bottomsheet
    dropdownBottomSheetProps.setDropdownHasBottomSheet(true);

    if (dropdownBottomSheetProps.isOpen) {
      open();
    }

    if (!dropdownBottomSheetProps.isOpen && dropdownBottomSheetProps.selectionType === 'single') {
      close();
    }
  }, [close, open, dropdownBottomSheetProps]);

  const contextValue = React.useMemo<BottomSheetContextProps>(
    () => ({
      isInBottomSheet: true,
      isOpen: Boolean(_isOpen),
      close,
      positionY: 0,
      headerHeight: 0,
      contentHeight: 0,
      footerHeight,
      setContentHeight: () => {},
      setFooterHeight: () => {},
      setHeaderHeight: () => {},
      scrollRef: () => {},
      bind: {} as never,
      defaultInitialFocusRef,
    }),
    [_isOpen, close, footerHeight],
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
    if (isOpen) {
      addBottomSheetToStack(id);
    } else {
      removeBottomSheetFromStack(id);
    }
  }, [addBottomSheetToStack, isOpen, id, removeBottomSheetFromStack]);

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
