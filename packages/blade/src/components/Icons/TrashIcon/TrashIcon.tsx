import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _TrashIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 20.25 4.5 H 16.5 V 3.75 a 2.25 2.25 0 0 0 -2.25 -2.25 H 9.75 A 2.25 2.25 0 0 0 7.5 3.75 v 0.75 H 3.75 a 0.75 0.75 0 0 0 0 1.5 h 0.75 V 19.5 a 1.5 1.5 0 0 0 1.5 1.5 H 18 a 1.5 1.5 0 0 0 1.5 -1.5 V 6 h 0.75 a 0.75 0.75 0 0 0 0 -1.5 Z M 9 3.75 a 0.75 0.75 0 0 1 0.75 -0.75 h 4.5 a 0.75 0.75 0 0 1 0.75 0.75 v 0.75 H 9 Z m 9 15.75 H 6 V 6 H 18 Z M 10.5 9.75 v 6 a 0.75 0.75 0 0 1 -1.5 0 V 9.75 a 0.75 0.75 0 0 1 1.5 0 Z m 4.5 0 v 6 a 0.75 0.75 0 0 1 -1.5 0 V 9.75 a 0.75 0.75 0 0 1 1.5 0 Z" />
    </Svg>
  );
};
const TrashIcon = assignWithoutSideEffects(_TrashIcon, {
  componentId: 'TrashIcon',
});
export default TrashIcon;