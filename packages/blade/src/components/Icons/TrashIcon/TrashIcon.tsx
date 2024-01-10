import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const TrashIcon = ({ size, color, ...styledProps }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1ZM15 11a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0v-6Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 5V4a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1h4a1 1 0 1 1 0 2h-1v13a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7H3a1 1 0 0 1 0-2h4Zm2-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9V4Zm9 3v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7h12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TrashIcon;
