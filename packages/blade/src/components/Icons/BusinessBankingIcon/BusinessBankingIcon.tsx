import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const BusinessBankingIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 2H16.5L10.4375 9.76L7.5 6H4L8.6875 12L4 18H7.5L10.4375 14.24L16.5 22H20L12.1875 12L20 2Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default BusinessBankingIcon;
