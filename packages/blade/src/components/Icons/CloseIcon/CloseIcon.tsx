import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _CloseIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 19.28 18.22 a 0.75 0.75 0 0 1 -1.06 1.06 L 12 13.06 5.78 19.28 a 0.75 0.75 0 0 1 -1.06 -1.06 L 10.94 12 4.72 5.78 A 0.75 0.75 0 0 1 5.78 4.72 L 12 10.94 l 6.22 -6.22 a 0.75 0.75 0 0 1 1.06 1.06 L 13.06 12 Z" />
    </Svg>
  );
};
const CloseIcon = assignWithoutSideEffects(_CloseIcon, {
  componentId: 'CloseIcon',
});
export default CloseIcon;