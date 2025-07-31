import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MagicCheckoutFilledIcon: IconComponent = ({
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
        d="M12 0.000488281C13.3261 0.000488281 14.5975 0.52765 15.5352 1.46533C16.4728 2.40301 17 3.67441 17 5.00049H21C21.5523 5.00049 22 5.4482 22 6.00049V20.0005C22 20.7961 21.6837 21.559 21.1211 22.1216C20.5585 22.6842 19.7957 23.0005 19 23.0005H13L17.6543 16.5942C17.798 16.396 17.6561 16.1177 17.4111 16.1177H12.334C12.1557 16.1174 12.0168 15.963 12.0361 15.7856L12.5439 11.1226C12.5773 10.8168 12.1847 10.6648 12.0039 10.9136L6.3457 18.7007C6.20187 18.899 6.34383 19.1772 6.58887 19.1772H11.666C11.8443 19.1775 11.9831 19.332 11.9639 19.5093L11.583 23.0005H5C4.20435 23.0005 3.44152 22.6842 2.87891 22.1216C2.3163 21.559 2 20.7961 2 20.0005V6.00049C2 5.4482 2.44772 5.00049 3 5.00049H7C7 3.67441 7.52716 2.40301 8.46484 1.46533C9.40253 0.52765 10.6739 0.000488281 12 0.000488281ZM12 2.00049C11.2044 2.00049 10.4415 2.31679 9.87891 2.87939C9.3163 3.442 9 4.20484 9 5.00049H15C15 4.20484 14.6837 3.442 14.1211 2.87939C13.5585 2.31679 12.7956 2.00049 12 2.00049Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MagicCheckoutFilledIcon = assignWithoutSideEffects(
  _MagicCheckoutFilledIcon,
  {
    componentId: 'MagicCheckoutFilledIcon',
  }
);

export default MagicCheckoutFilledIcon;
