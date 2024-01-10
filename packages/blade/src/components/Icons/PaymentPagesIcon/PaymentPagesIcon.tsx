import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PaymentPagesIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.0588 2L21 7.26316V20.2456C21 21.2105 20.2588 21.9912 19.3529 21.9912L7.82353 22C6.91765 22 6.17647 21.2193 6.17647 20.2544V3.75439C6.17647 2.78947 6.91765 2 7.82353 2H16.0588ZM3 5.15789H4.71429V20.9474H3V5.15789ZM9.35294 10.4211V11.4737H17.8235V10.4211H9.35294ZM9.35294 12.5263V13.5789H17.8235V12.5263H9.35294ZM9.35294 14.6316V15.6842H17.8235V14.6316H9.35294ZM15 3.31579V8.14035H19.7143L15 3.31579Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PaymentPagesIcon;
