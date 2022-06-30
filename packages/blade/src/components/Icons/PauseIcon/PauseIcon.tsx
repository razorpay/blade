import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const PauseIcon = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 0C0.447715 0 0 0.447715 0 1V17C0 17.5523 0.447715 18 1 18H5C5.55228 18 6 17.5523 6 17V1C6 0.447715 5.55228 0 5 0H1ZM2 16V2H4V16H2Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0C8.44771 0 8 0.447715 8 1V17C8 17.5523 8.44771 18 9 18H13C13.5523 18 14 17.5523 14 17V1C14 0.447715 13.5523 0 13 0H9ZM10 16V2H12V16H10Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PauseIcon;
