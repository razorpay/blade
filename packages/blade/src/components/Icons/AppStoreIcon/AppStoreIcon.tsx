import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const AppStoreIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2929 1.29289C16.6834 0.902369 17.3166 0.902369 17.7071 1.29289L22.6569 6.24264C23.0474 6.63316 23.0474 7.26633 22.6569 7.65685L17.7071 12.6066C17.3166 12.9971 16.6834 12.9971 16.2929 12.6066L11.3431 7.65685C10.9526 7.26633 10.9526 6.63316 11.3431 6.24264L16.2929 1.29289ZM17 3.41421L13.4645 6.94975L17 10.4853L20.5355 6.94975L17 3.41421Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 2.44956C1.94772 2.44956 1.5 2.89727 1.5 3.44956V10.4496C1.5 11.0018 1.94772 11.4496 2.5 11.4496H9.5C10.0523 11.4496 10.5 11.0018 10.5 10.4496V3.44956C10.5 2.89727 10.0523 2.44956 9.5 2.44956H2.5ZM3.5 9.44956V4.44956H8.5V9.44956H3.5Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 14.4496C12.5 13.8973 12.9477 13.4496 13.5 13.4496H20.5C21.0523 13.4496 21.5 13.8973 21.5 14.4496V21.4496C21.5 22.0018 21.0523 22.4496 20.5 22.4496H13.5C12.9477 22.4496 12.5 22.0018 12.5 21.4496V14.4496ZM14.5 15.4496V20.4496H19.5V15.4496H14.5Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 14.4496C1.5 13.8973 1.94772 13.4496 2.5 13.4496H9.5C10.0523 13.4496 10.5 13.8973 10.5 14.4496V21.4496C10.5 22.0018 10.0523 22.4496 9.5 22.4496H2.5C1.94772 22.4496 1.5 22.0018 1.5 21.4496V14.4496ZM3.5 15.4496V20.4496H8.5V15.4496H3.5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default AppStoreIcon;
