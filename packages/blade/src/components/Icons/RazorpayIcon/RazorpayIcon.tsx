import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const RazorpayIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.71749 12.3339L10.7149 8.66299L21 2L15.4844 22.5753L11.6926 22.5722L15.4262 8.64209L9.71749 12.3339ZM3 22.5756L4.57044 16.7193L13.9519 10.6624L10.7718 22.5756H3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default RazorpayIcon;
