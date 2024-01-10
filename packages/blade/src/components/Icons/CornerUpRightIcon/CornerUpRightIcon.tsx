import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CornerUpRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.7071 3.29289C15.3166 2.90237 14.6834 2.90237 14.2929 3.29289C13.9024 3.68342 13.9024 4.31658 14.2929 4.70711L17.5858 8H8C5.23858 8 3 10.2386 3 13V20C3 20.5523 3.44772 21 4 21C4.55228 21 5 20.5523 5 20V13C5 11.3431 6.34315 10 8 10H17.5858L14.2929 13.2929C13.9024 13.6834 13.9024 14.3166 14.2929 14.7071C14.6834 15.0976 15.3166 15.0976 15.7071 14.7071L20.7071 9.70711C21.0976 9.31658 21.0976 8.68342 20.7071 8.29289L15.7071 3.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CornerUpRightIcon;
