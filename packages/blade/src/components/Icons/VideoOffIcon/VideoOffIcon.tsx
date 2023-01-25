import { Svg, G, Path, Defs, ClipPath, Rect } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const VideoOffIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_59_161)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L2.6108 4.02501C1.13781 4.21583 1.49012e-08 5.47504 1.49012e-08 7V17C1.49012e-08 18.6569 1.34315 20 3 20H14C15.2397 20 16.3038 19.248 16.761 18.1753L22.2929 23.7071C22.6834 24.0976 23.3166 24.0976 23.7071 23.7071C24.0976 23.3166 24.0976 22.6834 23.7071 22.2929L1.70711 0.292893ZM15 16.4142L4.58579 6H3C2.44772 6 2 6.44772 2 7V17C2 17.5523 2.44772 18 3 18H14C14.5523 18 15 17.5523 15 17V16.4142Z"
          fill={iconColor}
        />
        <Path
          d="M14 4H10.66C10.1077 4 9.66 4.44772 9.66 5C9.66 5.55228 10.1077 6 10.66 6H14C14.5523 6 15 6.44772 15 7V10.34C15 10.6052 15.1054 10.8596 15.2929 11.0471L16.2929 12.0471C16.6402 12.3944 17.1882 12.4381 17.5861 12.1503L22 8.95752V17C22 17.5523 22.4477 18 23 18C23.5523 18 24 17.5523 24 17V7C24 6.62434 23.7895 6.28037 23.4549 6.10947C23.1204 5.93857 22.7183 5.96958 22.4139 6.18975L17.1045 10.0303L17 9.92579V7C17 5.34315 15.6569 4 14 4Z"
          fill={iconColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_59_161">
          <Rect width="24" height="24" fill={iconColor} />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default VideoOffIcon;
