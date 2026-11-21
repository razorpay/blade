import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ZapIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 20.23 11.08 a 0.75 0.75 0 0 0 -0.47 -0.53 L 14.36 8.52 l 1.37 -6.87 a 0.75 0.75 0 0 0 -1.28 -0.66 l -10.5 11.25 a 0.75 0.75 0 0 0 0.28 1.22 l 5.4 2.03 L 8.27 22.35 a 0.75 0.75 0 0 0 1.28 0.66 l 10.5 -11.25 A 0.75 0.75 0 0 0 20.23 11.08 Z M 10.25 20.06 l 0.98 -4.91 a 0.75 0.75 0 0 0 -0.47 -0.85 L 5.81 12.44 l 7.93 -8.5 L 12.77 8.85 a 0.75 0.75 0 0 0 0.47 0.85 l 4.95 1.86 Z" />
    </Svg>
  );
};
const ZapIcon = assignWithoutSideEffects(_ZapIcon, {
  componentId: 'ZapIcon',
});
export default ZapIcon;