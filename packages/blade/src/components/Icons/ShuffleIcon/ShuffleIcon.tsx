import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ShuffleIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 3C14 2.44772 14.4477 2 15 2H20C20.5523 2 21 2.44772 21 3V8C21 8.55228 20.5523 9 20 9C19.4477 9 19 8.55228 19 8V5.41421L3.70711 20.7071C3.31658 21.0976 2.68342 21.0976 2.29289 20.7071C1.90237 20.3166 1.90237 19.6834 2.29289 19.2929L17.5858 4H15C14.4477 4 14 3.55228 14 3Z"
        fill={iconColor}
      />
      <Path
        d="M21 16C21 15.4477 20.5523 15 20 15C19.4477 15 19 15.4477 19 16V18.5858L14.7071 14.2929C14.3166 13.9024 13.6834 13.9024 13.2929 14.2929C12.9024 14.6834 12.9024 15.3166 13.2929 15.7071L17.5858 20H15C14.4477 20 14 20.4477 14 21C14 21.5523 14.4477 22 15 22H20C20.5523 22 21 21.5523 21 21V16Z"
        fill={iconColor}
      />
      <Path
        d="M3.70711 3.29289C3.31658 2.90237 2.68342 2.90237 2.29289 3.29289C1.90237 3.68342 1.90237 4.31658 2.29289 4.70711L7.29289 9.70711C7.68342 10.0976 8.31658 10.0976 8.70711 9.70711C9.09763 9.31658 9.09763 8.68342 8.70711 8.29289L3.70711 3.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ShuffleIcon;
