import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const RefreshClockWiseIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.229 4.2a8 8 0 0 1 7.446 2.169L20.525 9H17a1 1 0 1 0 0 2h6a1 1 0 0 0 1-1V4a1 1 0 1 0-2 0v3.64l-2.944-2.718A10 10 0 0 0 2.567 8.666a1 1 0 0 0 1.886.668A8 8 0 0 1 10.229 4.2ZM2 16.36V20a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H3.474l2.85 2.631a8 8 0 0 0 13.223-2.965 1 1 0 0 1 1.886.668 10 10 0 0 1-16.489 3.744L2 16.361Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default RefreshClockWiseIcon;
