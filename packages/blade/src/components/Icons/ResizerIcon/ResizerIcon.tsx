import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ResizerIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.30683 18.2095C3.89715 18.6192 3.89715 19.2834 4.30683 19.6931C4.7165 20.1027 5.38071 20.1027 5.79038 19.6931L19.6926 5.79081C20.1023 5.38114 20.1023 4.71693 19.6926 4.30725C19.283 3.89758 18.6188 3.89758 18.2091 4.30725L4.30683 18.2095ZM11.3005 18.2095C10.8909 18.6192 10.8909 19.2834 11.3005 19.6931C11.7102 20.1027 12.3744 20.1027 12.7841 19.6931L19.6928 12.7844C20.1025 12.3747 20.1025 11.7105 19.6928 11.3008C19.2831 10.8911 18.6189 10.8911 18.2092 11.3008L11.3005 18.2095Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ResizerIcon;
