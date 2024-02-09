import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useFloating,
} from '@floating-ui/react';
import React from 'react';
import styled, { css } from 'styled-components';
import usePresence from 'use-presence';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Box } from '~components/Box';
// import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, useTheme } from '~utils';
import { componentZIndices } from '~utils/componentZIndices';
import { useGlobalState } from '~utils/GlobalStateProvider';
import { makeAccessible } from '~utils/makeAccessible';

type DrawerProps = {
  /**
   * Controlled state of drawer open or not
   */
  isOpen: boolean;

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Show or hide overlay.
   *
   * Also decides if clicking outside on overlay closes the drawer or not
   */
  showOverlay?: boolean;
  children: React.ReactNode;
  /**
   * zIndex property of Drawer
   */
  zIndex?: number;
  accessibilityLabel?: string;
  stackingLevel?: 1 | 2;
};

const DrawerContext = React.createContext<{
  close: () => void;
  defaultInitialFocusRef?: React.MutableRefObject<any>;
  stackingLevel: Exclude<DrawerProps['stackingLevel'], undefined>;
}>({ close: () => {}, stackingLevel: 1 });

const AnimatedDrawerContainer = styled(BaseBox)<{ isVisible: boolean }>(({ theme, isVisible }) => {
  return css`
    opacity: ${isVisible ? 1 : 0};
    right: ${isVisible ? '0%' : '-100%'};
    transition: all
      ${castWebType(
        isVisible
          ? makeMotionTime(theme.motion.duration.xgentle)
          : makeMotionTime(theme.motion.duration.xmoderate),
      )}
      ${isVisible
        ? castWebType(theme.motion.easing.entrance.revealing)
        : castWebType(theme.motion.easing.exit.revealing)};
  `;
});

const DrawerOverlay = styled(FloatingOverlay)<{ isVisible: boolean }>(({ isVisible, theme }) => {
  return css`
    opacity: ${isVisible ? 1 : 0};
    transition: opacity
      ${isVisible
        ? makeMotionTime(theme.motion.duration.xgentle)
        : makeMotionTime(theme.motion.duration.xmoderate)}
      ${isVisible
        ? castWebType(theme.motion.easing.entrance.revealing)
        : castWebType(theme.motion.easing.exit.revealing)};
    background-color: ${theme.colors.overlay.background.subtle};
  `;
});

const DrawerHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  const { close, defaultInitialFocusRef, stackingLevel } = React.useContext(DrawerContext);
  return (
    <BaseHeader
      showCloseButton={stackingLevel === 1}
      showBackButton={stackingLevel === 2}
      closeButtonRef={defaultInitialFocusRef}
      title={title}
      subtitle={subtitle}
      onCloseButtonClick={() => close()}
      onBackButtonClick={() => close()}
    />
  );
};

const DrawerBody = ({ children }: { children: React.ReactNode }) => {
  return <Box padding="spacing.6">{children}</Box>;
};

const Drawer = ({
  isOpen,
  onDismiss,
  zIndex = componentZIndices.drawer,
  children,
  accessibilityLabel,
  showOverlay = true,
  stackingLevel = 1,
}: DrawerProps): React.ReactElement => {
  const defaultInitialFocusRef = React.useRef<HTMLDivElement>(null);

  const { theme } = useTheme();
  const { openDrawers, setOpenDrawers } = useGlobalState();

  const { isMounted, isVisible } = usePresence(isOpen, {
    enterTransitionDuration: theme.motion.duration.xgentle,
    exitTransitionDuration: theme.motion.duration.xmoderate,
    initialEnter: true,
  });

  const { refs, context } = useFloating({
    open: isMounted,
  });

  React.useEffect(() => {
    if (isMounted) {
      setOpenDrawers(openDrawers + 1);
    } else {
      setOpenDrawers(openDrawers - 1);
    }
  }, [isMounted]);

  return (
    <DrawerContext.Provider value={{ close: onDismiss, defaultInitialFocusRef, stackingLevel }}>
      <FloatingPortal>
        {isMounted ? (
          <FloatingFocusManager context={context} initialFocus={defaultInitialFocusRef}>
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

export { Drawer, DrawerProps, DrawerHeader, DrawerBody };
