import { Svg, Circle } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const DotIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8" fill={iconColor} />
    </Svg>
  );
};

export default DotIcon;
