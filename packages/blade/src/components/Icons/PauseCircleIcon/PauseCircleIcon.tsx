import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PauseCircleIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 8C10.5523 8 11 8.44772 11 9V15C11 15.5523 10.5523 16 10 16C9.44771 16 9 15.5523 9 15V9C9 8.44772 9.44771 8 10 8Z"
        fill={iconColor}
      />
      <Path
        d="M15 9C15 8.44772 14.5523 8 14 8C13.4477 8 13 8.44772 13 9V15C13 15.5523 13.4477 16 14 16C14.5523 16 15 15.5523 15 15V9Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PauseCircleIcon;
