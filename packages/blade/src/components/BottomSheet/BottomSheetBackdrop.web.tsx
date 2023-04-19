import React from 'react';
import styled from 'styled-components';
import { useBottomSheetContext } from './BottomSheetContext';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';

const StyledBottomSheetBackdrop = styled(BaseBox)<{ isOpen: boolean }>(({ theme, isOpen }) => {
  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: isOpen
      ? castWebType(theme.motion.easing.entrance.revealing)
      : castWebType(theme.motion.easing.exit.revealing),
    pointerEvents: isOpen ? 'all' : 'none',
  };
});

const BottomSheetBackdrop = (): React.ReactElement => {
  const { theme } = useTheme();
  const { close, isOpen } = useBottomSheetContext();

  return (
    <StyledBottomSheetBackdrop
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
      zIndex={1}
      backgroundColor={theme.colors.overlay.background}
    />
  );
};

export { BottomSheetBackdrop };
