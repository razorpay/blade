import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ToggleLeftIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 8C5.79086 8 4 9.79086 4 12C4 14.2091 5.79086 16 8 16C10.2091 16 12 14.2091 12 12C12 9.79086 10.2091 8 8 8ZM6 12C6 10.8954 6.89543 10 8 10C9.10457 10 10 10.8954 10 12C10 13.1046 9.10457 14 8 14C6.89543 14 6 13.1046 6 12Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 4C3.58172 4 0 7.58172 0 12C0 16.4183 3.58172 20 8 20H16C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4H8ZM2 12C2 8.68629 4.68629 6 8 6H16C19.3137 6 22 8.68629 22 12C22 15.3137 19.3137 18 16 18H8C4.68629 18 2 15.3137 2 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ToggleLeftIcon;
