import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const MoreHorizontalIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 12C17 10.3431 18.3431 9 20 9C21.6569 9 23 10.3431 23 12C23 13.6569 21.6569 15 20 15C18.3431 15 17 13.6569 17 12Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12C1 10.3431 2.34315 9 4 9C5.65685 9 7 10.3431 7 12C7 13.6569 5.65685 15 4 15C2.34315 15 1 13.6569 1 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default MoreHorizontalIcon;
