import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const EqualsIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 8C4.44772 8 4 8.44772 4 9C4 9.55228 4.44772 10 5 10H19C19.5523 10 20 9.55228 20 9C20 8.44772 19.5523 8 19 8H5ZM5 14C4.44772 14 4 14.4477 4 15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15C20 14.4477 19.5523 14 19 14H5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default EqualsIcon;
