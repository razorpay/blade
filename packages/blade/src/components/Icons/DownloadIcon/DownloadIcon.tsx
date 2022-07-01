import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const DownloadIcon = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2a1 1 0 1 0-2 0v11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l4 4 .007.007a.996.996 0 0 0 .697.286h.006c.272 0 .518-.11.697-.286l.008-.008 4-3.999a1 1 0 0 0-1.415-1.414L13 13.586V2Z"
        fill={iconColor}
      />
      <Path
        d="M3 16a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3a1 1 0 1 1 2 0v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-3a1 1 0 0 1 1-1Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default DownloadIcon;
