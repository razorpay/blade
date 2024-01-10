import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14.707 5.293a1 1 0 1 0-1.414 1.414L17.586 11H4a1 1 0 1 0 0 2h13.586l-4.293 4.293a1 1 0 0 0 1.414 1.414l6-6a1 1 0 0 0 0-1.414l-6-6Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowRightIcon;
