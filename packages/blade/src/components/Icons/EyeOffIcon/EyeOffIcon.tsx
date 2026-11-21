import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _EyeOffIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 5.06 3.25 A 0.75 0.75 0 1 0 3.95 4.25 L 5.75 6.24 C 2.34 8.33 0.88 11.55 0.81 11.7 a 0.75 0.75 0 0 0 0 0.61 c 0.03 0.07 0.83 1.83 2.59 3.6 C 5.76 18.26 8.73 19.5 12 19.5 a 11.92 11.92 0 0 0 4.88 -1.02 l 2.06 2.27 a 0.75 0.75 0 1 0 1.11 -1.01 Z m 4.44 7.11 3.91 4.3 a 3 3 0 0 1 -3.91 -4.3 Z M 12 18 c -2.89 0 -5.41 -1.05 -7.49 -3.12 A 12.48 12.48 0 0 1 2.34 12 c 0.44 -0.82 1.84 -3.13 4.44 -4.63 l 1.69 1.85 a 4.5 4.5 0 0 0 5.97 6.56 l 1.38 1.52 A 10.5 10.5 0 0 1 12 18 Z m 0.56 -8.95 a 0.75 0.75 0 0 1 0.28 -1.47 4.51 4.51 0 0 1 3.63 4 0.75 0.75 0 0 1 -0.68 0.82 0.6 0.6 0 0 1 -0.07 0 0.75 0.75 0 0 1 -0.75 -0.68 A 3.01 3.01 0 0 0 12.56 9.05 Z m 10.62 3.25 c -0.04 0.09 -0.99 2.19 -3.13 4.11 a 0.75 0.75 0 1 1 -1 -1.12 A 12.45 12.45 0 0 0 21.66 12 a 12.48 12.48 0 0 0 -2.17 -2.88 C 17.41 7.05 14.89 6 12 6 a 11.1 11.1 0 0 0 -1.81 0.15 A 0.75 0.75 0 1 1 9.94 4.67 12.56 12.56 0 0 1 12 4.5 c 3.27 0 6.24 1.24 8.59 3.6 1.77 1.77 2.56 3.53 2.59 3.6 A 0.75 0.75 0 0 1 23.19 12.31 Z" />
    </Svg>
  );
};
const EyeOffIcon = assignWithoutSideEffects(_EyeOffIcon, {
  componentId: 'EyeOffIcon',
});
export default EyeOffIcon;