import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const RoutesV1Icon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.7778 3H2.22222V5.25H21.7778V3ZM23 14.25V12L21.7778 6.375H2.22222L1 12V14.25H2.22222V21H14.4444V14.25H19.3333V21H21.7778V14.25H23ZM12 18.75H4.66667V14.25H12V18.75Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default RoutesV1Icon;
