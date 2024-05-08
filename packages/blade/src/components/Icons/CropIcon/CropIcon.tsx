import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CropIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.12996 1.00867C7.13475 0.456403 6.69093 0.00482466 6.13867 3.83509e-05C5.5864 -0.0047479 5.13482 0.43907 5.13004 0.991334L5.09448 5.09449L0.991334 5.13004C0.43907 5.13482 -0.0047479 5.5864 3.83509e-05 6.13867C0.00482466 6.69093 0.456403 7.13475 1.00867 7.12996L5.07714 7.0947L5.00004 15.9913L5 16C5 17.6569 6.34315 19 8 19H17V23C17 23.5523 17.4477 24 18 24C18.5523 24 19 23.5523 19 23V19H23C23.5523 19 24 18.5523 24 18C24 17.4477 23.5523 17 23 17H19V8C19 6.34315 17.6569 5 16 5L7.0947 5.07716L7.12996 1.00867ZM7.07737 7.07737L7.00001 16.0036C7.00195 16.5542 7.44892 17 8 17H17V8C17 7.44892 16.5542 7.00195 16.0036 7.00001L7.07737 7.07737Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CropIcon;
