import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ArrowSquareLeftIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.25 11C7.69772 11 7.25 11.4477 7.25 12C7.25 12.5523 7.69772 13 8.25 13H15.75C16.3023 13 16.75 12.5523 16.75 12C16.75 11.4477 16.3023 11 15.75 11H8.25Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.25 4.5C21.25 3.5335 20.4665 2.75 19.5 2.75H4.5C3.5335 2.75 2.75 3.5335 2.75 4.5V19.5C2.75 20.4665 3.5335 21.25 4.5 21.25H19.5C20.4665 21.25 21.25 20.4665 21.25 19.5V4.5ZM4.75 4.75H19.25V19.25H4.75V4.75Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9571 8.29289C12.3476 8.68342 12.3476 9.31658 11.9571 9.70711L9.66421 12L11.9571 14.2929C12.3476 14.6834 12.3476 15.3166 11.9571 15.7071C11.5666 16.0976 10.9334 16.0976 10.5429 15.7071L7.54289 12.7071C7.15237 12.3166 7.15237 11.6834 7.54289 11.2929L10.5429 8.29289C10.9334 7.90237 11.5666 7.90237 11.9571 8.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ArrowSquareLeftIcon = assignWithoutSideEffects(_ArrowSquareLeftIcon, {
  componentId: 'ArrowSquareLeftIcon',
});

export default ArrowSquareLeftIcon;
