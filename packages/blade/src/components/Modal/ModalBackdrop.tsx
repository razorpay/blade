/* eslint-disable react/display-name */
import React from 'react';
import styled from 'styled-components';
import { FloatingOverlay } from '@floating-ui/react';
import { useModalContext } from './ModalContext';
import { castWebType, makeMotionTime } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const StyledModalBackdrop = styled(FloatingOverlay)(({ theme }) => {
  const { isVisible } = useModalContext();

  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: isVisible
      ? castWebType(theme.motion.easing.entrance)
      : castWebType(theme.motion.easing.exit),
    transitionProperty: 'opacity',
    opacity: isVisible ? 1 : 0,
    backgroundColor: theme.colors.overlay.background.subtle,
  };
});

const ModalBackdrop = (): React.ReactElement => {
  const { close } = useModalContext();

  return (
    <StyledModalBackdrop
      {...metaAttribute({ name: MetaConstants.ModalBackdrop, testID: MetaConstants.ModalBackdrop })}
      onClick={() => {
        close();
      }}
      lockScroll={true}
    />
  );
};

export { ModalBackdrop };
