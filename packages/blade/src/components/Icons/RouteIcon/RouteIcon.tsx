import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _RouteIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3C0 1.89543 0.895431 1 2 1H7C8.10457 1 9 1.89543 9 3H12H15C15 1.89543 15.8954 1 17 1H22C23.1046 1 24 1.89543 24 3V5C24 6.10457 23.1046 7 22 7H17C15.8954 7 15 6.10457 15 5H13V11H15C15 9.89543 15.8954 9 17 9H22C23.1046 9 24 9.89543 24 11V13C24 14.1046 23.1046 15 22 15H17C15.8954 15 15 14.1046 15 13H13V19H15C15 17.8954 15.8954 17 17 17H22C23.1046 17 24 17.8954 24 19V21C24 22.1046 23.1046 23 22 23H17C15.8954 23 15 22.1046 15 21H12C11.9655 21 11.9314 20.9983 11.8978 20.9948C11.3935 20.9436 11 20.5178 11 20C11 19.9995 11 19.9991 11 19.9986L11 12.001V11.999V5H9C9 6.10457 8.10457 7 7 7H2C0.89543 7 0 6.10457 0 5V3ZM17 20V21H22V19H17V20ZM17 13V12V11H22V13H17ZM17 4V5H22V3H17V4ZM7 3V4V5H2V3H7Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const RouteIcon = assignWithoutSideEffects(_RouteIcon, {
  componentId: 'RouteIcon',
});

export default RouteIcon;
