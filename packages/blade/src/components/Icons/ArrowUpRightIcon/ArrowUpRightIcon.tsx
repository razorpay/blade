import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowUpRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 5C8.44772 5 8 5.44772 8 6C8 6.55228 8.44772 7 9 7H15.5858L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L17 8.41421V15C17 15.5523 17.4477 16 18 16C18.5523 16 19 15.5523 19 15V6C19 5.44772 18.5523 5 18 5H9Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowUpRightIcon;
