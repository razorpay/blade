import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _PlusIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21 12 a 0.75 0.75 0 0 1 -0.75 0.75 H 12.75 v 7.5 a 0.75 0.75 0 0 1 -1.5 0 V 12.75 H 3.75 a 0.75 0.75 0 0 1 0 -1.5 h 7.5 V 3.75 a 0.75 0.75 0 0 1 1.5 0 v 7.5 h 7.5 A 0.75 0.75 0 0 1 21 12 Z" />
    </Svg>
  );
};
const PlusIcon = assignWithoutSideEffects(_PlusIcon, {
  componentId: 'PlusIcon',
});
export default PlusIcon;