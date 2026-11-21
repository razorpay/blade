import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _DownloadIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21 13.5 v 6 a 0.75 0.75 0 0 1 -0.75 0.75 H 3.75 a 0.75 0.75 0 0 1 -0.75 -0.75 V 13.5 a 0.75 0.75 0 0 1 1.5 0 v 5.25 H 19.5 V 13.5 a 0.75 0.75 0 0 1 1.5 0 Z m -9.53 0.53 a 0.75 0.75 0 0 0 1.06 0 l 3.75 -3.75 a 0.75 0.75 0 0 0 -1.06 -1.06 L 12.75 11.69 V 3 a 0.75 0.75 0 0 0 -1.5 0 v 8.69 L 8.78 9.22 a 0.75 0.75 0 0 0 -1.06 1.06 Z" />
    </Svg>
  );
};
const DownloadIcon = assignWithoutSideEffects(_DownloadIcon, {
  componentId: 'DownloadIcon',
});
export default DownloadIcon;