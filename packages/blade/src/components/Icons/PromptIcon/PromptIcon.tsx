import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PromptIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width}  height={height}  viewBox="0 0 24 24"  fill="none"
    >
      <Path
        d="M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z"
        fill={iconColor}
      />
      <Path
        d="M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z"
        fill={iconColor}
      />
      <Path
        d="M3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H11C11.5523 19 12 18.5523 12 18C12 17.4477 11.5523 17 11 17H3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PromptIcon;
