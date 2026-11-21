import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _EyeIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 23.19 11.7 c -0.03 -0.07 -0.83 -1.84 -2.59 -3.6 C 18.24 5.74 15.27 4.5 12 4.5 S 5.76 5.74 3.41 8.1 C 1.64 9.86 0.84 11.63 0.81 11.7 a 0.75 0.75 0 0 0 0 0.61 c 0.03 0.07 0.83 1.83 2.59 3.6 C 5.76 18.26 8.73 19.5 12 19.5 s 6.24 -1.24 8.59 -3.59 c 1.77 -1.77 2.56 -3.53 2.59 -3.6 A 0.75 0.75 0 0 0 23.19 11.7 Z M 12 18 c -2.89 0 -5.41 -1.05 -7.49 -3.12 A 12.51 12.51 0 0 1 2.34 12 12.5 12.5 0 0 1 4.51 9.12 C 6.59 7.05 9.11 6 12 6 s 5.41 1.05 7.49 3.12 A 12.51 12.51 0 0 1 21.66 12 C 20.99 13.26 18.04 18 12 18 Z m 0 -10.5 a 4.5 4.5 0 1 0 4.5 4.5 A 4.5 4.5 0 0 0 12 7.5 Z m 0 7.5 a 3 3 0 1 1 3 -3 A 3 3 0 0 1 12 15 Z" />
    </Svg>
  );
};
const EyeIcon = assignWithoutSideEffects(_EyeIcon, {
  componentId: 'EyeIcon',
});
export default EyeIcon;