/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Portal } from '@gorhom/portal';
import { AccessibilityInfo, findNodeHandle } from 'react-native';
import { AnimatedDrawerContainer } from './AnimatedDrawerContainer.native';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentZIndices } from '~utils/componentZIndices';
import { useDrawerStack, StackingContext } from '~components/Drawer/StackProvider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useId } from '~utils/useId';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const focusOnElement = (element: React.Component<any, any> | null): void => {
  if (!element) return;
  const reactTag = findNodeHandle(element);
  if (reactTag) {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  }
};

const _Drawer = ({
  isOpen,
  onDismiss,
  onUnmount,
  zIndex = componentZIndices.drawer,
  children,
  accessibilityLabel,
  showOverlay = true,
  initialFocusRef,
  isLazy: _isLazy = true,
  testID,
  ...rest
}: DrawerProps): React.ReactElement | null => {
  const [zIndexState, setZIndexState] = React.useState<number>(zIndex);

  useVerifyAllowedChildren({
    children,
    componentName: 'Drawer',
    allowedComponents: [
      drawerComponentIds.DrawerHeader,
      drawerComponentIds.DrawerBody,
      drawerComponentIds.DrawerFooter,
    ],
  });

  const drawerId = useId('drawer');
  const { drawerStack, addToDrawerStack, removeFromDrawerStack } = useDrawerStack();

  // Native presence handling: `use-presence` (web) relies on `document`, so we
  // gate mount/unmount locally instead.
  // - isMounted stays true through the exit animation, then flips false via onExitComplete.
  // - isVisible mirrors isOpen and drives the reanimated slide/opacity.
  // - isExiting is true while the drawer is animating out (mounted but not open).
  const [isMounted, setIsMounted] = React.useState<boolean>(isOpen);
  const isVisible = isOpen;
  const isExiting = isMounted && !isOpen;

  React.useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const handleExitComplete = React.useCallback(() => {
    // Flip `isMounted` false so the Portal unmounts after the exit animation. Guard
    // the `onUnmount` side-effect behind the previous-mounted flag so it only fires
    // when the drawer had actually been opened and is now finishing its exit — never
    // on the initial closed render.
    setIsMounted((prevIsMounted) => {
      if (prevIsMounted) {
        onUnmount?.();
      }
      return false;
    });
  }, [onUnmount]);

  const { stackingLevel } = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const level = Object.keys(drawerStack).indexOf(drawerId) + 1;
    return {
      stackingLevel: level,
    };
  }, [drawerId, drawerStack]);

  React.useEffect(() => {
    if (isOpen) {
      addToDrawerStack({ elementId: drawerId, onDismiss });
      // Move accessibility focus to the requested element (parity with web initialFocus)
      focusOnElement(initialFocusRef?.current ?? null);
    } else {
      removeFromDrawerStack({ elementId: drawerId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // When z-index is not defined by user, we use default drawer z index and add stackingLevel to ensure
  // new drawer that opens, always opens on top of previous one.
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    setZIndexState(zIndex + stackingLevel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const contextValue = React.useMemo(
    () => ({
      close: onDismiss,
      stackingLevel,
      isExiting,
    }),
    [isExiting, onDismiss, stackingLevel],
  );

  // `@gorhom/portal` teleports children into `PortalHost`, which lives OUTSIDE this
  // component's React subtree. Teleported children therefore lose access to the
  // contexts provided here. We re-provide both the DrawerStack context and the
  // Drawer context INSIDE the Portal so DrawerHeader (rendered via the portal) can
  // read the up-to-date `drawerStack`, `close`, and `stackingLevel`.
  // (BottomSheet.native uses the same re-provide-inside-Portal workaround.)
  const stackContextValue = React.useMemo(
    () => ({
      drawerStack,
      addToDrawerStack,
      removeFromDrawerStack,
    }),
    [drawerStack, addToDrawerStack, removeFromDrawerStack],
  );

  // `@gorhom/portal` teleports children into the host via an effect that runs when the
  // `Portal` element itself mounts. The reliable, proven pattern (used by the working
  // `Popover.native` / `Tooltip.native` against this same `BladeBottomSheetPortal` host)
  // is to conditionally MOUNT the `Portal` while the drawer is present rather than keep
  // it always mounted and flip a visibility prop. Mounting fresh on open guarantees:
  // - the add-portal effect fires so the subtree actually teleports and renders, and
  // - `AnimatedDrawerContainer` re-mounts with `isVisible = true`, so its shared values
  //   initialize at the OPEN resting state (translateX 0, opacity 1) and it is visible
  //   on the very first committed frame.
  // Presence is driven by `isMounted`: set true on open, flipped false by
  // `handleExitComplete` after the exit animation so the slide-out still plays before
  // the Portal unmounts. `children` render whenever the drawer is mounted.
  return isMounted ? (
    <Portal hostName="BladeBottomSheetPortal">
      <StackingContext.Provider value={stackContextValue}>
        <DrawerContext.Provider value={contextValue}>
          <BaseBox
            position="absolute"
            top="spacing.0"
            left="spacing.0"
            right="spacing.0"
            bottom="spacing.0"
            zIndex={zIndexState}
            pointerEvents={isVisible ? 'auto' : 'none'}
            {...metaAttribute({
              name: MetaConstants.Drawer,
              testID,
            })}
            {...makeAnalyticsAttribute(rest)}
          >
            <AnimatedDrawerContainer
              isVisible={isVisible}
              showOverlay={showOverlay}
              onOverlayPress={onDismiss}
              onExitComplete={handleExitComplete}
              accessibilityLabel={accessibilityLabel}
            >
              {children}
            </AnimatedDrawerContainer>
          </BaseBox>
        </DrawerContext.Provider>
      </StackingContext.Provider>
    </Portal>
  ) : null;
};

/**
 * ### Drawer Component
 *
 * A drawer is a panel that slides in mostly from right side of the screen over the existing content in the viewport.
 * It helps in providing additional details or context and can also be used to promote product features or new products.
 *
 * ---
 *
 * #### Usage
 *
 * ```jsx
  const MyDrawer = () => {
    const [showDrawer, setShowDrawer] = React.useState(false);
    return (
      <Box>
        <Button onClick={() => setShowDrawer(true)}>Open Drawer</Button>
        <Drawer
          isOpen={showDrawer}
          onDismiss={() => setShowDrawer(false)}
        >
          <DrawerHeader title="Announcements" />
          <DrawerBody>
            <FTXAnnouncement />
            <CatPictures />
          </DrawerBody>
        <Drawer>
      </Box>
    )
  }
 * ```
 *
 *  ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-drawer Drawer Documentation}
 *
 *
 */
const Drawer = assignWithoutSideEffects(_Drawer, {
  displayName: 'Drawer',
  componentId: drawerComponentIds.Drawer,
});

export { Drawer };
