import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _FilterIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 18.75 12.75 a 0.75 0.75 0 0 1 -0.75 0.75 H 6 a 0.75 0.75 0 0 1 0 -1.5 H 18 A 0.75 0.75 0 0 1 18.75 12.75 Z m 3 -5.25 H 2.25 a 0.75 0.75 0 0 0 0 1.5 H 21.75 a 0.75 0.75 0 0 0 0 -1.5 Z m -7.5 9 H 9.75 a 0.75 0.75 0 0 0 0 1.5 h 4.5 a 0.75 0.75 0 0 0 0 -1.5 Z" />
    </Svg>
  );
};
const FilterIcon = assignWithoutSideEffects(_FilterIcon, {
  componentId: 'FilterIcon',
});
export default FilterIcon;