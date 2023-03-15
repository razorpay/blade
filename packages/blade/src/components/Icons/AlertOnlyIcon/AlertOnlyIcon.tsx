import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const AlertOnlyIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V5ZM12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default AlertOnlyIcon;
