import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _HomeIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 20.56 10.19 l -7.5 -7.5 a 1.5 1.5 0 0 0 -2.12 0 l -7.5 7.5 A 1.49 1.49 0 0 0 3 11.25 v 9 a 0.75 0.75 0 0 0 0.75 0.75 h 6 a 0.75 0.75 0 0 0 0.75 -0.75 V 15 h 3 v 5.25 a 0.75 0.75 0 0 0 0.75 0.75 h 6 a 0.75 0.75 0 0 0 0.75 -0.75 V 11.25 A 1.49 1.49 0 0 0 20.56 10.19 Z M 19.5 19.5 H 15 V 14.25 a 0.75 0.75 0 0 0 -0.75 -0.75 H 9.75 a 0.75 0.75 0 0 0 -0.75 0.75 v 5.25 H 4.5 V 11.25 l 7.5 -7.5 7.5 7.5 Z" />
    </Svg>
  );
};
const HomeIcon = assignWithoutSideEffects(_HomeIcon, {
  componentId: 'HomeIcon',
});
export default HomeIcon;