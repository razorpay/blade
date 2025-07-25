import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _PaymentButtonIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 6H18.5C20.433 6 22 7.567 22 9.5C22 11.433 20.433 13 18.5 13H10.5C8.567 13 7 11.433 7 9.5C7 7.567 8.567 6 10.5 6ZM5.02034 9.02363C5.26181 6.2091 7.62292 4 10.5 4H18.5C21.5376 4 24 6.46243 24 9.5C24 12.376 21.7925 14.7365 18.9794 14.9794C18.7365 17.7925 16.376 20 13.5 20H5.5C2.46243 20 0 17.5376 0 14.5C0 11.6268 2.22756 9.28193 5.02034 9.02363ZM5.21117 11.0146C3.4179 11.1773 2 12.6841 2 14.5C2 16.433 3.567 18 5.5 18H13.5C15.2632 18 16.7219 16.6961 16.9646 15H10.5C7.98774 15 5.86889 13.3156 5.21117 11.0146Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const PaymentButtonIcon = assignWithoutSideEffects(_PaymentButtonIcon, {
  componentId: 'PaymentButtonIcon',
});

export default PaymentButtonIcon;
