import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PaymentGatewayIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 2L2 2C1.44772 2 1 1.55229 1 1C1 0.447717 1.44772 1.78814e-06 2 1.72853e-06L22 0C22.5523 0 23 0.447715 23 1C23 1.55228 22.5523 2 22 2ZM3 5C2.44772 5 2 5.44772 2 6V9H22V6C22 5.44772 21.5523 5 21 5H3ZM24 6C24 4.34315 22.6569 3 21 3H3C1.34315 3 0 4.34315 0 6V18C0 19.6569 1.34315 21 3 21H9.75C10.3023 21 10.75 20.5523 10.75 20C10.75 19.4477 10.3023 19 9.75 19H3C2.44772 19 2 18.5523 2 18V11H22V12C22 12.5523 22.4477 13 23 13C23.5523 13 24 12.5523 24 12V6ZM12 17C12 15.3431 13.3431 14 15 14H20C21.6569 14 23 15.3431 23 17V18C23 19.6569 21.6569 21 20 21H15C13.3431 21 12 19.6569 12 18V17ZM15 16C14.4477 16 14 16.4477 14 17V18C14 18.5523 14.4477 19 15 19H20C20.5523 19 21 18.5523 21 18V17C21 16.4477 20.5523 16 20 16H15ZM3.5 16C3.5 15.4477 3.94772 15 4.5 15H7.5C8.05228 15 8.5 15.4477 8.5 16C8.5 16.5523 8.05228 17 7.5 17H4.5C3.94772 17 3.5 16.5523 3.5 16Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PaymentGatewayIcon = assignWithoutSideEffects(_PaymentGatewayIcon, {
  componentId: 'PaymentGatewayIcon',
});

export default PaymentGatewayIcon;
