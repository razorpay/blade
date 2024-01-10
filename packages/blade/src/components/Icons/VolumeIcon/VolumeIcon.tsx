import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const VolumeIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4332 4.09871C16.7797 4.26523 17 4.6156 17 5.00001V19C17 19.3844 16.7797 19.7348 16.4332 19.9013C16.0867 20.0678 15.6755 20.021 15.3753 19.7809L10.6492 16H7C6.44772 16 6 15.5523 6 15V9.00001C6 8.44772 6.44772 8.00001 7 8.00001H10.6492L15.3753 4.21914C15.6755 3.979 16.0867 3.93219 16.4332 4.09871ZM15 7.08063L11.6247 9.78088C11.4474 9.92273 11.2271 10 11 10H8V14H11C11.2271 14 11.4474 14.0773 11.6247 14.2191L15 16.9194V7.08063Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default VolumeIcon;
