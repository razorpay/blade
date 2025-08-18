import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PaymentGatewayFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 1L22.1025 1.00488C22.6067 1.05621 23 1.48232 23 2C23 2.51768 22.6067 2.94379 22.1025 2.99512L22 3L2 3C1.44772 3 1 2.55229 1 2C1 1.44772 1.44772 1 2 1L22 1Z"
        fill={iconColor}
      />
      <Path
        d="M24 20C24 18.3431 22.6569 17 21 17H16C14.3431 17 13 18.3431 13 20V21C13 21.351 13.0631 21.6869 13.1738 22H2C0.895431 22 8.05332e-09 21.1046 0 20V10.5H24V20ZM4 16.75C3.58579 16.75 3.25 17.0858 3.25 17.5C3.25 17.9142 3.58579 18.25 4 18.25H7C7.41421 18.25 7.75 17.9142 7.75 17.5C7.75 17.0858 7.41421 16.75 7 16.75H4ZM22 4C23.1046 4 24 4.89543 24 6V9H0V6C0 4.89543 0.895431 4 2 4H22Z"
        fill={iconColor}
      />
      <Path
        d="M14 20C14 18.8954 14.8954 18 16 18H21C22.1046 18 23 18.8954 23 20V21C23 22.1046 22.1046 23 21 23H16C14.8954 23 14 22.1046 14 21V20Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PaymentGatewayFilledIcon = assignWithoutSideEffects(_PaymentGatewayFilledIcon, {
  componentId: 'PaymentGatewayFilledIcon',
});

export default PaymentGatewayFilledIcon;
