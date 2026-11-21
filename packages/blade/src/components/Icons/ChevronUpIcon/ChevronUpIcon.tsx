import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ChevronUpIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 20.03 15.53 a 0.75 0.75 0 0 1 -1.06 0 L 12 8.56 5.03 15.53 a 0.75 0.75 0 0 1 -1.06 -1.06 l 7.5 -7.5 a 0.75 0.75 0 0 1 1.06 0 l 7.5 7.5 A 0.75 0.75 0 0 1 20.03 15.53 Z" />
    </Svg>
  );
};
const ChevronUpIcon = assignWithoutSideEffects(_ChevronUpIcon, {
  componentId: 'ChevronUpIcon',
});
export default ChevronUpIcon;