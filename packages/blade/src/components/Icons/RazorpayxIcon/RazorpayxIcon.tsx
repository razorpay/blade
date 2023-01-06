import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const RazorpayXIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7596 2L4.1499 18.1112H7.49182L10.5152 14.1753L16.5258 22.0002H20.4316L12.3986 11.7234L19.8675 2H16.7596ZM10.145 9.079L7.82196 5.88974H4.15013L8.22818 11.3079L10.145 9.079Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default RazorpayXIcon;
