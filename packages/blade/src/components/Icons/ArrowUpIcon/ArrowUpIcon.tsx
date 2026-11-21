import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ArrowUpIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 19.28 11.03 a 0.75 0.75 0 0 1 -1.06 0 L 12.75 5.56 V 20.25 a 0.75 0.75 0 0 1 -1.5 0 V 5.56 L 5.78 11.03 a 0.75 0.75 0 0 1 -1.06 -1.06 l 6.75 -6.75 a 0.75 0.75 0 0 1 1.06 0 l 6.75 6.75 A 0.75 0.75 0 0 1 19.28 11.03 Z" />
    </Svg>
  );
};
const ArrowUpIcon = assignWithoutSideEffects(_ArrowUpIcon, {
  componentId: 'ArrowUpIcon',
});
export default ArrowUpIcon;