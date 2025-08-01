import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ServerIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 4C1 2.34315 2.34315 1 4 1H20C21.6569 1 23 2.34315 23 4V8C23 9.65685 21.6569 11 20 11H4C2.34315 11 1 9.65685 1 8V4ZM4 3C3.44772 3 3 3.44772 3 4V8C3 8.55228 3.44772 9 4 9H20C20.5523 9 21 8.55228 21 8V4C21 3.44772 20.5523 3 20 3H4Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 16C1 14.3431 2.34315 13 4 13H20C21.6569 13 23 14.3431 23 16V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V16ZM4 15C3.44772 15 3 15.4477 3 16V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V16C21 15.4477 20.5523 15 20 15H4Z"
        fill={iconColor}
      />
      <Path
        d="M7 6C7 6.55228 6.55228 7 6 7C5.44772 7 5 6.55228 5 6C5 5.44772 5.44772 5 6 5C6.55228 5 7 5.44772 7 6Z"
        fill={iconColor}
      />
      <Path
        d="M7 18C7 18.5523 6.55228 19 6 19C5.44772 19 5 18.5523 5 18C5 17.4477 5.44772 17 6 17C6.55228 17 7 17.4477 7 18Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ServerIcon = assignWithoutSideEffects(_ServerIcon, {
  componentId: 'ServerIcon',
});

export default ServerIcon;
