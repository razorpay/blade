/* eslint-disable react/display-name */
import React from 'react';
import styled from 'styled-components';
import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { castWebType } from '~utils';
import { metaAttribute } from '~utils/metaAttribute';
import { makeMotionTime } from '~utils/makeMotionTime';

const StyledBottomSheetBackdrop = styled(BaseBox)<{ isOpen: boolean }>(({ theme, isOpen }) => {
  return {
    transitionDuration: `${makeMotionTime(theme.motion.duration.moderate)}`,
    transitionTimingFunction: isOpen
      ? castWebType(theme.motion.easing.entrance)
      : castWebType(theme.motion.easing.exit),
    pointerEvents: isOpen ? 'all' : 'none',
    transitionProperty: 'opacity',
  };
});

const BottomSheetBackdrop = ({ zIndex }: { zIndex: number }): React.ReactElement => {
  const { close, isOpen } = useBottomSheetContext();

  return (
    <StyledBottomSheetBackdrop
      {...metaAttribute({ testID: 'bottomsheet-backdrop' })}
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
      backgroundColor="overlay.background.subtle"
    />
  );
};

export { BottomSheetBackdrop };
