import type { ReactElement } from 'react';
import { Svg, Path, G, Defs, ClipPath, Rect } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const CheckCircleIcon = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <G clipPath="url(#clip0_16177_16057)">
        <Path
          d="M3.46542 5.95567C5.62348 3.43075 9.18525 2.62601 12.2192 3.97787C12.6396 4.16518 13.1323 3.97624 13.3196 3.55584C13.5069 3.13545 13.3179 2.6428 12.8976 2.45549C9.18937 0.803218 4.8361 1.78678 2.19847 4.8728C-0.439156 7.95882 -0.732808 12.4122 1.47676 15.8178C3.68633 19.2234 7.87276 20.7701 11.7658 19.6191C15.6588 18.468 18.3311 14.893 18.3334 10.8333V10.0583C18.3334 9.5981 17.9603 9.22501 17.5001 9.22501C17.0398 9.22501 16.6667 9.5981 16.6667 10.0583V10.8329C16.6648 14.1544 14.4784 17.079 11.2932 18.0208C8.10803 18.9626 4.68276 17.6971 2.87493 14.9107C1.06711 12.1242 1.30737 8.4806 3.46542 5.95567Z"
          fill={iconColor}
        />
        <Path
          d="M18.9226 3.9226C19.2481 3.59716 19.2481 3.06952 18.9226 2.74409C18.5972 2.41865 18.0696 2.41865 17.7441 2.74409L9.16672 11.3215L7.25597 9.41075C6.93054 9.08532 6.4029 9.08532 6.07746 9.41075C5.75202 9.73619 5.75202 10.2638 6.07746 10.5893L8.57746 13.0893C8.9029 13.4147 9.43054 13.4147 9.75597 13.0893L18.9226 3.9226Z"
          fill={iconColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_16177_16057">
          <Rect width="20" height="20" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CheckCircleIcon;
