import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const ArrowSquareDownIcon: IconComponent = ({
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.54289 12.2929C8.93342 11.9024 9.56658 11.9024 9.95711 12.2929L12.25 14.5858L14.5429 12.2929C14.9334 11.9024 15.5666 11.9024 15.9571 12.2929C16.3476 12.6834 16.3476 13.3166 15.9571 13.7071L12.9571 16.7071C12.5666 17.0976 11.9334 17.0976 11.5429 16.7071L8.54289 13.7071C8.15237 13.3166 8.15237 12.6834 8.54289 12.2929Z"
        fill={iconColor}
      />
      <Path
        d="M13.25 8.5C13.25 7.94772 12.8023 7.5 12.25 7.5C11.6977 7.5 11.25 7.94772 11.25 8.5V16C11.25 16.5523 11.6977 17 12.25 17C12.8023 17 13.25 16.5523 13.25 16V8.5Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.75 3C3.7835 3 3 3.7835 3 4.75V19.75C3 20.7165 3.7835 21.5 4.75 21.5H19.75C20.7165 21.5 21.5 20.7165 21.5 19.75V4.75C21.5 3.7835 20.7165 3 19.75 3H4.75ZM5 19.5V5H19.5V19.5H5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ArrowSquareDownIcon;
