import React from 'react';
import styled from 'styled-components';
import { useBottomSheetContext } from './BottomSheetContext';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';
import { useScrollLock } from '~src/hooks/useScrollLock';

const StyledBottomSheetBackdrop = styled(BaseBox)<{ isOpen: boolean }>(({ theme, isOpen }) => {
  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: isOpen
      ? castWebType(theme.motion.easing.entrance.revealing)
      : castWebType(theme.motion.easing.exit.revealing),
    pointerEvents: isOpen ? 'all' : 'none',
    transitionProperty: isOpen ? 'opacity' : 'opacity, z-index',
    transitionDelay: `${makeMotionTime(theme.motion.duration.moderate)}`,
  };
});

const BottomSheetBackdrop = ({ zIndex }: { zIndex: number }): React.ReactElement => {
  const { theme } = useTheme();
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const { close, isOpen } = useBottomSheetContext();

  // locks the body scroll to prevent accidental dragging of bottomsheet backdrop
  const scrollLockRef = useScrollLock({
    enabled: true,
    reserveScrollBarGap: true,
    targetRef: backdropRef,
  });

  React.useEffect(() => {
    scrollLockRef.current.activate();
  }, [scrollLockRef]);

  return (
    <StyledBottomSheetBackdrop
      ref={backdropRef}
      onClick={() => {
        close();
      }}
      isOpen={isOpen}
      opacity={isOpen ? 1 : 0}
      position="fixed"
      left="spacing.0"
      top="spacing.0"
      bottom="spacing.0"
      right="spacing.0"
      zIndex={zIndex}
      backgroundColor={theme.colors.overlay.background}
    />
  );
};

export { BottomSheetBackdrop };
