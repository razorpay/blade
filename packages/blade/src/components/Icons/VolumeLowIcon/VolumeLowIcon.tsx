import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _VolumeLowIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4332 4.09871C13.7797 4.26523 14 4.6156 14 5.00001V19C14 19.3844 13.7797 19.7348 13.4332 19.9013C13.0867 20.0678 12.6755 20.021 12.3753 19.7809L7.64922 16H4C3.44772 16 3 15.5523 3 15V9.00001C3 8.44772 3.44772 8.00001 4 8.00001H7.64922L12.3753 4.21914C12.6755 3.979 13.0867 3.93219 13.4332 4.09871ZM12 7.08063L8.62469 9.78088C8.44738 9.92273 8.22707 10 8 10H5V14H8C8.22707 14 8.44738 14.0773 8.62469 14.2191L12 16.9194V7.08063Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.833 7.7528C17.2236 7.36233 17.8567 7.36243 18.2472 7.75301C20.5895 10.096 20.5895 13.894 18.2472 16.237C17.8567 16.6276 17.2236 16.6277 16.833 16.2372C16.4424 15.8468 16.4423 15.2136 16.8328 14.823C18.3943 13.261 18.3943 10.729 16.8328 9.16701C16.4423 8.77643 16.4424 8.14326 16.833 7.7528Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const VolumeLowIcon = assignWithoutSideEffects(_VolumeLowIcon, {
  componentId: 'VolumeLowIcon',
});

export default VolumeLowIcon;
