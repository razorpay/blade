import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _BellIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 20.79 16.49 C 20.27 15.6 19.5 13.06 19.5 9.75 a 7.5 7.5 0 1 0 -15 0 c 0 3.31 -0.77 5.85 -1.29 6.74 A 1.5 1.5 0 0 0 4.5 18.75 H 8.33 a 3.75 3.75 0 0 0 7.35 0 H 19.5 a 1.5 1.5 0 0 0 1.29 -2.26 Z M 12 20.25 a 2.25 2.25 0 0 1 -2.12 -1.5 h 4.24 A 2.25 2.25 0 0 1 12 20.25 Z M 4.5 17.25 c 0.72 -1.24 1.5 -4.12 1.5 -7.5 a 6 6 0 1 1 12 0 c 0 3.38 0.78 6.26 1.5 7.5 Z" />
    </Svg>
  );
};
const BellIcon = assignWithoutSideEffects(_BellIcon, {
  componentId: 'BellIcon',
});
export default BellIcon;