import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { Path, Svg } from '../_Svg';

const TrendingDownIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg height={height} width={width} viewBox="0 0 24 14" fill="none">
      <Path
        d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L7.79289 9.20711C8.18342 9.59763 8.81658 9.59763 9.20711 9.20711L13.5 4.91421L20.5858 12H17C16.4477 12 16 12.4477 16 13C16 13.5523 16.4477 14 17 14H22.9993C23.0003 14 23.002 14 23.003 14C23.1375 13.9996 23.2657 13.9727 23.3828 13.9241C23.5007 13.8753 23.6112 13.803 23.7071 13.7071C23.8902 13.524 23.9874 13.2877 23.9989 13.048C23.9996 13.032 24 13.016 24 13C24 12.9997 24 13.0003 24 13V7C24 6.44772 23.5523 6 23 6C22.4477 6 22 6.44772 22 7V10.5858L14.2071 2.79289C13.8166 2.40237 13.1834 2.40237 12.7929 2.79289L8.5 7.08579L1.70711 0.292893Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TrendingDownIcon;
