import { Svg, G, Path, Defs, ClipPath, Rect } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ThermometerIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_83_742)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.00006 3.5C8.00006 1.567 9.56706 0 11.5001 0C13.4331 0 15.0001 1.567 15.0001 3.5V14.2588C16.6983 15.6585 17.4124 17.958 16.7632 20.0982C16.06 22.4165 13.9227 24.0017 11.5001 24.0017C9.07744 24.0017 6.9401 22.4165 6.23687 20.0982C5.58769 17.958 6.30178 15.6585 8.00006 14.2588V3.5ZM11.5001 2C10.6716 2 10.0001 2.67157 10.0001 3.5V14.76C10.0001 15.094 9.83332 15.4059 9.55562 15.5915C8.27375 16.448 7.70325 18.0423 8.15076 19.5176C8.59827 20.9929 9.95839 22.0017 11.5001 22.0017C13.0417 22.0017 14.4018 20.9929 14.8494 19.5176C15.2969 18.0423 14.7264 16.448 13.4445 15.5915C13.1668 15.4059 13.0001 15.094 13.0001 14.76V3.5C13.0001 2.67157 12.3285 2 11.5001 2Z"
          fill={iconColor}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_83_742">
          <Rect width="24" height="24" fill={iconColor} />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default ThermometerIcon;
