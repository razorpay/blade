import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const HistoryIcon = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.944 4.921a10 10 0 1 1-2.377 10.411 1 1 0 1 1 1.886-.664 8 8 0 1 0 1.872-8.3L4.475 9H8a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1V4a1 1 0 1 1 2 0v3.64L5.944 4.92ZM12 6a1 1 0 0 1 1 1v5.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-3-3A1 1 0 0 1 11 13V7a1 1 0 0 1 1-1Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default HistoryIcon;
