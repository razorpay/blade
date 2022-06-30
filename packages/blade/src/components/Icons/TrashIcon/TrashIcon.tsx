import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const TrashIcon = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 9C8.55229 9 9 9.44771 9 10V16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16V10C7 9.44771 7.44772 9 8 9Z"
        fill={iconColor}
      />
      <Path
        d="M13 10C13 9.44771 12.5523 9 12 9C11.4477 9 11 9.44771 11 10V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V10Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4V3C5 1.34315 6.34315 0 8 0H12C13.6569 0 15 1.34315 15 3V4H19C19.5523 4 20 4.44772 20 5C20 5.55228 19.5523 6 19 6H18V19C18 20.6569 16.6569 22 15 22H5C3.34315 22 2 20.6569 2 19V6H1C0.447715 6 0 5.55228 0 5C0 4.44772 0.447715 4 1 4H5ZM7 3C7 2.44772 7.44772 2 8 2H12C12.5523 2 13 2.44772 13 3V4H7V3ZM16 6V19C16 19.5523 15.5523 20 15 20H5C4.44772 20 4 19.5523 4 19V6H16Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TrashIcon;
