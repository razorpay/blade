import styled, { css, keyframes } from 'styled-components';
import { motion } from './spinnerTokens';
import Box from '~components/Box';
import { getIn, makeMotionTime } from '~utils';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinningBox = styled(Box)(({ theme }) => {
  return css`
    width: max-content;
    animation: ${rotate} ${makeMotionTime(getIn(theme.motion, motion.duration))}
      ${getIn(theme.motion, motion.easing)} infinite;
  `;
});

export { SpinningBox };
