import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useFloating,
} from '@floating-ui/react';
import React from 'react';
import styled from 'styled-components';
import usePresence from 'use-presence';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerProps } from './types';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, useTheme } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentZIndices } from '~utils/componentZIndices';
import { useDrawerStack } from '~components/Drawer/StackProvider';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useId } from '~utils/useId';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';

const SHOW_DRAWER = 'show-drawer';

const AnimatedDrawerContainer = styled(BaseBox)<{ isFirstDrawerInStack: boolean }>(
  ({ theme, isFirstDrawerInStack }) => {
    return {
      opacity: 0,
      transform: 'translateX(0%)',
      transition: `all
      ${castWebType(makeMotionTime(theme.motion.duration.xmoderate))}
      ${castWebType(theme.motion.easing.exit.revealing)}`,

      [`&.${SHOW_DRAWER}`]: {
        opacity: 1,
        transform: 'translateX(-100%)',
        transition: `all ${castWebType(makeMotionTime(theme.motion.duration.gentle))} ${castWebType(
          theme.motion.easing.entrance.revealing,
        )}`,
      },
    };
  },
);

const DrawerOverlay = styled(FloatingOverlay)(({ theme }) => {
  return {
    opacity: 0,
    transition: `opacity
      ${makeMotionTime(theme.motion.duration.xmoderate)}
      ${castWebType(theme.motion.easing.exit.revealing)}`,
    backgroundColor: theme.colors.overlay.background.subtle,

    [`&.${SHOW_DRAWER}`]: {
      opacity: 1,
      transition: `opacity ${makeMotionTime(theme.motion.duration.gentle)} ${castWebType(
        theme.motion.easing.entrance.revealing,
      )}`,
    },
  };
});

const _Drawer = ({
  isOpen,
  onDismiss,
  zIndex = componentZIndices.drawer,
  children,
  accessibilityLabel,
  showOverlay = true,
  initialFocusRef,
  testID,
}: DrawerProps): React.ReactElement => {
  const closeButtonRef = React.useRef<HTMLDivElement>(null);

  useVerifyAllowedChildren({
    children,
    componentName: 'Drawer',
    allowedComponents: [drawerComponentIds.DrawerHeader, drawerComponentIds.DrawerBody],
  });

  const { theme } = useTheme();
  const drawerId = useId('drawer');
  const { drawerStack, addToDrawerStack, removeFromDrawerStack } = useDrawerStack();

  const { isMounted, isVisible } = usePresence(isOpen, {
    enterTransitionDuration: theme.motion.duration.gentle,
    exitTransitionDuration: theme.motion.duration.xmoderate,
    initialEnter: true,
  });

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const stackingLevel = drawerStack.indexOf(drawerId) + 1;
  const isFirstDrawerInStack = stackingLevel === 1 && drawerStack.length > 1;

  const { refs, context } = useFloating({
    open: isMounted,
  });

  useIsomorphicLayoutEffect(() => {
    if (isMounted) {
      addToDrawerStack(drawerId);
    } else {
      removeFromDrawerStack(drawerId);
    }
  }, [isMounted]);

  return (
    <DrawerContext.Provider value={{ close: onDismiss, closeButtonRef }}>
      <FloatingPortal>
        {isMounted ? (
          <FloatingFocusManager context={context} initialFocus={initialFocusRef ?? closeButtonRef}>
            <Box
              position="fixed"
              {...metaAttribute({
                name: MetaConstants.Drawer,
                testID,
              })}
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              zIndex={zIndex + stackingLevel}
            >
              {showOverlay || stackingLevel === 2 ? (
                <DrawerOverlay
                  onClick={() => {
                    onDismiss();
                  }}
                  className={isVisible ? SHOW_DRAWER : ''}
                  lockScroll={true}
                />
              ) : null}
              <AnimatedDrawerContainer
                className={isVisible ? SHOW_DRAWER : ''}
                isFirstDrawerInStack={isFirstDrawerInStack}
                width={{
                  base: stackingLevel > 1 ? 'calc(90% - 16px)' : '90%',
                  s: stackingLevel > 1 ? 'calc(375px - 16px)' : '375px',
                  m: stackingLevel > 1 ? 'calc(420px - 16px)' : '420px',
                }}
                {...makeAccessible({
                  role: 'dialog',
                  modal: true,
                  label: accessibilityLabel,
                })}
                position="fixed"
                top="spacing.0"
                left="100%"
                backgroundColor="popup.background.subtle"
                elevation="highRaised"
                height="100%"
                ref={refs.setFloating}
                onKeyDown={(event) => {
                  if (event?.key === 'Escape' || event?.code === 'Escape') {
                    onDismiss();
                  }
                }}
              >
                {children}
              </AnimatedDrawerContainer>
            </Box>
          </FloatingFocusManager>
        ) : null}
      </FloatingPortal>
    </DrawerContext.Provider>
  );
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
  componentId: drawerComponentIds.Drawer,
});

export { Drawer };
