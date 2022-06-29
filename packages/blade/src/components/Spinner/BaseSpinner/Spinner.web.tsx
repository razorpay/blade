/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import getIn from '../../../utils/getIn';
import makeMotionTime from '../../../utils/makeMotionTime';
import { useTheme } from '../../BladeProvider';
import SpinnerIcon from './SpinnerIcon';
import type { SpinnerProps } from './Spinner.d';
import { getSpinnerSize, motion } from './spinnerTokens';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AnimatedSpinner = styled.div(
  () => css`
    line-height: 0;
    animation: ${rotate} ${makeMotionTime(motion.duration)} ${motion.easing as string} infinite;
  `,
);

const Spinner = ({ color, size, ...props }: SpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  const spinnerSize = getSpinnerSize(size);
  const spinnerColor = getIn(theme.colors, color);

  return (
    <AnimatedSpinner {...props}>
      <SpinnerIcon color={spinnerColor} size={spinnerSize} />
    </AnimatedSpinner>
  );
};

export default Spinner;
