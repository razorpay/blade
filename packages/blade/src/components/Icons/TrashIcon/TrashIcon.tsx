import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TrashIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10 10C10.5523 10 11 10.4477 11 11V17C11 17.5523 10.5523 18 10 18C9.44772 18 9 17.5523 9 17V11C9 10.4477 9.44772 10 10 10Z"
        fill={iconColor}
      />
      <Path
        d="M15 11C15 10.4477 14.5523 10 14 10C13.4477 10 13 10.4477 13 11V17C13 17.5523 13.4477 18 14 18C14.5523 18 15 17.5523 15 17V11Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 5V4C7 2.34315 8.34315 1 10 1H14C15.6569 1 17 2.34315 17 4V5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H20V20C20 21.6569 18.6569 23 17 23H7C5.34315 23 4 21.6569 4 20V7H3C2.44772 7 2 6.55228 2 6C2 5.44772 2.44772 5 3 5H7ZM9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V5H9V4ZM18 7V20C18 20.5523 17.5523 21 17 21H7C6.44772 21 6 20.5523 6 20V7H18Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const TrashIcon = assignWithoutSideEffects(_TrashIcon, {
  componentId: 'TrashIcon',
});

export default TrashIcon;
