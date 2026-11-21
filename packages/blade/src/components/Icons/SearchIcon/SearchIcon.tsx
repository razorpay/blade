import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _SearchIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 21.53 20.47 l -4.69 -4.69 a 8.26 8.26 0 1 0 -1.06 1.06 l 4.69 4.69 a 0.75 0.75 0 0 0 1.06 -1.06 Z M 3.75 10.5 a 6.75 6.75 0 1 1 6.75 6.75 A 6.76 6.76 0 0 1 3.75 10.5 Z" />
    </Svg>
  );
};
const SearchIcon = assignWithoutSideEffects(_SearchIcon, {
  componentId: 'SearchIcon',
});
export default SearchIcon;