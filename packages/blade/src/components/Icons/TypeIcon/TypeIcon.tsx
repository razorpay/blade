import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const TypeIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V6C21 6.55228 20.5523 7 20 7C19.4477 7 19 6.55228 19 6V4H5V6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6V3Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 19C8 18.4477 8.44772 18 9 18H15C15.5523 18 16 18.4477 16 19C16 19.5523 15.5523 20 15 20H9C8.44772 20 8 19.5523 8 19Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C12.5523 2 13 2.44772 13 3V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V3C11 2.44772 11.4477 2 12 2Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TypeIcon;
