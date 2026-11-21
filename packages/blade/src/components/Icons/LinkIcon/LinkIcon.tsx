import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _LinkIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 22.5 8.27 a 5.1 5.1 0 0 1 -1.5 3.47 L 17.74 15 a 5.09 5.09 0 0 1 -3.62 1.5 h 0 A 5.12 5.12 0 0 1 9 11.24 a 0.75 0.75 0 0 1 1.5 0.04 A 3.62 3.62 0 0 0 14.12 15 h 0 a 3.6 3.6 0 0 0 2.56 -1.06 l 3.26 -3.26 a 3.62 3.62 0 0 0 -5.12 -5.12 l -1.03 1.03 A 0.75 0.75 0 0 1 12.72 5.53 l 1.03 -1.03 A 5.12 5.12 0 0 1 21 4.5 5.14 5.14 0 0 1 22.5 8.27 Z M 10.22 17.41 l -1.03 1.03 A 3.6 3.6 0 0 1 6.62 19.5 h 0 a 3.62 3.62 0 0 1 -2.56 -6.18 L 7.31 10.06 A 3.62 3.62 0 0 1 13.5 12.72 a 0.75 0.75 0 0 0 1.5 0.04 A 5.14 5.14 0 0 0 13.5 9 a 5.12 5.12 0 0 0 -7.24 0 L 3 12.26 A 5.12 5.12 0 0 0 6.62 21 h 0 a 5.09 5.09 0 0 0 3.62 -1.5 l 1.03 -1.03 A 0.75 0.75 0 0 0 10.22 17.41 Z" />
    </Svg>
  );
};
const LinkIcon = assignWithoutSideEffects(_LinkIcon, {
  componentId: 'LinkIcon',
});
export default LinkIcon;