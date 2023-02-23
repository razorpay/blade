import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const UserMinusIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 7C3.5 4.23858 5.73858 2 8.5 2C11.2614 2 13.5 4.23858 13.5 7C13.5 9.76142 11.2614 12 8.5 12C5.73858 12 3.5 9.76142 3.5 7ZM8.5 4C6.84315 4 5.5 5.34315 5.5 7C5.5 8.65685 6.84315 10 8.5 10C10.1569 10 11.5 8.65685 11.5 7C11.5 5.34315 10.1569 4 8.5 4Z"
        fill={iconColor}
      />
      <Path
        d="M0 19C0 16.2386 2.23858 14 5 14H12C14.7614 14 17 16.2386 17 19V21C17 21.5523 16.5523 22 16 22C15.4477 22 15 21.5523 15 21V19C15 17.3431 13.6569 16 12 16H5C3.34315 16 2 17.3431 2 19V21C2 21.5523 1.55228 22 1 22C0.447715 22 0 21.5523 0 21V19Z"
        fill={iconColor}
      />
      <Path
        d="M17 10C16.4477 10 16 10.4477 16 11C16 11.5523 16.4477 12 17 12H23C23.5523 12 24 11.5523 24 11C24 10.4477 23.5523 10 23 10H17Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default UserMinusIcon;
