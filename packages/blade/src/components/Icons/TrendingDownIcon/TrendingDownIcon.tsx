import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { G, Path, Svg, Defs, ClipPath, Rect } from '../_Svg';

const TrendingDownIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg height={height} width={width} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_60_218)">
        <Path
          d="M1.70711 5.29289C1.31658 4.90237 0.683417 4.90237 0.292893 5.29289C-0.0976311 5.68342 -0.0976311 6.31658 0.292893 6.70711L7.79289 14.2071C8.18342 14.5976 8.81658 14.5976 9.20711 14.2071L13.5 9.91421L20.5858 17H17C16.4477 17 16 17.4477 16 18C16 18.5523 16.4477 19 17 19H22.9993C23.0003 19 23.002 19 23.003 19C23.1375 18.9996 23.2657 18.9727 23.3828 18.9241C23.5007 18.8753 23.6112 18.803 23.7071 18.7071C23.8902 18.524 23.9874 18.2877 23.9989 18.048C23.9996 18.032 24 18.016 24 18C24 17.9997 24 18.0003 24 18V12C24 11.4477 23.5523 11 23 11C22.4477 11 22 11.4477 22 12V15.5858L14.2071 7.79289C13.8166 7.40237 13.1834 7.40237 12.7929 7.79289L8.5 12.0858L1.70711 5.29289Z"
          fill={iconColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_60_218">
          <Rect width="24" height="24" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default TrendingDownIcon;
