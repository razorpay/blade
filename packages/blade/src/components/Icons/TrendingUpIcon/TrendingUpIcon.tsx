import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const TrendingUpIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 5C16.4477 5 16 5.44772 16 6C16 6.55228 16.4477 7 17 7H20.5858L13.5 14.0858L9.20711 9.79289C8.81658 9.40237 8.18342 9.40237 7.79289 9.79289L0.292893 17.2929C-0.0976311 17.6834 -0.0976311 18.3166 0.292893 18.7071C0.683417 19.0976 1.31658 19.0976 1.70711 18.7071L8.5 11.9142L12.7929 16.2071C13.1834 16.5976 13.8166 16.5976 14.2071 16.2071L22 8.41421V12C22 12.5523 22.4477 13 23 13C23.5523 13 24 12.5523 24 12V6C24 5.44772 23.5523 5 23 5H17Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TrendingUpIcon;
