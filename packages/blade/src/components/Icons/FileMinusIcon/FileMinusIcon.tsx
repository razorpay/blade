import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const FileMinusIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 14C8.44772 14 8 14.4477 8 15C8 15.5523 8.44772 16 9 16H15C15.5523 16 16 15.5523 16 15C16 14.4477 15.5523 14 15 14H9Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4C3 2.34315 4.34315 1 6 1H14C14.2652 1 14.5196 1.10536 14.7071 1.29289L20.7071 7.29289C20.8946 7.48043 21 7.73478 21 8V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V4ZM6 3C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V9H14C13.4477 9 13 8.55228 13 8V3H6ZM15 4.41421L17.5858 7H15V4.41421Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default FileMinusIcon;
