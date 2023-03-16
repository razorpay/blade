import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const FileTextIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H5Z"
        fill={iconColor}
      />
      <Path
        d="M4 16C4 15.4477 4.44772 15 5 15H13C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H5C4.44772 17 4 16.5523 4 16Z"
        fill={iconColor}
      />
      <Path
        d="M5 7C4.44772 7 4 7.44772 4 8C4 8.55229 4.44772 9 5 9H7C7.55228 9 8 8.55229 8 8C8 7.44772 7.55228 7 7 7H5Z"
        fill={iconColor}
      />
      <Path
        d="M0 3C0 1.34315 1.34315 0 3 0H11C11.2652 0 11.5196 0.105357 11.7071 0.292893L17.7071 6.29289C17.8946 6.48043 18 6.73478 18 7V19C18 20.6569 16.6569 22 15 22H3C1.34315 22 0 20.6569 0 19V3ZM3 2C2.44772 2 2 2.44772 2 3V19C2 19.5523 2.44772 20 3 20H15C15.5523 20 16 19.5523 16 19V8H11C10.4477 8 10 7.55228 10 7V2H3ZM12 3.41421L14.5858 6H12V3.41421Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default FileTextIcon;
