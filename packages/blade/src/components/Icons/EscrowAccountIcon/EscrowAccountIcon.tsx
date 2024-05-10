import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const EscrowAccountIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4C3 2.34315 4.34315 1 6 1H18C19.6569 1 21 2.34315 21 4V20C21 21.6569 19.6569 23 18 23H6C4.34315 23 3 21.6569 3 20V4ZM12 3H8.5V6.31546L9.53172 5.7527C9.97944 5.50849 10.5206 5.50849 10.9683 5.7527L12 6.31546V3ZM6.5 3H6C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V4C19 3.44772 18.5523 3 18 3H14V7.15773C14 8.29632 12.7813 9.01979 11.7817 8.47457L10.25 7.63909L8.71828 8.47457C7.71872 9.01979 6.5 8.29632 6.5 7.15773V3ZM7 17C7 16.4477 7.44772 16 8 16H13C13.5523 16 14 16.4477 14 17C14 17.5523 13.5523 18 13 18H8C7.44772 18 7 17.5523 7 17Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default EscrowAccountIcon;
