import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BoardIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C13.1046 3 14 3.89543 14 5C14 5.17857 13.9736 5.35088 13.9297 5.51562L17.4141 9H19C20.1046 9 21 9.89543 21 11V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V11C3 9.89543 3.89543 9 5 9H6.58594L10.0693 5.51562C10.0255 5.35096 10 5.17849 10 5C10 3.89543 10.8954 3 12 3ZM6 11C5.44772 11 5 11.4477 5 12V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V12C19 11.4477 18.5523 11 18 11H6ZM12.5156 6.92969C12.3509 6.97359 12.1786 7 12 7C11.8211 7 11.6484 6.97375 11.4834 6.92969L9.41406 9H14.5859L12.5156 6.92969Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const BoardIcon = assignWithoutSideEffects(_BoardIcon, {
  componentId: 'BoardIcon',
});

export default BoardIcon;
