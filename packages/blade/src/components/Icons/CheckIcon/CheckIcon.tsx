import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _CheckIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21.53 7.28 l -12 12 a 0.75 0.75 0 0 1 -1.06 0 l -5.25 -5.25 a 0.75 0.75 0 0 1 1.06 -1.06 L 9 17.69 20.47 6.22 a 0.75 0.75 0 0 1 1.06 1.06 Z" />
    </Svg>
  );
};
const CheckIcon = assignWithoutSideEffects(_CheckIcon, {
  componentId: 'CheckIcon',
});
export default CheckIcon;