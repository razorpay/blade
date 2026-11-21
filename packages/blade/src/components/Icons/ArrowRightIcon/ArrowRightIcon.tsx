import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ArrowRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 20.78 12.53 l -6.75 6.75 a 0.75 0.75 0 0 1 -1.06 -1.06 L 18.44 12.75 H 3.75 a 0.75 0.75 0 0 1 0 -1.5 H 18.44 L 12.97 5.78 a 0.75 0.75 0 0 1 1.06 -1.06 l 6.75 6.75 A 0.75 0.75 0 0 1 20.78 12.53 Z" />
    </Svg>
  );
};
const ArrowRightIcon = assignWithoutSideEffects(_ArrowRightIcon, {
  componentId: 'ArrowRightIcon',
});
export default ArrowRightIcon;