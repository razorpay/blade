import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _UserIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21.65 19.88 c -1.43 -2.47 -3.63 -4.24 -6.2 -5.08 a 6.75 6.75 0 1 0 -6.91 0 C 5.98 15.64 3.78 17.41 2.35 19.88 a 0.75 0.75 0 1 0 1.3 0.75 c 1.77 -3.05 4.89 -4.87 8.35 -4.87 s 6.58 1.82 8.35 4.88 a 0.75 0.75 0 1 0 1.3 -0.75 Z M 6.75 9 a 5.25 5.25 0 1 1 5.25 5.25 A 5.26 5.26 0 0 1 6.75 9 Z" />
    </Svg>
  );
};
const UserIcon = assignWithoutSideEffects(_UserIcon, {
  componentId: 'UserIcon',
});
export default UserIcon;