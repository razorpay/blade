import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const LeftCircularCornerIcon: IconComponent = ({
  size,
  color,
  ...styledProps
}) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg
      {...styledProps}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 12C4 8.13401 7.13401 5 11 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H11C8.23858 7 6 9.23858 6 12C6 14.7614 8.23858 17 11 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H11C7.13401 19 4 15.866 4 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default LeftCircularCornerIcon;
