import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowSquareRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
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
        d="M12.0429 8.29289C12.4334 7.90237 13.0666 7.90237 13.4571 8.29289L16.4571 11.2929C16.8476 11.6834 16.8476 12.3166 16.4571 12.7071L13.4571 15.7071C13.0666 16.0976 12.4334 16.0976 12.0429 15.7071C11.6524 15.3166 11.6524 14.6834 12.0429 14.2929L14.3358 12L12.0429 9.70711C11.6524 9.31658 11.6524 8.68342 12.0429 8.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowSquareRightIcon;
