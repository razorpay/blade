import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _UserFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2Z"
        fill={iconColor}
      />
      <Path
        d="M8 14C5.23858 14 3 16.2386 3 19V21C3 21.5523 3.44772 22 4 22C4.55228 22 7.53848 22 12.0385 22H20C20.5523 22 21 21.5523 21 21V19C21 16.2386 18.7614 14 16 14H8Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const UserFilledIcon = assignWithoutSideEffects(_UserFilledIcon, {
  componentId: 'UserFilledIcon',
});

export default UserFilledIcon;
