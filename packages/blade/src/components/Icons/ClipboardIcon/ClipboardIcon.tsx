import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ClipboardIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1C7.89543 1 7 1.89543 7 3H6C4.34315 3 3 4.34315 3 6V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V6C21 4.34315 19.6569 3 18 3H17C17 1.89543 16.1046 1 15 1H9ZM17 5C17 6.10457 16.1046 7 15 7H9C7.89543 7 7 6.10457 7 5H6C5.44772 5 5 5.44772 5 6V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V6C19 5.44772 18.5523 5 18 5H17ZM9 4V5H15V4V3H9V4Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ClipboardIcon;
