import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _EditIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21.31 6.88 17.12 2.69 a 1.5 1.5 0 0 0 -2.12 0 L 3.44 14.25 A 1.49 1.49 0 0 0 3 15.31 V 19.5 a 1.5 1.5 0 0 0 1.5 1.5 H 8.69 A 1.49 1.49 0 0 0 9.75 20.56 L 21.31 9 a 1.5 1.5 0 0 0 0 -2.12 Z M 8.69 19.5 H 4.5 V 15.31 l 8.25 -8.25 L 16.94 11.25 Z M 18 10.19 13.81 6 l 2.25 -2.25 L 20.25 7.94 Z" />
    </Svg>
  );
};
const EditIcon = assignWithoutSideEffects(_EditIcon, {
  componentId: 'EditIcon',
});
export default EditIcon;