import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ExternalLinkIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21 9.75 a 0.75 0.75 0 0 1 -1.5 0 V 5.56 l -6.22 6.22 a 0.75 0.75 0 0 1 -1.06 -1.06 L 18.44 4.5 H 14.25 a 0.75 0.75 0 0 1 0 -1.5 h 6 a 0.75 0.75 0 0 1 0.75 0.75 Z m -3.75 2.25 a 0.75 0.75 0 0 0 -0.75 0.75 v 6.75 H 4.5 V 7.5 h 6.75 a 0.75 0.75 0 0 0 0 -1.5 H 4.5 A 1.5 1.5 0 0 0 3 7.5 V 19.5 a 1.5 1.5 0 0 0 1.5 1.5 H 16.5 a 1.5 1.5 0 0 0 1.5 -1.5 V 12.75 A 0.75 0.75 0 0 0 17.25 12 Z" />
    </Svg>
  );
};
const ExternalLinkIcon = assignWithoutSideEffects(_ExternalLinkIcon, {
  componentId: 'ExternalLinkIcon',
});
export default ExternalLinkIcon;