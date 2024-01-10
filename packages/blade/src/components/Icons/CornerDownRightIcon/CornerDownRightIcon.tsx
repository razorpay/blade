import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CornerDownRightIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4C5 3.44772 4.55228 3 4 3C3.44772 3 3 3.44772 3 4V11C3 13.7614 5.23858 16 8 16H17.5858L14.2929 19.2929C13.9024 19.6834 13.9024 20.3166 14.2929 20.7071C14.6834 21.0976 15.3166 21.0976 15.7071 20.7071L20.7071 15.7071C21.0976 15.3166 21.0976 14.6834 20.7071 14.2929L15.7071 9.29289C15.3166 8.90237 14.6834 8.90237 14.2929 9.29289C13.9024 9.68342 13.9024 10.3166 14.2929 10.7071L17.5858 14H8C6.34315 14 5 12.6569 5 11V4Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CornerDownRightIcon;
