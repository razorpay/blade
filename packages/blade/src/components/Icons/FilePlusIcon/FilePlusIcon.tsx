import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FilePlusIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 11C12.5523 11 13 11.4477 13 12V14H15C15.5523 14 16 14.4477 16 15C16 15.5523 15.5523 16 15 16H13V18C13 18.5523 12.5523 19 12 19C11.4477 19 11 18.5523 11 18V16H9C8.44772 16 8 15.5523 8 15C8 14.4477 8.44772 14 9 14H11V12C11 11.4477 11.4477 11 12 11Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 1C4.34315 1 3 2.34315 3 4V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V8C21 7.73478 20.8946 7.48043 20.7071 7.29289L14.7071 1.29289C14.5196 1.10536 14.2652 1 14 1H6ZM5 4C5 3.44772 5.44772 3 6 3H13V8C13 8.55228 13.4477 9 14 9H19V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V4ZM17.5858 7L15 4.41421V7H17.5858Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FilePlusIcon = assignWithoutSideEffects(_FilePlusIcon, {
  componentId: 'FilePlusIcon',
});

export default FilePlusIcon;
