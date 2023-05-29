/* eslint-disable react/display-name */
import React from 'react';
import styled from 'styled-components';
import { useModalContext } from './ModalContext';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, metaAttribute } from '~utils';

const StyledModalBackdrop = styled(BaseBox)<{ isOpen: boolean }>(({ theme, isOpen }) => {
  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: isOpen
      ? castWebType(theme.motion.easing.entrance.revealing)
      : castWebType(theme.motion.easing.exit.revealing),
    pointerEvents: isOpen ? 'all' : 'none',
    transitionProperty: 'opacity',
    // visibility: isOpen ? 'visible' : 'hidden',
  };
});

const ModalBackdrop = ({ zIndex }: { zIndex: number }): React.ReactElement => {
  const { theme } = useTheme();
  const { close, isOpen } = useModalContext();

  return (
    <StyledModalBackdrop
      {...metaAttribute({ testID: 'modal-backdrop' })}
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

export { ModalBackdrop };
