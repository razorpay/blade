import * as React from 'react';
import { Svg, Path } from '../../../components/Icon';
import type { IconProps } from '../../../components/Icon';
import getIconDimensions from '../../../utils/getIconDimensions';

const CreditCard = ({ size, fill = '#063855' }: IconProps): React.ReactElement => {
  return (
    <Svg
      {...getIconDimensions({ size })}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34314 21 3 21H21C22.6569 21 24 19.6569 24 18V6C24 4.34315 22.6569 3 21 3H3ZM22 9V6C22 5.44771 21.5523 5 21 5H3C2.44772 5 2 5.44772 2 6V9H22ZM2 11H22V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V11Z"
        fill={fill}
      />
    </Svg>
  );
};

export default CreditCard;
