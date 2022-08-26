import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowUpIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12.707 3.293a1 1 0 0 0-1.414 0l-6 6a1 1 0 0 0 1.414 1.414L11 6.414V20a1 1 0 1 0 2 0V6.414l4.293 4.293a1 1 0 0 0 1.414-1.414l-6-6Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowUpIcon;
