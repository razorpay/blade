import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _UnderlineIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 2C7 1.44772 6.55228 1 6 1C5.44772 1 5 1.44772 5 2V9C5 12.866 8.13401 16 12 16C15.866 16 19 12.866 19 9V2C19 1.44772 18.5523 1 18 1C17.4477 1 17 1.44772 17 2V9C17 11.7614 14.7614 14 12 14C9.23858 14 7 11.7614 7 9V2Z"
        fill={iconColor}
      />
      <Path
        d="M4 19C3.44772 19 3 19.4477 3 20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20C21 19.4477 20.5523 19 20 19H4Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const UnderlineIcon = assignWithoutSideEffects(_UnderlineIcon, {
  componentId: 'UnderlineIcon',
});

export default UnderlineIcon;
