import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _UploadIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21 13.5 v 6 a 0.75 0.75 0 0 1 -0.75 0.75 H 3.75 a 0.75 0.75 0 0 1 -0.75 -0.75 V 13.5 a 0.75 0.75 0 0 1 1.5 0 v 5.25 H 19.5 V 13.5 a 0.75 0.75 0 0 1 1.5 0 Z M 8.78 7.28 11.25 4.81 V 13.5 a 0.75 0.75 0 0 0 1.5 0 V 4.81 l 2.47 2.47 a 0.75 0.75 0 0 0 1.06 -1.06 l -3.75 -3.75 a 0.75 0.75 0 0 0 -1.06 0 l -3.75 3.75 A 0.75 0.75 0 0 0 8.78 7.28 Z" />
    </Svg>
  );
};
const UploadIcon = assignWithoutSideEffects(_UploadIcon, {
  componentId: 'UploadIcon',
});
export default UploadIcon;