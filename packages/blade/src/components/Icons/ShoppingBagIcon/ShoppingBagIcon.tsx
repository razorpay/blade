import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ShoppingBagIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9.75 8.25C9.75 7.69772 9.30228 7.25 8.75 7.25C8.19772 7.25 7.75 7.69772 7.75 8.25C7.75 9.50978 8.25044 10.718 9.14124 11.6088C10.032 12.4996 11.2402 13 12.5 13C13.7598 13 14.968 12.4996 15.8588 11.6088C16.7496 10.718 17.25 9.50978 17.25 8.25C17.25 7.69772 16.8023 7.25 16.25 7.25C15.6977 7.25 15.25 7.69772 15.25 8.25C15.25 8.97935 14.9603 9.67882 14.4445 10.1945C13.9288 10.7103 13.2293 11 12.5 11C11.7707 11 11.0712 10.7103 10.5555 10.1945C10.0397 9.67882 9.75 8.97935 9.75 8.25Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25 3.5C3.2835 3.5 2.5 4.2835 2.5 5.25V18.75C2.5 19.7165 3.2835 20.5 4.25 20.5H20.75C21.7165 20.5 22.5 19.7165 22.5 18.75V5.25C22.5 4.2835 21.7165 3.5 20.75 3.5H4.25ZM4.5 18.5V5.5H20.5V18.5H4.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ShoppingBagIcon;
