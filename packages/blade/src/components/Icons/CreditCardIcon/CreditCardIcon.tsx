import type { ReactElement } from 'react';
import { Svg, Path } from '../_Svg';
import type { IconProps } from '..';
import useIconProps from '../useIconProps';

const CreditCardIcon = ({ size, color }: IconProps): ReactElement => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34314 21 3 21H21C22.6569 21 24 19.6569 24 18V6C24 4.34315 22.6569 3 21 3H3ZM22 9V6C22 5.44771 21.5523 5 21 5H3C2.44772 5 2 5.44772 2 6V9H22ZM2 11H22V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V11Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CreditCardIcon;
