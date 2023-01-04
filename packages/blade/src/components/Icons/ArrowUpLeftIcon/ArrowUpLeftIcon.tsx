import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowUpLeftIcon: IconComponent = ({ size, color }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 5C5.44772 5 5 5.44772 5 6V15C5 15.5523 5.44772 16 6 16C6.55228 16 7 15.5523 7 15V8.41421L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L8.41421 7H15C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5H6Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowUpLeftIcon;
