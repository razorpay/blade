import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _LockIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 19.5 7.5 H 16.5 V 5.25 a 4.5 4.5 0 0 0 -9 0 V 7.5 H 4.5 A 1.5 1.5 0 0 0 3 9 V 19.5 a 1.5 1.5 0 0 0 1.5 1.5 H 19.5 a 1.5 1.5 0 0 0 1.5 -1.5 V 9 A 1.5 1.5 0 0 0 19.5 7.5 Z M 9 5.25 a 3 3 0 0 1 6 0 V 7.5 H 9 Z M 19.5 19.5 H 4.5 V 9 H 19.5 V 19.5 Z m -6.37 -5.25 a 1.13 1.13 0 1 1 -1.12 -1.12 A 1.13 1.13 0 0 1 13.13 14.25 Z" />
    </Svg>
  );
};
const LockIcon = assignWithoutSideEffects(_LockIcon, {
  componentId: 'LockIcon',
});
export default LockIcon;