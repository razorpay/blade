import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AttachmentIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12C2 9.79086 3.79086 8 6 8H9C9.55229 8 10 7.55228 10 7C10 6.44772 9.55229 6 9 6H6C2.68629 6 0 8.68629 0 12C0 13.5913 0.632141 15.1174 1.75736 16.2426C2.88258 17.3679 4.4087 18 6 18H9C9.55229 18 10 17.5523 10 17C10 16.4477 9.55229 16 9 16H6C4.93913 16 3.92172 15.5786 3.17157 14.8284C2.42143 14.0783 2 13.0609 2 12Z"
        fill={iconColor}
      />
      <Path
        d="M15 6C14.4477 6 14 6.44772 14 7C14 7.55228 14.4477 8 15 8H18C19.0609 8 20.0783 8.42143 20.8284 9.17157C21.5786 9.92172 22 10.9391 22 12C22 14.2091 20.2091 16 18 16H15C14.4477 16 14 16.4477 14 17C14 17.5523 14.4477 18 15 18H18C21.3137 18 24 15.3137 24 12C24 10.4087 23.3679 8.88258 22.2426 7.75736C21.1174 6.63214 19.5913 6 18 6H15Z"
        fill={iconColor}
      />
      <Path
        d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H8Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AttachmentIcon = assignWithoutSideEffects(_AttachmentIcon, {
  componentId: 'AttachmentIcon',
});

export default AttachmentIcon;
