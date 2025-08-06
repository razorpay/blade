import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _TopLeftRoundedCornerIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 13C4 8.02944 8.02944 4 13 4H20C20.5523 4 21 4.44772 21 5C21 5.55228 20.5523 6 20 6H13C9.13401 6 6 9.13401 6 13V20C6 20.5523 5.55228 21 5 21C4.44772 21 4 20.5523 4 20V13Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const TopLeftRoundedCornerIcon = assignWithoutSideEffects(_TopLeftRoundedCornerIcon, {
  componentId: 'TopLeftRoundedCornerIcon',
});

export default TopLeftRoundedCornerIcon;
