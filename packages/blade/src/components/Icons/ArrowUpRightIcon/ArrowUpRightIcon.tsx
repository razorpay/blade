import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowUpRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5a1 1 0 0 0 0 2h6.586L5.293 17.293a1 1 0 1 0 1.414 1.414L17 8.414V15a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1H9Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowUpRightIcon;
