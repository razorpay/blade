import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const BoldIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3C4.44772 3 4 3.44772 4 4V20C4 20.5523 4.44772 21 5 21H14C16.7614 21 19 18.7614 19 16C19 14.123 17.9657 12.4875 16.4359 11.6325C17.3991 10.7211 18 9.43071 18 8C18 5.23858 15.7614 3 13 3H5ZM13 11C14.6569 11 16 9.65685 16 8C16 6.34315 14.6569 5 13 5H6V11H13ZM6 13V19H14C15.6569 19 17 17.6569 17 16C17 14.3431 15.6569 13 14 13H6Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default BoldIcon;
