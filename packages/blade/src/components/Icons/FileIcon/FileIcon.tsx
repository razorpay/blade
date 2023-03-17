import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const FileIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 1C4.34315 1 3 2.34315 3 4V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V9C21 8.73478 20.8946 8.48043 20.7071 8.29289L13.7071 1.29289C13.5196 1.10536 13.2652 1 13 1H6ZM5 4C5 3.44772 5.44772 3 6 3H12V9C12 9.55228 12.4477 10 13 10H19V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V4ZM17.5858 8L14 4.41421V8H17.5858Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default FileIcon;
