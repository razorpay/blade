import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PosIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 2C4 1.44772 4.44772 1 5 1L19 1C19.5523 1 20 1.44772 20 2C20 2.55228 19.5523 3 19 3L5 3C4.44772 3 4 2.55229 4 2Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 19.5C8 18.9477 8.44772 18.5 9 18.5L15 18.5C15.5523 18.5 16 18.9477 16 19.5C16 20.0523 15.5523 20.5 15 20.5L9 20.5C8.44772 20.5 8 20.0523 8 19.5Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 13C6 13.5523 6.44772 14 7 14H17C17.5523 14 18 13.5523 18 13V7C18 6.44772 17.5523 6 17 6H7C6.44772 6 6 6.44772 6 7V13ZM18 15.8293C17.6872 15.9398 17.3506 16 17 16H7C6.64936 16 6.31278 15.9398 6 15.8293V21.2C6 21.5453 6.346 22 7 22H17C17.654 22 18 21.5453 18 21.2V15.8293ZM7 4C5.44486 4 4 5.1571 4 6.8V21.2C4 22.8429 5.44486 24 7 24H17C18.5551 24 20 22.8429 20 21.2V6.8C20 5.1571 18.5551 4 17 4H7Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PosIcon;
