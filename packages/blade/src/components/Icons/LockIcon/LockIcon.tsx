import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { Path, Svg } from '../_Svg';

const LockIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg height={height} width={width} viewBox="0 0 22 22" fill="none">
      <Path
        d="M4 9V6C4 2.68629 6.68629 0 10 0C13.3137 0 16 2.68629 16 6V9H17C18.6569 9 20 10.3431 20 12V19C20 20.6569 18.6569 22 17 22H3C1.34315 22 0 20.6569 0 19V12C0 10.3431 1.34315 9 3 9H4ZM6 6C6 3.79086 7.79086 2 10 2C12.2091 2 14 3.79086 14 6V9H6V6ZM3 11C2.44772 11 2 11.4477 2 12V19C2 19.5523 2.44772 20 3 20H17C17.5523 20 18 19.5523 18 19V12C18 11.4477 17.5523 11 17 11H3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default LockIcon;
