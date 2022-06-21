/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import makeMotionTime from '../../../utils/makeMotionTime';
import BaseLoader from './BaseLoader';
import type { BaseSpinnerProps } from './BaseSpinner.d';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AnimatedBaseSpinner = styled.div(
  ({ theme }) => css`
    line-height: 0;
    animation: ${rotate} ${makeMotionTime(theme.motion.duration['2xgentle'])}
      ${theme.motion.easing.standard.effective as string} infinite;
  `,
);

const BaseSpinner = ({ color, size, ...props }: BaseSpinnerProps): React.ReactElement => {
  return (
    <AnimatedBaseSpinner {...props}>
      <BaseLoader color={color} size={size} />
    </AnimatedBaseSpinner>
  );
};

export default BaseSpinner;
