import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _WifiIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 13.13 19.13 a 1.13 1.13 0 1 1 -1.12 -1.12 A 1.13 1.13 0 0 1 13.13 19.13 Z M 22.23 8.16 A 16.13 16.13 0 0 0 1.77 8.16 0.75 0.75 0 0 0 2.73 9.32 a 14.63 14.63 0 0 1 18.55 0 A 0.75 0.75 0 0 0 22.23 8.16 Z M 19.22 11.51 a 11.63 11.63 0 0 0 -14.43 0 A 0.75 0.75 0 0 0 5.72 12.69 a 10.13 10.13 0 0 1 12.57 0 0.75 0.75 0 0 0 1.05 -0.12 A 0.75 0.75 0 0 0 19.22 11.51 Z m -3.02 3.35 a 7.13 7.13 0 0 0 -8.38 0 0.75 0.75 0 0 0 0.88 1.21 5.63 5.63 0 0 1 6.62 0 0.75 0.75 0 1 0 0.88 -1.21 Z" />
    </Svg>
  );
};
const WifiIcon = assignWithoutSideEffects(_WifiIcon, {
  componentId: 'WifiIcon',
});
export default WifiIcon;