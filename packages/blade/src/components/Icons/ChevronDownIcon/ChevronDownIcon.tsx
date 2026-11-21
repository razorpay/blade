import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ChevronDownIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 20.03 9.53 l -7.5 7.5 a 0.75 0.75 0 0 1 -1.06 0 l -7.5 -7.5 A 0.75 0.75 0 0 1 5.03 8.47 L 12 15.44 l 6.97 -6.97 a 0.75 0.75 0 0 1 1.06 1.06 Z" />
    </Svg>
  );
};
const ChevronDownIcon = assignWithoutSideEffects(_ChevronDownIcon, {
  componentId: 'ChevronDownIcon',
});
export default ChevronDownIcon;