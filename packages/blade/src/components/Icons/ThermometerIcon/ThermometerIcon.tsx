import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ThermometerIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 3.5C8 1.567 9.567 0 11.5 0C13.433 0 15 1.567 15 3.5V14.2588C16.6983 15.6585 17.4124 17.958 16.7632 20.0982C16.06 22.4165 13.9226 24.0017 11.5 24.0017C9.07738 24.0017 6.94004 22.4165 6.23681 20.0982C5.58763 17.958 6.30172 15.6585 8 14.2588V3.5ZM11.5 2C10.6716 2 10 2.67157 10 3.5V14.76C10 15.094 9.83326 15.4059 9.55555 15.5915C8.27369 16.448 7.70319 18.0423 8.1507 19.5176C8.59821 20.9929 9.95833 22.0017 11.5 22.0017C13.0417 22.0017 14.4018 20.9929 14.8493 19.5176C15.2968 18.0423 14.7263 16.448 13.4444 15.5915C13.1667 15.4059 13 15.094 13 14.76V3.5C13 2.67157 12.3284 2 11.5 2Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ThermometerIcon = assignWithoutSideEffects(_ThermometerIcon, {
  componentId: 'ThermometerIcon',
});

export default ThermometerIcon;
