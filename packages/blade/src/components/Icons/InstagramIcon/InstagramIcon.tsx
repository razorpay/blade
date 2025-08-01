import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _InstagramIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7766 7.0108C10.6429 6.69439 8.54684 7.78201 7.57705 9.70876C6.60727 11.6355 6.98243 13.967 8.50769 15.4922C10.033 17.0175 12.3644 17.3927 14.2912 16.4229C16.2179 15.4531 17.3055 13.357 16.9891 11.2233C16.6661 9.04457 14.9554 7.33387 12.7766 7.0108ZM9.36352 10.6079C9.94539 9.45189 11.203 8.79932 12.4833 8.98916C13.7905 9.18301 14.8169 10.2094 15.0108 11.5167C15.2006 12.7969 14.548 14.0545 13.392 14.6364C12.2359 15.2183 10.8371 14.9932 9.92191 14.078C9.00675 13.1629 8.78165 11.764 9.36352 10.6079Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 1C3.68629 1 1 3.68629 1 7V17C1 20.3137 3.68629 23 7 23H17C20.3137 23 23 20.3137 23 17V7C23 3.68629 20.3137 1 17 1H7ZM3 7C3 4.79086 4.79086 3 7 3H17C19.2091 3 21 4.79086 21 7V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17V7Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const InstagramIcon = assignWithoutSideEffects(_InstagramIcon, {
  componentId: 'InstagramIcon',
});

export default InstagramIcon;
