import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _UsersIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 10.99 14.81 a 5.63 5.63 0 1 0 -6.23 0 A 8.98 8.98 0 0 0 0.33 18.34 a 0.75 0.75 0 1 0 1.26 0.82 7.5 7.5 0 0 1 12.58 0 0.75 0.75 0 0 0 1.26 -0.82 A 8.98 8.98 0 0 0 10.99 14.81 Z M 3.75 10.13 a 4.13 4.13 0 1 1 4.13 4.13 A 4.13 4.13 0 0 1 3.75 10.13 Z m 19.7 9.25 a 0.75 0.75 0 0 1 -1.04 -0.22 A 7.48 7.48 0 0 0 16.13 15.75 a 0.75 0.75 0 0 1 0 -1.5 4.13 4.13 0 1 0 -1.53 -7.96 0.75 0.75 0 1 1 -0.56 -1.39 5.63 5.63 0 0 1 5.21 9.9 8.98 8.98 0 0 1 4.43 3.54 A 0.75 0.75 0 0 1 23.45 19.38 Z" />
    </Svg>
  );
};
const UsersIcon = assignWithoutSideEffects(_UsersIcon, {
  componentId: 'UsersIcon',
});
export default UsersIcon;