import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowSquareUpIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.2929 7.54289C11.6834 7.15237 12.3166 7.15237 12.7071 7.54289L15.7071 10.5429C16.0976 10.9334 16.0976 11.5666 15.7071 11.9571C15.3166 12.3476 14.6834 12.3476 14.2929 11.9571L12 9.66421L9.70711 11.9571C9.31658 12.3476 8.68342 12.3476 8.29289 11.9571C7.90237 11.5666 7.90237 10.9334 8.29289 10.5429L11.2929 7.54289Z"
        fill={iconColor}
      />
      <Path
        d="M13 8.25C13 7.69772 12.5523 7.25 12 7.25C11.4477 7.25 11 7.69772 11 8.25V15.75C11 16.3023 11.4477 16.75 12 16.75C12.5523 16.75 13 16.3023 13 15.75V8.25Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 2.75C3.5335 2.75 2.75 3.5335 2.75 4.5V19.5C2.75 20.4665 3.5335 21.25 4.5 21.25H19.5C20.4665 21.25 21.25 20.4665 21.25 19.5V4.5C21.25 3.5335 20.4665 2.75 19.5 2.75H4.5ZM4.75 19.25V4.75H19.25V19.25H4.75Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowSquareUpIcon;
