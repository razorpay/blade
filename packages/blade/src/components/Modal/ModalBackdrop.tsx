/* eslint-disable react/display-name */
import React from 'react';
import styled from 'styled-components';
import { FloatingOverlay } from '@floating-ui/react';
import { useModalContext } from './ModalContext';
import { castWebType, makeMotionTime, metaAttribute } from '~utils';

const StyledModalBackdrop = styled(FloatingOverlay)<{ isOpen: boolean }>(({ theme, isOpen }) => {
  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: isOpen
      ? castWebType(theme.motion.easing.entrance.revealing)
      : castWebType(theme.motion.easing.exit.revealing),
    pointerEvents: isOpen ? 'all' : 'none',
    transitionProperty: 'opacity',
    opacity: isOpen ? 1 : 0,
    backgroundColor: theme.colors.overlay.background,
  };
});

const ModalBackdrop = (): React.ReactElement => {
  const { close, isOpen } = useModalContext();

  return (
    <StyledModalBackdrop
      {...metaAttribute({ testID: 'modal-backdrop' })}
      onClick={() => {
        close();
      }}
      isOpen={isOpen}
      lockScroll={true}
    />
  );
};

export { ModalBackdrop };
