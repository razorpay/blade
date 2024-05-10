import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PauseIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 3C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H10C10.5523 21 11 20.5523 11 20V4C11 3.44772 10.5523 3 10 3H6ZM7 19V5H9V19H7Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 3C13.4477 3 13 3.44772 13 4V20C13 20.5523 13.4477 21 14 21H18C18.5523 21 19 20.5523 19 20V4C19 3.44772 18.5523 3 18 3H14ZM15 19V5H17V19H15Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PauseIcon;
