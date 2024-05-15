import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const PlayIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.52081 2.12229C6.84189 1.947 7.23305 1.96101 7.54076 2.15882L21.5408 11.1588C21.827 11.3428 22 11.6597 22 12C22 12.3403 21.827 12.6572 21.5408 12.8412L7.54076 21.8412C7.23305 22.039 6.84189 22.053 6.52081 21.8777C6.19974 21.7024 6 21.3658 6 21V3C6 2.63419 6.19974 2.29758 6.52081 2.12229ZM8 4.83167V19.1683L19.1507 12L8 4.83167Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default PlayIcon;
