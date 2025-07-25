import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ArrowDownRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L15.5858 17H9C8.44772 17 8 17.4477 8 18C8 18.5523 8.44772 19 9 19H17.9993C18.0003 19 18.002 19 18.003 19C18.1375 18.9996 18.2657 18.9727 18.3828 18.9241C18.498 18.8764 18.6062 18.8063 18.7005 18.7136C18.7049 18.7093 18.7093 18.7049 18.7136 18.7005C18.8901 18.5208 18.9992 18.2746 19 18.003C19 18.002 19 18.001 19 18V9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9V15.5858L6.70711 5.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ArrowDownRightIcon = assignWithoutSideEffects(_ArrowDownRightIcon, {
  componentId: 'ArrowDownRightIcon',
});

export default ArrowDownRightIcon;
