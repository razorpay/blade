import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PayrollAddonsIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3C4.44771 3 4 3.44772 4 4V21.3764L6.39249 18.6939C7.43696 17.5229 9.27292 17.5369 10.2994 18.7237L11.8651 20.534C12.0645 20.7646 12.422 20.7646 12.6214 20.534L14.2852 18.6102C15.2626 17.4802 17.0238 17.5082 17.9647 18.6687L20 21.1789V4C20 3.44772 19.5523 3 19 3H17.625C17.0727 3 16.625 2.55228 16.625 2C16.625 1.44772 17.0727 1 17.625 1H19C20.6569 1 22 2.34315 22 4V21.1789C22 23.0629 19.633 23.9019 18.4465 22.4385L16.4112 19.9283C16.2544 19.7349 15.9609 19.7302 15.798 19.9186L14.1342 21.8423C13.1371 22.9952 11.3494 22.9952 10.3523 21.8423L8.78667 20.032C8.54979 19.7581 8.12611 19.7549 7.88508 20.0252L5.49259 22.7076C4.26959 24.0789 2 23.2138 2 21.3764V4C2 2.34314 3.34315 1 5 1H6.375C6.92728 1 7.375 1.44772 7.375 2C7.375 2.55228 6.92728 3 6.375 3H5ZM12 5C10.8786 5 9.85952 5.45959 9.1291 6.21002C8.43 6.9293 8 7.91877 8 9C8 9.75002 8.20985 10.4561 8.57615 11.0501L8.58692 11.068C8.7804 11.3969 9.03474 11.7009 9.32993 11.9568C9.33662 11.9626 9.34323 11.9685 9.34976 11.9744C10.0472 12.6121 10.9712 13 12 13C13.4595 13 14.7267 12.2219 15.4156 11.0638L15.4242 11.0495C15.6284 10.7189 15.7862 10.3348 15.8744 9.94298C15.8773 9.9302 15.8804 9.91748 15.8838 9.90483C15.9607 9.61644 16 9.3157 16 9C16 7.98357 15.6118 7.04441 14.9697 6.33206L14.961 6.32238L14.9611 6.32232C14.2487 5.51107 13.1839 5 12 5ZM7.69591 4.81504C8.79049 3.69047 10.3214 3 12 3C13.7637 3 15.372 3.76195 16.4596 4.99779C17.4149 6.05989 18 7.46874 18 9C18 9.47766 17.941 9.94553 17.8213 10.4012C17.6843 10.9998 17.4455 11.5811 17.1302 12.0933C16.0932 13.8312 14.1875 15 12 15C10.4585 15 9.06146 14.4165 8.01 13.4594C7.56203 13.0693 7.17187 12.6047 6.86837 12.091C6.31308 11.187 6 10.1213 6 9C6 7.38144 6.64485 5.89613 7.69551 4.81545L7.69591 4.81504ZM11.9995 6.15015C12.5518 6.15015 12.9995 6.59786 12.9995 7.15015V7.9751H13.8622C14.4145 7.9751 14.8622 8.42281 14.8622 8.9751C14.8622 9.52738 14.4145 9.9751 13.8622 9.9751H12.9995V10.8876C12.9995 11.4399 12.5518 11.8876 11.9995 11.8876C11.4472 11.8876 10.9995 11.4399 10.9995 10.8876V9.9751H10.1372C9.58492 9.9751 9.13721 9.52738 9.13721 8.9751C9.13721 8.42281 9.58492 7.9751 10.1372 7.9751H10.9995V7.15015C10.9995 6.59786 11.4472 6.15015 11.9995 6.15015Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PayrollAddonsIcon;