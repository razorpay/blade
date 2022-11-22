import type { ReactElement } from 'react';
import type { IconComponent, IconProps } from '..';
import useIconProps from '../useIconProps';
import { Path, Svg } from '../_Svg';

const EmailIcon: IconComponent = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg width={width} height={height} viewBox="0 0 22 18" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 3.01769V15C22 16.6523 20.6523 18 19 18H3C1.34772 18 0 16.6523 0 15V3C0 1.34772 1.34772 0 3 0H19C20.6443 0 21.987 1.33473 21.9999 2.97608C22.0002 2.98996 22.0003 3.00383 22 3.01769ZM2.10659 2.55392C2.27198 2.22691 2.61205 2 3 2H19C19.388 2 19.7281 2.22695 19.8935 2.55401L11.0001 8.77937L2.10659 2.55392ZM2 4.92062V15C2 15.5477 2.45228 16 3 16H19C19.5477 16 20 15.5477 20 15V4.92074L11.5735 10.8193C11.2292 11.0603 10.7709 11.0603 10.4266 10.8193L2 4.92062Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default EmailIcon;
