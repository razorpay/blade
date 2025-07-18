import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PaymentPagesIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.2929 0.292893C18.6834 -0.0976311 19.3166 -0.0976311 19.7071 0.292893L21.7071 2.29289C22.0976 2.68342 22.0976 3.31658 21.7071 3.70711C21.3166 4.09763 20.6834 4.09763 20.2929 3.70711L20 3.41421V7C20 7.55228 19.5523 8 19 8C18.4477 8 18 7.55228 18 7V3.41421L17.7071 3.70711C17.3166 4.09763 16.6834 4.09763 16.2929 3.70711C15.9024 3.31658 15.9024 2.68342 16.2929 2.29289L18.2929 0.292893ZM2 4C2 2.34315 3.34314 1 5 1H14.0769C14.6292 1 15.0769 1.44772 15.0769 2C15.0769 2.55228 14.6292 3 14.0769 3H5C4.44771 3 4 3.44771 4 4V19.5C4 20.0523 4.44772 20.5 5 20.5H19C19.5523 20.5 20 20.0523 20 19.5V9.5C20 8.94772 20.4477 8.5 21 8.5C21.5523 8.5 22 8.94772 22 9.5V19.5C22 21.1569 20.6569 22.5 19 22.5H5C3.34315 22.5 2 21.1569 2 19.5V4ZM6 13C6 12.4477 6.44772 12 7 12H11C11.5523 12 12 12.4477 12 13C12 13.5523 11.5523 14 11 14H7C6.44772 14 6 13.5523 6 13ZM6 17C6 16.4477 6.44772 16 7 16H15C15.5523 16 16 16.4477 16 17C16 17.5523 15.5523 18 15 18H7C6.44772 18 6 17.5523 6 17Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PaymentPagesIcon = assignWithoutSideEffects(_PaymentPagesIcon, {
  componentId: 'PaymentPagesIcon',
});

export default PaymentPagesIcon;
