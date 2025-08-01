import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MessageSquareIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4C4.44772 4 4 4.44772 4 5V18.5858L6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16H19C19.5523 16 20 15.5523 20 15V5C20 4.44772 19.5523 4 19 4H5ZM2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V15C22 16.6569 20.6569 18 19 18H7.41421L3.70711 21.7071C3.42111 21.9931 2.99099 22.0787 2.61732 21.9239C2.24364 21.7691 2 21.4045 2 21V5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MessageSquareIcon = assignWithoutSideEffects(_MessageSquareIcon, {
  componentId: 'MessageSquareIcon',
});

export default MessageSquareIcon;
