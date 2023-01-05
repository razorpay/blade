import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const SmartCollectV2Icon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.105 10.429a1 1 0 0 0-1 1v5.333a1 1 0 0 0 1 1h1.158a1 1 0 0 0 1-1v-5.333a1 1 0 0 0-1-1H5.105Zm6.316 0a1 1 0 0 0-1 1v5.333a1 1 0 0 0 1 1h1.158a1 1 0 0 0 1-1v-5.333a1 1 0 0 0-1-1H11.42ZM2 22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1.143a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1V22Zm15.737-11.571a1 1 0 0 0-1 1v5.333a1 1 0 0 0 1 1h1.158a1 1 0 0 0 1-1v-5.333a1 1 0 0 0-1-1h-1.158Zm-5.273-9.186a1 1 0 0 0-.928 0l-9 4.714A1 1 0 0 0 2 6.843v.49a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-.49a1 1 0 0 0-.536-.886l-9-4.714Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default SmartCollectV2Icon;
