import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowSquareDownLeftIcon: IconComponent = ({
  size,
  color,
  ...styledProps
}) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg
      {...styledProps}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M8 10.5C8 9.94772 8.44772 9.5 9 9.5C9.55228 9.5 10 9.94772 10 10.5V12.5858L14.2929 8.29289C14.6834 7.90237 15.3166 7.90237 15.7071 8.29289C16.0976 8.68342 16.0976 9.31658 15.7071 9.70711L11.4142 14H13.5C14.0523 14 14.5 14.4477 14.5 15C14.5 15.5523 14.0523 16 13.5 16H9.00069C8.99969 16 8.998 16 8.997 16C8.72313 15.9992 8.47515 15.8883 8.29502 15.7092C8.2936 15.7078 8.29219 15.7064 8.29078 15.705C8.19595 15.6096 8.12432 15.4999 8.07588 15.3828C8.02699 15.2649 8 15.1356 8 15V10.5Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 21.25C3.5335 21.25 2.75 20.4665 2.75 19.5V4.5C2.75 3.5335 3.5335 2.75 4.5 2.75H19.5C20.4665 2.75 21.25 3.5335 21.25 4.5V19.5C21.25 20.4665 20.4665 21.25 19.5 21.25H4.5ZM4.75 19.25H19.25V4.75H4.75V19.25Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowSquareDownLeftIcon;
