import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ArrowDownIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 19.28 14.03 l -6.75 6.75 a 0.75 0.75 0 0 1 -1.06 0 l -6.75 -6.75 a 0.75 0.75 0 0 1 1.06 -1.06 L 11.25 18.44 V 3.75 a 0.75 0.75 0 0 1 1.5 0 V 18.44 l 5.47 -5.47 a 0.75 0.75 0 0 1 1.06 1.06 Z" />
    </Svg>
  );
};
const ArrowDownIcon = assignWithoutSideEffects(_ArrowDownIcon, {
  componentId: 'ArrowDownIcon',
});
export default ArrowDownIcon;