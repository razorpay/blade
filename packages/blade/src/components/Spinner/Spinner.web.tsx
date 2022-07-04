/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import SpinnerIcon from './SpinnerIcon';
import type { SpinnerProps } from './Spinner.d';
import { getSpinnerSize, motion } from './spinnerTokens';
import { useTheme } from '~components/BladeProvider';
import { getIn, makeMotionTime } from '~utils';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AnimatedSpinner = styled.div(({ theme }) => {
  return css`
    line-height: 0;
    animation: ${rotate} ${makeMotionTime(getIn(theme.motion, motion.duration))}
      ${getIn(theme.motion, motion.easing) as string} infinite;
  `;
});

type WithClassName = { className?: string };
const Spinner = ({ color, size, className }: SpinnerProps & WithClassName): React.ReactElement => {
  const { theme } = useTheme();
  const spinnerSize = getSpinnerSize(size);
  const spinnerColor = getIn(theme.colors, color);

  return (
    <AnimatedSpinner className={className}>
      <SpinnerIcon color={spinnerColor} size={spinnerSize} />
    </AnimatedSpinner>
  );
};

export default Spinner;
