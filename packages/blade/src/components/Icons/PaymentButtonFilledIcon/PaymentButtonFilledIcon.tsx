import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PaymentButtonFilledIcon: IconComponent = ({
  size,
  color,
  ...styledProps
}) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg
      {...styledProps}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5 4C21.5376 4 24 6.46243 24 9.5C24 12.3766 21.7914 14.7354 18.9775 14.9775C18.7354 17.7914 16.3766 20 13.5 20H5.5C2.46243 20 0 17.5376 0 14.5C0 11.6237 2.20803 9.26402 5.02148 9.02148C5.264 6.20802 7.62368 4 10.5 4H18.5ZM5.21191 11.0127C3.41372 11.1592 2 12.664 2 14.5C2 16.433 3.567 18 5.5 18H13.5C15.2632 18 16.7212 16.6961 16.9639 15H10.5C7.98719 15 5.86913 13.3145 5.21191 11.0127Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PaymentButtonFilledIcon = assignWithoutSideEffects(
  _PaymentButtonFilledIcon,
  {
    componentId: 'PaymentButtonFilledIcon',
  }
);

export default PaymentButtonFilledIcon;
