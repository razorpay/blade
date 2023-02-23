import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const BarChartIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 3C17 2.44772 17.4477 2 18 2H22C22.5523 2 23 2.44772 23 3V21C23 21.5523 22.5523 22 22 22H18C17.4477 22 17 21.5523 17 21V3ZM21 4H19V20H21V4Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 8C9 7.44772 9.44771 7 10 7H14C14.5523 7 15 7.44772 15 8V21C15 21.5523 14.5523 22 14 22H10C9.44771 22 9 21.5523 9 21V8ZM11 9V20H13V9H11Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C1.44772 12 1 12.4477 1 13V21C1 21.5523 1.44772 22 2 22H6C6.55228 22 7 21.5523 7 21V13C7 12.4477 6.55228 12 6 12H2ZM3 20V14H5V20H3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default BarChartIcon;
