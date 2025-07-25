import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FullScreenExitIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 2C8.55228 2 9 2.44772 9 3V6C9 7.65685 7.65685 9 6 9H3C2.44772 9 2 8.55228 2 8C2 7.44772 2.44772 7 3 7H6C6.55228 7 7 6.55228 7 6V3C7 2.44772 7.44772 2 8 2ZM16 2C16.5523 2 17 2.44772 17 3V6C17 6.55228 17.4477 7 18 7H21C21.5523 7 22 7.44772 22 8C22 8.55228 21.5523 9 21 9H18C16.3431 9 15 7.65685 15 6V3C15 2.44772 15.4477 2 16 2ZM2 16C2 15.4477 2.44772 15 3 15H6C7.65685 15 9 16.3431 9 18V21C9 21.5523 8.55228 22 8 22C7.44772 22 7 21.5523 7 21V18C7 17.4477 6.55228 17 6 17H3C2.44772 17 2 16.5523 2 16ZM18 17C17.4477 17 17 17.4477 17 18V21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V18C15 16.3431 16.3431 15 18 15H21C21.5523 15 22 15.4477 22 16C22 16.5523 21.5523 17 21 17H18Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FullScreenExitIcon = assignWithoutSideEffects(_FullScreenExitIcon, {
  componentId: 'FullScreenExitIcon',
});

export default FullScreenExitIcon;
