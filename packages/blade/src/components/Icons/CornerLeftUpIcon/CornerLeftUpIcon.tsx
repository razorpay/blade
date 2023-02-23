import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CornerLeftUpIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.70711 3.29289C9.31658 2.90237 8.68342 2.90237 8.29289 3.29289L3.29289 8.29289C2.90237 8.68342 2.90237 9.31658 3.29289 9.70711C3.68342 10.0976 4.31658 10.0976 4.70711 9.70711L8 6.41421V16C8 18.7614 10.2386 21 13 21H20C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19H13C11.3431 19 10 17.6569 10 16V6.41421L13.2929 9.70711C13.6834 10.0976 14.3166 10.0976 14.7071 9.70711C15.0976 9.31658 15.0976 8.68342 14.7071 8.29289L9.70711 3.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CornerLeftUpIcon;
