import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const KeyboardIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 5C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44771 20.5523 5 20 5H4ZM1 6C1 4.34315 2.34315 3 4 3H20C21.6569 3 23 4.34315 23 6V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V6ZM5 8C5 7.44772 5.44772 7 6 7H6.01C6.56228 7 7.01 7.44772 7.01 8C7.01 8.55228 6.56228 9 6.01 9H6C5.44772 9 5 8.55228 5 8ZM9 8C9 7.44772 9.44772 7 10 7H10.01C10.5623 7 11.01 7.44772 11.01 8C11.01 8.55228 10.5623 9 10.01 9H10C9.44772 9 9 8.55228 9 8ZM13 8C13 7.44772 13.4477 7 14 7H14.01C14.5623 7 15.01 7.44772 15.01 8C15.01 8.55228 14.5623 9 14.01 9H14C13.4477 9 13 8.55228 13 8ZM17 8C17 7.44772 17.4477 7 18 7H18.01C18.5623 7 19.01 7.44772 19.01 8C19.01 8.55228 18.5623 9 18.01 9H18C17.4477 9 17 8.55228 17 8ZM7 12C7 11.4477 7.44772 11 8 11H8.01C8.56228 11 9.01 11.4477 9.01 12C9.01 12.5523 8.56228 13 8.01 13H8C7.44772 13 7 12.5523 7 12ZM11 12C11 11.4477 11.4477 11 12 11H12.01C12.5623 11 13.01 11.4477 13.01 12C13.01 12.5523 12.5623 13 12.01 13H12C11.4477 13 11 12.5523 11 12ZM15 12C15 11.4477 15.4477 11 16 11H16.01C16.5623 11 17.01 11.4477 17.01 12C17.01 12.5523 16.5623 13 16.01 13H16C15.4477 13 15 12.5523 15 12ZM6 16C6 15.4477 6.44772 15 7 15H17C17.5523 15 18 15.4477 18 16C18 16.5523 17.5523 17 17 17H7C6.44772 17 6 16.5523 6 16Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default KeyboardIcon;