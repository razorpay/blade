import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SkipForwardIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.56681 3.09871C3.91328 2.93219 4.32453 2.979 4.6247 3.21914L14.6247 11.2191C14.8619 11.4089 15 11.6962 15 12C15 12.3038 14.8619 12.5911 14.6247 12.7809L4.6247 20.7809C4.32453 21.021 3.91328 21.0678 3.56681 20.9013C3.22035 20.7348 3 20.3844 3 20V4.00001C3 3.6156 3.22035 3.26523 3.56681 3.09871ZM5 6.08063V17.9194L12.3992 12L5 6.08063Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 4.00001C18.5523 4.00001 19 4.44772 19 5.00001V19C19 19.5523 18.5523 20 18 20C17.4477 20 17 19.5523 17 19V5.00001C17 4.44772 17.4477 4.00001 18 4.00001Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const SkipForwardIcon = assignWithoutSideEffects(_SkipForwardIcon, {
  componentId: 'SkipForwardIcon',
});

export default SkipForwardIcon;
