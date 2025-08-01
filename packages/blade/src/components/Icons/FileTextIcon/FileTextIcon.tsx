import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FileTextIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14H16C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12H8Z"
        fill={iconColor}
      />
      <Path
        d="M7 17C7 16.4477 7.44772 16 8 16H16C16.5523 16 17 16.4477 17 17C17 17.5523 16.5523 18 16 18H8C7.44772 18 7 17.5523 7 17Z"
        fill={iconColor}
      />
      <Path
        d="M8 8C7.44772 8 7 8.44772 7 9C7 9.55229 7.44772 10 8 10H10C10.5523 10 11 9.55229 11 9C11 8.44772 10.5523 8 10 8H8Z"
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

const FileTextIcon = assignWithoutSideEffects(_FileTextIcon, {
  componentId: 'FileTextIcon',
});

export default FileTextIcon;
