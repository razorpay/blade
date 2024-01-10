import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const AlignCenterIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 5C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7H21C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5H3Z"
        fill={iconColor}
      />
      <Path
        d="M6 9C5.44772 9 5 9.44772 5 10C5 10.5523 5.44772 11 6 11H18C18.5523 11 19 10.5523 19 10C19 9.44772 18.5523 9 18 9H6Z"
        fill={iconColor}
      />
      <Path
        d="M2 14C2 13.4477 2.44772 13 3 13H21C21.5523 13 22 13.4477 22 14C22 14.5523 21.5523 15 21 15H3C2.44772 15 2 14.5523 2 14Z"
        fill={iconColor}
      />
      <Path
        d="M6 17C5.44772 17 5 17.4477 5 18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17H6Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default AlignCenterIcon;
