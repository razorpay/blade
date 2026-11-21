import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ChevronRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 17.03 12.53 l -7.5 7.5 a 0.75 0.75 0 0 1 -1.06 -1.06 L 15.44 12 8.47 5.03 a 0.75 0.75 0 0 1 1.06 -1.06 l 7.5 7.5 A 0.75 0.75 0 0 1 17.03 12.53 Z" />
    </Svg>
  );
};
const ChevronRightIcon = assignWithoutSideEffects(_ChevronRightIcon, {
  componentId: 'ChevronRightIcon',
});
export default ChevronRightIcon;