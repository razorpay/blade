import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AlignLeftIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 5C2.44772 5 2 5.44772 2 6C2 6.55228 2.44772 7 3 7H21C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5H3Z"
        fill={iconColor}
      />
      <Path
        d="M3 9C2.44772 9 2 9.44772 2 10C2 10.5523 2.44772 11 3 11H17C17.5523 11 18 10.5523 18 10C18 9.44772 17.5523 9 17 9H3Z"
        fill={iconColor}
      />
      <Path
        d="M2 14C2 13.4477 2.44772 13 3 13H21C21.5523 13 22 13.4477 22 14C22 14.5523 21.5523 15 21 15H3C2.44772 15 2 14.5523 2 14Z"
        fill={iconColor}
      />
      <Path
        d="M3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H17C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17H3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const AlignLeftIcon = assignWithoutSideEffects(_AlignLeftIcon, {
  componentId: 'AlignLeftIcon',
});

export default AlignLeftIcon;
