import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const DashboardIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.7778 2H4.22222C3 2 2 3 2 4.22222V19.7778C2 21 3 22 4.22222 22H19.7778C21 22 22 21 22 19.7778V4.22222C22 3 21 2 19.7778 2ZM8.66667 17.5556H6.44444V9.77778H8.66667V17.5556ZM13.1111 17.5556H10.8889V6.44444H13.1111V17.5556ZM17.5556 17.5556H15.3333V13.1111H17.5556V17.5556Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default DashboardIcon;
