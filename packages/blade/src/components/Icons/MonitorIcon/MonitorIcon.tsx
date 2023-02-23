import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const MonitorIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 5C1 3.34315 2.34315 2 4 2H20C21.6569 2 23 3.34315 23 5V15C23 16.6569 21.6569 18 20 18H13V20H16C16.5523 20 17 20.4477 17 21C17 21.5523 16.5523 22 16 22H8C7.44772 22 7 21.5523 7 21C7 20.4477 7.44772 20 8 20H11V18H4C2.34315 18 1 16.6569 1 15V5ZM20 16C20.5523 16 21 15.5523 21 15V5C21 4.44772 20.5523 4 20 4H4C3.44772 4 3 4.44772 3 5V15C3 15.5523 3.44772 16 4 16H20Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default MonitorIcon;
