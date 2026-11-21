import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _StarFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21.96 10.77 l -4.22 3.64 L 19.03 19.85 a 1.54 1.54 0 0 1 -2.3 1.67 L 12 18.61 7.26 21.52 A 1.54 1.54 0 0 1 4.97 19.85 l 1.29 -5.44 -4.22 -3.64 A 1.54 1.54 0 0 1 2.91 8.06 l 5.53 -0.45 2.13 -5.16 a 1.53 1.53 0 0 1 2.84 0 l 2.13 5.16 5.53 0.45 a 1.54 1.54 0 0 1 0.88 2.71 Z" />
    </Svg>
  );
};
const StarFilledIcon = assignWithoutSideEffects(_StarFilledIcon, {
  componentId: 'StarFilledIcon',
});
export default StarFilledIcon;