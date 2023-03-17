import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CustomersIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.6255 8.21429C19.6255 9.99286 18.1745 11.4286 16.3636 11.4286C14.5527 11.4286 13.0909 9.99286 13.0909 8.21429C13.0909 6.43571 14.5527 5 16.3636 5C18.1745 5 19.6255 6.43571 19.6255 8.21429ZM10.8982 8.21429C10.8982 9.99286 9.44727 11.4286 7.63636 11.4286C5.82545 11.4286 4.36364 9.99286 4.36364 8.21429C4.36364 6.43571 5.82545 5 7.63636 5C9.44727 5 10.8982 6.43571 10.8982 8.21429ZM0 17.3214C0 14.825 5.09455 13.5714 7.63636 13.5714C10.1782 13.5714 15.2727 14.825 15.2727 17.3214V18C15.2727 19.1046 14.3773 20 13.2727 20H2C0.895431 20 0 19.1046 0 18V17.3214ZM15.3055 13.625C15.6873 13.5929 16.0473 13.5714 16.3636 13.5714C18.9055 13.5714 24 14.825 24 17.3214V18C24 19.1046 23.1046 20 22 20H17.4545V20H15.95C16.45 19.8333 17.45 19.2 17.45 18V17.1259C17.3805 15.6357 16.5184 14.4876 15.3055 13.625Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CustomersIcon;
