import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const LayoutIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5ZM10 20H19C19.5523 20 20 19.5523 20 19V10H10V20ZM8 10V20H5C4.44772 20 4 19.5523 4 19V10H8ZM20 8V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V8H20Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default LayoutIcon;
