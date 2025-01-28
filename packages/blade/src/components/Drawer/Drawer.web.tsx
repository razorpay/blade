import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useFloating,
} from '@floating-ui/react';
import type { CSSProperties } from 'react';
import React from 'react';
import styled from 'styled-components';
import usePresence from 'use-presence';
import { drawerComponentIds } from './drawerComponentIds';
import { DrawerContext } from './DrawerContext';
import type { DrawerProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, useTheme } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentZIndices } from '~utils/componentZIndices';
import { useDrawerStack } from '~components/Drawer/StackProvider';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useId } from '~utils/useId';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeElementRef } from '~utils/types';
import { mergeRefs } from '~utils/useMergeRefs';

const SHOW_DRAWER = 'show-drawer';

const AnimatedDrawerContainer = styled(BaseBox)<{
  isFirstDrawerInStack: boolean;
  isVisible: boolean;
}>(({ theme, isFirstDrawerInStack, isVisible }) => {
  const entranceTransition: CSSProperties['transition'] = `all ${castWebType(
    castWebType(makeMotionTime(theme.motion.duration.xmoderate)),
  )} ${castWebType(theme.motion.easing.entrance)}`;

  const exitTransition: CSSProperties['transition'] = `all
  ${castWebType(makeMotionTime(theme.motion.duration.moderate))}
  ${castWebType(theme.motion.easing.exit)}`;

  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? isFirstDrawerInStack
        ? 'translateX(calc(-100% - 16px))'
        : 'translateX(-100%)'
      : 'translateX(0%)',
    transition: isVisible ? entranceTransition : exitTransition,
    animationFillMode: 'initial',
  };
});

const DrawerOverlay = styled(FloatingOverlay)(({ theme }) => {
  return {
    opacity: 0,
    transition: `opacity
      ${makeMotionTime(theme.motion.duration.xmoderate)}
      ${castWebType(theme.motion.easing.exit)}`,
    backgroundColor: theme.colors.overlay.background.subtle,

    [`&.${SHOW_DRAWER}`]: {
      opacity: 1,
      transition: `opacity ${makeMotionTime(theme.motion.duration.gentle)} ${castWebType(
        theme.motion.easing.entrance,
      )}`,
    },
  };
});

const _Drawer: React.ForwardRefRenderFunction<BladeElementRef, DrawerProps> = (
  {
    isOpen,
    onDismiss,
    zIndex = componentZIndices.drawer,
    children,
    accessibilityLabel,
    showOverlay = true,
    initialFocusRef,
    isLazy = true,
    testID,
    ...rest
  },
  ref,
) => {
  const closeButtonRef = React.useRef<HTMLDivElement>(null);
  const [zIndexState, setZIndexState] = React.useState<number>(zIndex);

  useVerifyAllowedChildren({
    children,
    componentName: 'Drawer',
    allowedComponents: [drawerComponentIds.DrawerHeader, drawerComponentIds.DrawerBody],
  });

  const { theme } = useTheme();
  const drawerId = useId('drawer');
  const { drawerStack, addToDrawerStack, removeFromDrawerStack } = useDrawerStack();

  const { isMounted, isVisible, isExiting } = usePresence(isOpen, {
    enterTransitionDuration: theme.motion.duration.gentle,
    exitTransitionDuration: theme.motion.duration.xmoderate,
    initialEnter: true,
  });

  const { stackingLevel, isFirstDrawerInStack } = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const level = Object.keys(drawerStack).indexOf(drawerId) + 1;
    return {
      stackingLevel: level,
      isFirstDrawerInStack: level === 1 && Object.keys(drawerStack).length > 1,
    };
  }, [drawerId, drawerStack]);

  const { refs, context } = useFloating({
    open: isMounted,
  });

  React.useEffect(() => {
    if (isOpen) {
      addToDrawerStack({ elementId: drawerId, onDismiss });
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
      closeButtonRef,
      stackingLevel,
      isExiting,
    }),
    [isExiting, onDismiss, stackingLevel],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      <FloatingPortal>
        {isMounted || !isLazy ? (
          <FloatingFocusManager
            context={context}
            initialFocus={initialFocusRef ?? closeButtonRef}
            returnFocus={true}
          >
            <BaseBox
              display={isLazy ? undefined : isMounted ? 'block' : 'none'}
              position="fixed"
              {...metaAttribute({
                name: MetaConstants.Drawer,
                testID,
              })}
              {...makeAnalyticsAttribute(rest)}
              zIndex={zIndexState}
            >
              {showOverlay ? (
                <DrawerOverlay
                  onClick={() => {
                    onDismiss();
                  }}
                  className={isVisible ? SHOW_DRAWER : ''}
                  lockScroll={true}
                  {...metaAttribute({
                    testID: 'drawer-overlay',
                  })}
                />
              ) : null}
              <AnimatedDrawerContainer
                isVisible={isVisible}
                isFirstDrawerInStack={isFirstDrawerInStack}
                width={{ base: '90%', s: '375px', m: '420px' }}
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
                display="flex"
                flexDirection="column"
                ref={mergeRefs(ref, refs.setFloating)}
                onKeyDown={(event) => {
                  if (event?.key === 'Escape' || event?.code === 'Escape') {
                    onDismiss();
                  }
                }}
              >
                {children}
              </AnimatedDrawerContainer>
            </BaseBox>
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
const Drawer = assignWithoutSideEffects(React.forwardRef(_Drawer), {
  displayName: 'Drawer',
  componentId: drawerComponentIds.Drawer,
});

export { Drawer };
