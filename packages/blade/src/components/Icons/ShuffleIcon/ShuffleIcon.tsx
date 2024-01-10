import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ShuffleIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path
        d="M14 3a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v5a1 1 0 1 1-2 0V5.414L3.707 20.707a1 1 0 0 1-1.414-1.414L17.586 4H15a1 1 0 0 1-1-1ZM21 16a1 1 0 1 0-2 0v2.586l-4.293-4.293a1 1 0 0 0-1.414 1.414L17.586 20H15a1 1 0 1 0 0 2h5a1 1 0 0 0 1-1v-5ZM3.707 3.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 1.414-1.414l-5-5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ShuffleIcon;
