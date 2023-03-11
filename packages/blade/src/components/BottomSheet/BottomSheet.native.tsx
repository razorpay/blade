/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-empty-function */
import GorhomBottomSheet, {
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React from 'react';
import { Portal } from '@gorhom/portal';
import styled from 'styled-components/native';
import { AccessibilityInfo, findNodeHandle, Platform } from 'react-native';
import { BottomSheetGrabHandle, BottomSheetHeader } from './BottomSheetHeader';
import { BottomSheetBody } from './BottomSheetBody.native';
import type { BottomSheetProps } from './types';
import { ComponentIds } from './componentIds';
import type { BottomSheetContextProps } from './BottomSheetContext';
import { BottomSheetContext, useDropdownBottomSheetContext } from './BottomSheetContext';
import type { WithComponentId } from '~utils';
import { makeSpace, getComponentId } from '~utils';

import { DropdownContext, useDropdown } from '~components/Dropdown/useDropdown';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';

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
  };
});

const focusOnElement = (element: React.Component<any, any>): void => {
  const reactTag = findNodeHandle(element);
  if (reactTag) {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
};

const BottomSheet: WithComponentId<BottomSheetProps> = ({
  children,
  snapPoints = [0.35, 0.5, 0.85],
  isOpen,
  onDismiss,
  initialFocusRef,
}) => {
  const { theme } = useTheme();
  const dropdownBottomSheetProps = useDropdownBottomSheetContext();
  const defaultInitialFocusRef = React.useRef<any>(null);
  const sheetRef = React.useRef<GorhomBottomSheet>(null);
  const header = React.useRef<React.ReactNode>();
  const footer = React.useRef<React.ReactNode>();
  const body = React.useRef<React.ReactNode>();
  const [_isOpen, setIsOpen] = React.useState(dropdownBottomSheetProps?.isOpen || isOpen);

  const _snapPoints = React.useMemo(() => snapPoints.map((point) => `${point * 100}%`), [
    snapPoints,
  ]);

  const close = React.useCallback(() => {
    setIsOpen(false);
    sheetRef.current?.close();
    console.log(dropdownBottomSheetProps);
    // close the select dropdown as well
    dropdownBottomSheetProps?.setIsOpen(false);
    onDismiss?.();
  }, [dropdownBottomSheetProps, onDismiss]);

  const open = React.useCallback(() => {
    setIsOpen(true);
    sheetRef.current?.snapToIndex(0);
  }, []);

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
    return <BottomSheetFooter {...props}>{footer.current}</BottomSheetFooter>;
  }, []);

  const renderBackdrop = React.useCallback(
    (props) => {
      return (
        <GorhomBottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={1}
          style={{ ...props.style, backgroundColor: theme.colors.overlay.background }}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // sync the select dropdown's state with bottomsheet's state
  React.useEffect(() => {
    if (!dropdownBottomSheetProps) return;

    // this will let the Dropdown component know that it's rendering a bottomsheet
    dropdownBottomSheetProps.setHasBottomSheet(true);

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
      posY: 0,
      headerHeight: 0,
      contentHeight: 0,
      footerHeight: 0,
      setContentHeight: () => {},
      setFooterHeight: () => {},
      setHeaderHeight: () => {},
      scrollRef: () => {},
      bind: {} as never,
      defaultInitialFocusRef,
    }),
    [_isOpen, close],
  );

  // Hack: We need to <Portal> the GorhomBottomSheet to the root of the react-native app
  // But the portalled component will no longer be able to access the parent contexts (Dropdown Context)
  // To workaround this, I'm portalling both the DropdownContext & BotomSheetContext along with the component
  const dropdownProps = useDropdown();

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
            animateOnMount={false}
            handleComponent={BottomSheetGrabHandle}
            backgroundComponent={BottomSheetSurface}
            footerComponent={renderFooter}
            backdropComponent={renderBackdrop}
            onClose={close}
            snapPoints={_snapPoints}
          >
            <BottomSheetScrollView stickyHeaderIndices={[0]}>
              {header.current}
              {body.current}
            </BottomSheetScrollView>
          </GorhomBottomSheet>
        </BottomSheetContext.Provider>
      </DropdownContext.Provider>
    </Portal>
  );
};

BottomSheet.componentId = ComponentIds.BottomSheet;
export { BottomSheet };

export { BottomSheetBody, BottomSheetFooter, BottomSheetHeader };
