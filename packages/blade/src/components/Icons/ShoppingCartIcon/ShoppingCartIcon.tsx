import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ShoppingCartIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 0C0.447715 0 0 0.447715 0 1C0 1.28581 0.119901 1.54361 0.312146 1.72585C0.491389 1.89577 0.733522 2 1 2H3.24911C3.75029 2.00107 4.17343 2.37381 4.23859 2.87081L5.75859 14.3908C5.95576 15.8918 7.24033 17.0105 8.75378 17H19.3113C20.7593 17.0227 22.0175 16.0073 22.3006 14.5862L22.3008 14.5848L23.9805 6.19634C24.0394 5.90254 23.9634 5.59784 23.7734 5.3661C23.5835 5.13436 23.2996 5 23 5H6.53686L6.22146 2.60958C6.02571 1.11819 4.75574 0.00227875 3.25151 0H1ZM7.74141 14.1292L6.80075 7H21.7799L20.3395 14.1937L20.3392 14.1952C20.2448 14.6703 19.8235 15.0095 19.3392 15.0002L19.32 15L8.75 15L8.74152 15C8.23626 15.0043 7.80708 14.6302 7.74141 14.1292Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 21C5 19.3431 6.34315 18 8 18C9.65685 18 11 19.3431 11 21C11 22.6569 9.65685 24 8 24C6.34315 24 5 22.6569 5 21ZM8 20C7.44772 20 7 20.4477 7 21C7 21.5523 7.44772 22 8 22C8.55228 22 9 21.5523 9 21C9 20.4477 8.55228 20 8 20Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 21C17 19.3431 18.3431 18 20 18C21.6569 18 23 19.3431 23 21C23 22.6569 21.6569 24 20 24C18.3431 24 17 22.6569 17 21ZM20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ShoppingCartIcon;
