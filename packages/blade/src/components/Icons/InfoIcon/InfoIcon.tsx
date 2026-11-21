import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _InfoIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 12 2.25 A 9.75 9.75 0 1 0 21.75 12 9.76 9.76 0 0 0 12 2.25 Z m 0 18 a 8.25 8.25 0 1 1 8.25 -8.25 A 8.26 8.26 0 0 1 12 20.25 Z m 1.5 -3.75 a 0.75 0.75 0 0 1 -0.75 0.75 1.5 1.5 0 0 1 -1.5 -1.5 V 12 a 0.75 0.75 0 0 1 0 -1.5 1.5 1.5 0 0 1 1.5 1.5 v 3.75 A 0.75 0.75 0 0 1 13.5 16.5 Z M 10.5 7.88 a 1.13 1.13 0 1 1 1.13 1.13 A 1.13 1.13 0 0 1 10.5 7.88 Z" />
    </Svg>
  );
};
const InfoIcon = assignWithoutSideEffects(_InfoIcon, {
  componentId: 'InfoIcon',
});
export default InfoIcon;