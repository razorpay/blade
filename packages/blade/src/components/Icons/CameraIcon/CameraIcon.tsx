import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _CameraIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8C9.23858 8 7 10.2386 7 13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13C17 10.2386 14.7614 8 12 8ZM9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2C8.66565 2 8.35342 2.1671 8.16795 2.4453L6.46482 5H3C1.34315 5 0 6.34315 0 8V19C0 20.6569 1.34315 22 3 22H21C22.6569 22 24 20.6569 24 19V8C24 6.34315 22.6569 5 21 5H17.5352L15.8321 2.4453C15.6466 2.1671 15.3344 2 15 2H9ZM7.83205 6.5547L9.53518 4H14.4648L16.1679 6.5547C16.3534 6.8329 16.6656 7 17 7H21C21.5523 7 22 7.44772 22 8V19C22 19.5523 21.5523 20 21 20H3C2.44772 20 2 19.5523 2 19V8C2 7.44772 2.44772 7 3 7H7C7.33435 7 7.64658 6.8329 7.83205 6.5547Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const CameraIcon = assignWithoutSideEffects(_CameraIcon, {
  componentId: 'CameraIcon',
});

export default CameraIcon;
