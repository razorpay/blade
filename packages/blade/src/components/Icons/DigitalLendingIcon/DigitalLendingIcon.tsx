import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _DigitalLendingIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.5C12.5523 1.5 13 1.94772 13 2.5V8.38584L13.6991 7.68669C14.0897 7.29617 14.7228 7.29617 15.1134 7.68669C15.5039 8.07722 15.5039 8.71038 15.1134 9.10091L12.7071 11.5072C12.514 11.7003 12.2551 11.802 11.9923 11.8C11.7357 11.8006 11.4789 11.7029 11.2831 11.5072L8.84563 9.06966C8.4551 8.67913 8.4551 8.04597 8.84563 7.65544C9.23615 7.26492 9.86932 7.26492 10.2598 7.65544L11 8.3956V2.5C11 1.94772 11.4477 1.5 12 1.5ZM3 5C2.44772 5 2 5.44772 2 6V9H5.5C6.05228 9 6.5 9.44772 6.5 10C6.5 10.5523 6.05228 11 5.5 11H2V18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18V11H18.5C17.9477 11 17.5 10.5523 17.5 10C17.5 9.44772 17.9477 9 18.5 9H22V6C22 5.44771 21.5523 5 21 5H16.5C15.9477 5 15.5 4.55228 15.5 4C15.5 3.44772 15.9477 3 16.5 3H21C22.6569 3 24 4.34315 24 6V18C24 19.6569 22.6569 21 21 21H3C1.34315 21 0 19.6569 0 18V6C0 4.34315 1.34315 3 3 3H7.5C8.05228 3 8.5 3.44772 8.5 4C8.5 4.55228 8.05228 5 7.5 5H3ZM3 16C3 15.4477 3.44772 15 4 15H8C8.55228 15 9 15.4477 9 16C9 16.5523 8.55228 17 8 17H4C3.44772 17 3 16.5523 3 16Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const DigitalLendingIcon = assignWithoutSideEffects(_DigitalLendingIcon, {
  componentId: 'DigitalLendingIcon',
});

export default DigitalLendingIcon;
