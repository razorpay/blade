import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const MicIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C9.79086 0 8 1.79086 8 4V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V4C16 1.79086 14.2091 0 12 0ZM10 4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V4Z"
        fill={iconColor}
      />
      <Path
        d="M6 10C6 9.44771 5.55228 9 5 9C4.44772 9 4 9.44771 4 10V12C4 16.0796 7.05369 19.446 11 19.9381V22H8C7.44772 22 7 22.4477 7 23C7 23.5523 7.44772 24 8 24H16C16.5523 24 17 23.5523 17 23C17 22.4477 16.5523 22 16 22H13V19.9381C16.9463 19.446 20 16.0796 20 12V10C20 9.44771 19.5523 9 19 9C18.4477 9 18 9.44771 18 10V12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12V10Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default MicIcon;
