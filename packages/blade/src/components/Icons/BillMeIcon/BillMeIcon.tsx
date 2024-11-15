import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const BillMeIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 6C8 5.44772 8.39797 5 8.88889 5H15.1111C15.602 5 16 5.44772 16 6C16 6.55228 15.602 7 15.1111 7H8.88889C8.39797 7 8 6.55228 8 6Z"
        fill={iconColor}
      />
      <Path
        d="M8.88889 8C8.39797 8 8 8.44772 8 9C8 9.55229 8.39797 10 8.88889 10H15.1111C15.602 10 16 9.55229 16 9C16 8.44772 15.602 8 15.1111 8H8.88889Z"
        fill={iconColor}
      />
      <Path
        d="M8 12C8 11.4477 8.35817 11 8.8 11H11.2C11.6418 11 12 11.4477 12 12C12 12.5523 11.6418 13 11.2 13H8.8C8.35817 13 8 12.5523 8 12Z"
        fill={iconColor}
      />
      <Path
        d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 1C4.89543 1 4 1.89543 4 3V21C4 22.1046 4.89543 23 6 23H18C19.1046 23 20 22.1046 20 21V3C20 1.89543 19.1046 1 18 1H6ZM18 3H6V21H18V3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default BillMeIcon;
