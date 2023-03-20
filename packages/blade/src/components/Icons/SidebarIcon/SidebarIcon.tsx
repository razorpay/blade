import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const SidebarIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 2C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H19C20.6569 22 22 20.6569 22 19V5C22 3.34315 20.6569 2 19 2H5ZM8 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H8V4ZM10 20V4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H10Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default SidebarIcon;
