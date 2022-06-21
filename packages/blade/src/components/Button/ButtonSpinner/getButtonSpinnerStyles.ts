/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { FlattenSimpleInterpolation } from 'styled-components';
import { keyframes, css } from 'styled-components';

import getPlatformType from '../../../utils/getPlatformType';
import makeMotionTime from '../../../utils/makeMotionTime';
import type { Theme } from '../../BladeProvider';

const getAnimation = (theme: Theme): FlattenSimpleInterpolation => {
  // ignore css animation on native
  if (getPlatformType() === 'react-native') return css``;

  const rotate =
    getPlatformType() === 'react-native'
      ? ''
      : keyframes`
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        `;

  return css`
    animation: ${rotate} ${makeMotionTime(theme.motion.duration['2xgentle'])}
      ${theme.motion.easing.standard.effective as string} infinite;
  `;
};

const getButtonSpinnerStyles = (theme: Theme): FlattenSimpleInterpolation => {
  return css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    ${getAnimation(theme)}
  `;
};

export default getButtonSpinnerStyles;
