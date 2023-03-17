import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const MapIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 1C7.81313 1 7.63824 1.05126 7.4886 1.14048L0.503861 5.13176C0.192286 5.3098 0 5.64114 0 6V22C0 22.3565 0.189758 22.686 0.498073 22.8649C0.806388 23.0438 1.18664 23.0451 1.49614 22.8682L8.03147 19.1338L15.5348 22.8854C15.6646 22.9538 15.8112 22.9944 15.9669 22.9995C15.9779 22.9998 15.989 23 16 23C16.1869 23 16.3618 22.9487 16.5114 22.8595L23.4961 18.8682C23.8077 18.6902 24 18.3589 24 18V2C24 1.64353 23.8102 1.31401 23.5019 1.13509C23.1936 0.956168 22.8134 0.954898 22.5039 1.13176L15.9685 4.86623L8.46522 1.11457C8.32625 1.04141 8.16796 1 8 1ZM17 20.2768L22 17.4197V3.72318L17 6.58032V20.2768ZM15 6.61803L9 3.61803V17.382L15 20.382V6.61803ZM2 6.58032L7 3.72318V17.4197L2 20.2768V6.58032Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default MapIcon;
