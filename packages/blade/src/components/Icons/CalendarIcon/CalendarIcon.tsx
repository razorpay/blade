import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _CalendarIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 19.5 3 H 17.25 V 2.25 a 0.75 0.75 0 0 0 -1.5 0 v 0.75 H 8.25 V 2.25 a 0.75 0.75 0 0 0 -1.5 0 v 0.75 H 4.5 A 1.5 1.5 0 0 0 3 4.5 V 19.5 a 1.5 1.5 0 0 0 1.5 1.5 H 19.5 a 1.5 1.5 0 0 0 1.5 -1.5 V 4.5 A 1.5 1.5 0 0 0 19.5 3 Z M 6.75 4.5 v 0.75 a 0.75 0.75 0 0 0 1.5 0 V 4.5 h 7.5 v 0.75 a 0.75 0.75 0 0 0 1.5 0 V 4.5 h 2.25 V 7.5 H 4.5 V 4.5 Z M 19.5 19.5 H 4.5 V 9 H 19.5 V 19.5 Z m -9 -8.25 v 6 a 0.75 0.75 0 0 1 -1.5 0 V 12.46 l -0.41 0.21 a 0.75 0.75 0 0 1 -0.67 -1.34 l 1.5 -0.75 A 0.75 0.75 0 0 1 10.5 11.25 Z m 5.55 2.85 L 14.25 16.5 h 1.5 a 0.75 0.75 0 0 1 0 1.5 H 12.75 a 0.75 0.75 0 0 1 -0.6 -1.2 l 2.7 -3.6 A 0.75 0.75 0 1 0 13.6 12.38 a 0.75 0.75 0 1 1 -1.3 -0.75 A 2.25 2.25 0 0 1 16.5 12.75 2.23 2.23 0 0 1 16.05 14.1 Z" />
    </Svg>
  );
};
const CalendarIcon = assignWithoutSideEffects(_CalendarIcon, {
  componentId: 'CalendarIcon',
});
export default CalendarIcon;