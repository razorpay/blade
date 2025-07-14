import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ArrowSquareDownRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.29289 8.29289C8.68342 7.90237 9.31658 7.90237 9.70711 8.29289L14 12.5858V10.5C14 9.94772 14.4477 9.5 15 9.5C15.5523 9.5 16 9.94772 16 10.5V14.9993C16 15.0003 16 15.002 16 15.003C15.9996 15.1375 15.9727 15.2657 15.9241 15.3828C15.8753 15.5007 15.803 15.6112 15.7071 15.7071C15.5126 15.9016 15.2579 15.9992 15.003 16C15.002 16 15.001 16 15 16H10.5C9.94772 16 9.5 15.5523 9.5 15C9.5 14.4477 9.94772 14 10.5 14H12.5858L8.29289 9.70711C7.90237 9.31658 7.90237 8.68342 8.29289 8.29289Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5 2.75C20.4665 2.75 21.25 3.5335 21.25 4.5V19.5C21.25 20.4665 20.4665 21.25 19.5 21.25H4.5C3.5335 21.25 2.75 20.4665 2.75 19.5V4.5C2.75 3.5335 3.5335 2.75 4.5 2.75H19.5ZM19.25 4.75H4.75V19.25H19.25V4.75Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ArrowSquareDownRightIcon = assignWithoutSideEffects(_ArrowSquareDownRightIcon, {
  componentId: 'ArrowSquareDownRightIcon',
});

export default ArrowSquareDownRightIcon;
