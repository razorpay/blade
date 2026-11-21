import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ChevronLeftIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 15.53 18.97 a 0.75 0.75 0 0 1 -1.06 1.06 l -7.5 -7.5 a 0.75 0.75 0 0 1 0 -1.06 l 7.5 -7.5 a 0.75 0.75 0 0 1 1.06 1.06 L 8.56 12 Z" />
    </Svg>
  );
};
const ChevronLeftIcon = assignWithoutSideEffects(_ChevronLeftIcon, {
  componentId: 'ChevronLeftIcon',
});
export default ChevronLeftIcon;