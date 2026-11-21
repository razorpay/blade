import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _StarIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 22.42 9.12 A 1.54 1.54 0 0 0 21.09 8.06 l -5.53 -0.45 L 13.42 2.45 a 1.53 1.53 0 0 0 -2.84 0 L 8.45 7.62 2.91 8.06 a 1.54 1.54 0 0 0 -0.88 2.71 l 4.22 3.64 L 4.97 19.85 a 1.54 1.54 0 0 0 2.3 1.67 L 12 18.61 l 4.74 2.91 A 1.54 1.54 0 0 0 19.03 19.85 l -1.29 -5.44 4.22 -3.64 A 1.54 1.54 0 0 0 22.42 9.12 Z m -1.44 0.51 -4.57 3.94 a 0.75 0.75 0 0 0 -0.24 0.74 l 1.4 5.89 a 0.03 0.03 0 0 1 -0.02 0.05 c -0.02 0.01 -0.02 0.01 -0.04 0 l -5.13 -3.15 a 0.75 0.75 0 0 0 -0.79 0 L 6.48 20.24 c -0.01 0.01 -0.02 0.01 -0.04 0 a 0.03 0.03 0 0 1 -0.02 -0.04 l 1.4 -5.89 a 0.75 0.75 0 0 0 -0.24 -0.74 l -4.57 -3.94 c -0.01 -0.01 -0.02 -0.02 -0.01 -0.05 s 0.02 -0.03 0.03 -0.03 l 5.99 -0.48 A 0.75 0.75 0 0 0 9.66 8.61 l 2.31 -5.59 c 0.01 -0.02 0.01 -0.02 0.03 -0.02 s 0.03 0.01 0.03 0.02 L 14.34 8.61 a 0.75 0.75 0 0 0 0.63 0.46 l 5.99 0.48 c 0.01 0 0.02 0 0.03 0.03 S 21 9.62 20.99 9.63 Z" />
    </Svg>
  );
};
const StarIcon = assignWithoutSideEffects(_StarIcon, {
  componentId: 'StarIcon',
});
export default StarIcon;