import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _ShareIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21.53 10.28 l -4.5 4.5 a 0.75 0.75 0 0 1 -1.06 -1.06 L 19.19 10.5 H 15.47 a 8.25 8.25 0 0 0 -7.99 6.19 0.75 0.75 0 0 1 -1.45 -0.37 A 9.74 9.74 0 0 1 15.47 9 h 3.72 L 15.97 5.78 a 0.75 0.75 0 0 1 1.06 -1.06 l 4.5 4.5 A 0.75 0.75 0 0 1 21.53 10.28 Z M 18 19.5 H 3.75 V 8.25 a 0.75 0.75 0 0 0 -1.5 0 V 20.25 a 0.75 0.75 0 0 0 0.75 0.75 H 18 a 0.75 0.75 0 0 0 0 -1.5 Z" />
    </Svg>
  );
};
const ShareIcon = assignWithoutSideEffects(_ShareIcon, {
  componentId: 'ShareIcon',
});
export default ShareIcon;