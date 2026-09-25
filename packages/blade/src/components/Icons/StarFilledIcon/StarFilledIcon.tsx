import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _StarFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C12.3806 1 12.7282 1.21607 12.8967 1.55738L15.7543 7.34647L22.1446 8.28051C22.5212 8.33555 22.8339 8.59956 22.9512 8.96157C23.0686 9.32357 22.9703 9.72083 22.6977 9.98636L18.0745 14.4894L19.1656 20.851C19.23 21.2261 19.0757 21.6053 18.7677 21.8291C18.4598 22.0528 18.0515 22.0823 17.7145 21.9051L12 18.8998L6.28545 21.9051C5.94853 22.0823 5.54024 22.0528 5.23226 21.8291C4.92429 21.6053 4.77004 21.2261 4.83439 20.851L5.92548 14.4894L1.30227 9.98636C1.02965 9.72083 0.931375 9.32357 1.04875 8.96157C1.16613 8.59956 1.47881 8.33555 1.85537 8.28051L8.24574 7.34647L11.1033 1.55738C11.2718 1.21607 11.6194 1 12 1Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const StarFilledIcon = assignWithoutSideEffects(_StarFilledIcon, {
  componentId: 'StarFilledIcon',
});

export default StarFilledIcon;
