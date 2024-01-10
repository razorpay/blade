import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const BriefcaseIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2C8.34315 2 7 3.34315 7 5V6H4C2.34315 6 1 7.34315 1 9V19C1 20.6569 2.34315 22 4 22H8H16H20C21.6569 22 23 20.6569 23 19V9C23 7.34315 21.6569 6 20 6H17V5C17 3.34315 15.6569 2 14 2H10ZM15 6V5C15 4.44772 14.5523 4 14 4H10C9.44772 4 9 4.44772 9 5V6H15ZM9 8H15V20H9V8ZM7 8H4C3.44772 8 3 8.44772 3 9V19C3 19.5523 3.44772 20 4 20H7V8ZM17 20V8H20C20.5523 8 21 8.44772 21 9V19C21 19.5523 20.5523 20 20 20H17Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default BriefcaseIcon;
