/* eslint-disable react/display-name */
import React from 'react';
import styled from 'styled-components';
import { FloatingOverlay } from '@floating-ui/react';
import { useModalContext } from './ModalContext';
import { MetaConstants, castWebType, makeMotionTime, metaAttribute } from '~utils';

const StyledModalBackdrop = styled(FloatingOverlay)(({ theme }) => {
  const { isVisible } = useModalContext();

  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.xmoderate)}`,
    transitionTimingFunction: isVisible
      ? castWebType(theme.motion.easing.entrance.revealing)
      : castWebType(theme.motion.easing.exit.revealing),
    pointerEvents: isVisible ? 'all' : 'none',
    transitionProperty: 'opacity',
    opacity: isVisible ? 1 : 0,
    backgroundColor: theme.colors.overlay.background,
  };
});

const ModalBackdrop = (): React.ReactElement => {
  const { close } = useModalContext();

  return (
    <StyledModalBackdrop
      {...metaAttribute({ name: MetaConstants.ModalBackdrop })}
      onClick={() => {
        close();
      }}
      lockScroll={true}
    />
  );
};

export { ModalBackdrop };
