import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ArrowLeftIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21 12 a 0.75 0.75 0 0 1 -0.75 0.75 H 5.56 l 5.47 5.47 a 0.75 0.75 0 0 1 -1.06 1.06 l -6.75 -6.75 a 0.75 0.75 0 0 1 0 -1.06 l 6.75 -6.75 a 0.75 0.75 0 0 1 1.06 1.06 L 5.56 11.25 H 20.25 A 0.75 0.75 0 0 1 21 12 Z" />
    </Svg>
  );
};
const ArrowLeftIcon = assignWithoutSideEffects(_ArrowLeftIcon, {
  componentId: 'ArrowLeftIcon',
});
export default ArrowLeftIcon;