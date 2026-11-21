import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _RefreshIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21 4.5 V 9 a 0.75 0.75 0 0 1 -0.75 0.75 H 15.75 a 0.75 0.75 0 0 1 0 -1.5 h 2.69 L 17.07 6.88 a 7.46 7.46 0 0 0 -5.26 -2.2 h -0.04 A 7.46 7.46 0 0 0 6.52 6.82 0.75 0.75 0 0 1 5.48 5.74 a 9 9 0 0 1 12.66 0.07 L 19.5 7.19 V 4.5 a 0.75 0.75 0 0 1 1.5 0 Z M 17.48 17.18 a 7.5 7.5 0 0 1 -10.54 -0.06 L 5.56 15.75 H 8.25 a 0.75 0.75 0 0 0 0 -1.5 H 3.75 a 0.75 0.75 0 0 0 -0.75 0.75 v 4.5 a 0.75 0.75 0 0 0 1.5 0 V 16.81 l 1.37 1.37 A 8.95 8.95 0 0 0 12.19 20.82 h 0.05 a 8.94 8.94 0 0 0 6.29 -2.56 0.75 0.75 0 0 0 -1.05 -1.07 Z" />
    </Svg>
  );
};
const RefreshIcon = assignWithoutSideEffects(_RefreshIcon, {
  componentId: 'RefreshIcon',
});
export default RefreshIcon;