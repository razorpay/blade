import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CheckSquareIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 5C3 4.44772 3.44772 4 4 4H15C15.5523 4 16 3.55228 16 3C16 2.44772 15.5523 2 15 2H4C2.34315 2 1 3.34315 1 5V19C1 20.6569 2.34315 22 4 22H18C19.6569 22 21 20.6569 21 19V12C21 11.4477 20.5523 11 20 11C19.4477 11 19 11.4477 19 12V19C19 19.5523 18.5523 20 18 20H4C3.44772 20 3 19.5523 3 19V5Z"
        fill={iconColor}
      />
      <Path
        d="M11.7071 14.7071L22.7071 3.70711C23.0976 3.31658 23.0976 2.68342 22.7071 2.29289C22.3166 1.90237 21.6834 1.90237 21.2929 2.29289L11 12.5858L8.70711 10.2929C8.31658 9.90237 7.68342 9.90237 7.29289 10.2929C6.90237 10.6834 6.90237 11.3166 7.29289 11.7071L10.2929 14.7071C10.6834 15.0976 11.3166 15.0976 11.7071 14.7071Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CheckSquareIcon;
