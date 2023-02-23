import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PaymentButtonsIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.63688 11.375C4.74852 11.6022 4.09561 12.3621 4.09561 13.2646V14.0822C4.09561 15.1641 5.03385 16.0411 6.19123 16.0411H14.2275C15.1724 16.0411 15.9713 15.4565 16.2327 14.6532H9.77254C7.69079 14.6532 5.96353 13.2345 5.63688 11.375ZM18.38 14.6171C18.101 16.5278 16.3482 18 14.2275 18H6.19123C3.87647 18 2 16.2459 2 14.0822V13.2646C2 11.282 3.5755 9.64333 5.62004 9.38291C5.89908 7.47222 7.65188 6 9.77254 6H17.8088C20.1236 6 22 7.75404 22 9.91776V10.7354C22 12.718 20.4245 14.3567 18.38 14.6171Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PaymentButtonsIcon;
