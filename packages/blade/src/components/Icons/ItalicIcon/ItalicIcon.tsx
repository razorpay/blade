import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ItalicIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.0222 3.00024H19C19.5523 3.00024 20 3.44796 20 4.00024C20 4.55253 19.5523 5.00024 19 5.00024H15.693L10.443 19.0002H14C14.5523 19.0002 15 19.448 15 20.0002C15 20.5525 14.5523 21.0002 14 21.0002H9.02418C9.00802 21.0006 8.99181 21.0006 8.97557 21.0002H5C4.44772 21.0002 4 20.5525 4 20.0002C4 19.448 4.44772 19.0002 5 19.0002H8.30704L13.557 5.00024H10C9.44772 5.00024 9 4.55253 9 4.00024C9 3.44796 9.44772 3.00024 10 3.00024H14.9782C14.9928 2.99992 15.0075 2.99992 15.0222 3.00024Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ItalicIcon;
