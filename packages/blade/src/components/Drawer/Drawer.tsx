import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useFloating,
} from '@floating-ui/react';
import React from 'react';
import styled from 'styled-components';
import usePresence from 'use-presence';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, useTheme } from '~utils';
import { componentZIndices } from '~utils/componentZIndices';
import { useGlobalState } from '~utils/GlobalStateProvider';
import { makeAccessible } from '~utils/makeAccessible';
import { useId } from '~utils/useId';
import { DrawerContext } from './DrawerContext';
import { DrawerProps } from './types';

const AnimatedDrawerContainer = styled(BaseBox)<{ isVisible: boolean }>(({ theme, isVisible }) => {
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateX(-100%)' : 'translateX(0%)',
    transition: `all
      ${castWebType(
        isVisible
          ? makeMotionTime(theme.motion.duration.xgentle)
          : makeMotionTime(theme.motion.duration.xmoderate),
      )}
      ${
        isVisible
          ? castWebType(theme.motion.easing.entrance.revealing)
          : castWebType(theme.motion.easing.exit.revealing)
      }`,
  };
});

const DrawerOverlay = styled(FloatingOverlay)<{ isVisible: boolean }>(({ isVisible, theme }) => {
  return {
    opacity: isVisible ? 1 : 0,
    transition: `opacity
      ${
        isVisible
          ? makeMotionTime(theme.motion.duration.xgentle)
          : makeMotionTime(theme.motion.duration.xmoderate)
      }
      ${
        isVisible
          ? castWebType(theme.motion.easing.entrance.revealing)
          : castWebType(theme.motion.easing.exit.revealing)
      }`,
    backgroundColor: theme.colors.overlay.background.subtle,
  };
});

const Drawer = ({
  isOpen,
  onDismiss,
  zIndex = componentZIndices.drawer,
  children,
  accessibilityLabel,
  showOverlay = true,
  initialFocusRef,
}: DrawerProps): React.ReactElement => {
  const defaultInitialFocusRef = React.useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const drawerId = useId('drawer');
  const { drawerStack, addToDrawerStack, removeFromDrawerStack } = useGlobalState();

  const { isMounted, isVisible } = usePresence(isOpen, {
    enterTransitionDuration: theme.motion.duration.xgentle,
    exitTransitionDuration: theme.motion.duration.xmoderate,
    initialEnter: true,
  });

  const stackingLevel = drawerStack.indexOf(drawerId) + 1;

  const { refs, context } = useFloating({
    open: isMounted,
  });

  React.useEffect(() => {
    if (isMounted) {
      addToDrawerStack(drawerId);
    } else {
      removeFromDrawerStack(drawerId);
    }
  }, [isMounted]);

  return (
    <DrawerContext.Provider value={{ close: onDismiss, defaultInitialFocusRef, stackingLevel }}>
      <FloatingPortal>
        {isMounted ? (
          <FloatingFocusManager
            context={context}
            initialFocus={initialFocusRef ?? defaultInitialFocusRef}
          >
            <Box position="fixed" zIndex={zIndex + stackingLevel}>
              {showOverlay || stackingLevel === 2 ? (
                <DrawerOverlay
                  onClick={() => {
                    onDismiss();
                  }}
                  isVisible={isVisible}
                  lockScroll={true}
                />
              ) : null}
              <AnimatedDrawerContainer
                isVisible={isVisible}
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

export { Drawer, DrawerProps };
