import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowSquareUpLeftIcon: IconComponent = ({
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
        d="M8.61722 8.07588C8.73512 8.02699 8.86441 8 9 8H13.5C14.0523 8 14.5 8.44772 14.5 9C14.5 9.55228 14.0523 10 13.5 10H11.4142L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142V13.5C10 14.0523 9.55228 14.5 9 14.5C8.44772 14.5 8 14.0523 8 13.5V9C8 8.72494 8.11106 8.47581 8.29078 8.29502L8.29502 8.29078C8.3904 8.19595 8.50014 8.12432 8.61722 8.07588Z"
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

export default ArrowSquareUpLeftIcon;
