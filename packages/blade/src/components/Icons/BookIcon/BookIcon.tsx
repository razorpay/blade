import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const BookIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 2C21 1.44772 20.5523 1 20 1H6.5C4.567 1 3 2.567 3 4.5V19.5C3 21.433 4.567 23 6.5 23H20C20.5523 23 21 22.5523 21 22V2ZM5 4.5C5 3.67157 5.67157 3 6.5 3H19V16H6.5C5.9632 16 5.45463 16.1208 5 16.3368V4.5ZM5 19.5C5 20.3284 5.67157 21 6.5 21H19V18H6.5C5.67157 18 5 18.6716 5 19.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default BookIcon;
