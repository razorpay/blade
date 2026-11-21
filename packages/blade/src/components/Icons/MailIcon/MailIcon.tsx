import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _MailIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21 4.5 H 3 a 0.75 0.75 0 0 0 -0.75 0.75 V 18 a 1.5 1.5 0 0 0 1.5 1.5 H 20.25 a 1.5 1.5 0 0 0 1.5 -1.5 V 5.25 A 0.75 0.75 0 0 0 21 4.5 Z m -9 7.98 L 4.93 6 H 19.07 Z M 9.25 12 3.75 17.04 V 6.96 Z m 1.11 1.02 1.13 1.04 a 0.75 0.75 0 0 0 1.01 0 l 1.13 -1.04 5.44 4.98 H 4.93 Z M 14.75 12 20.25 6.95 V 17.05 Z" />
    </Svg>
  );
};
const MailIcon = assignWithoutSideEffects(_MailIcon, {
  componentId: 'MailIcon',
});
export default MailIcon;