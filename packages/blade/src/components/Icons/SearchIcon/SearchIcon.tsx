import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const SearchIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} height={height} width={width} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.618 18.032a9 9 0 1 1 1.414-1.414l3.675 3.675a1 1 0 0 1-1.414 1.414l-3.675-3.675ZM4 11a7 7 0 1 1 12.041 4.857 1.009 1.009 0 0 0-.185.184A7 7 0 0 1 4 11Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default SearchIcon;
