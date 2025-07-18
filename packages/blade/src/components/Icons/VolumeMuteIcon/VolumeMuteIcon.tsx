import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _VolumeMuteIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4332 4.09871C10.7797 4.26523 11 4.6156 11 5.00001V19C11 19.3844 10.7797 19.7348 10.4332 19.9013C10.0867 20.0678 9.67548 20.021 9.37531 19.7809L4.64922 16H1C0.447715 16 0 15.5523 0 15V9.00001C0 8.44772 0.447715 8.00001 1 8.00001H4.64922L9.37531 4.21914C9.67548 3.979 10.0867 3.93219 10.4332 4.09871ZM9 7.08063L5.62469 9.78088C5.44738 9.92273 5.22707 10 5 10H2V14H5C5.22707 14 5.44738 14.0773 5.62469 14.2191L9 16.9194V7.08063Z"
        fill={iconColor}
      />
      <Path
        d="M22.7071 8.29289C23.0976 8.68342 23.0976 9.31658 22.7071 9.70711L20.4142 12L22.7071 14.2929C23.0976 14.6834 23.0976 15.3166 22.7071 15.7071C22.3166 16.0976 21.6834 16.0976 21.2929 15.7071L19 13.4142L16.7071 15.7071C16.3166 16.0976 15.6834 16.0976 15.2929 15.7071C14.9024 15.3166 14.9024 14.6834 15.2929 14.2929L17.5858 12L15.2929 9.70711C14.9024 9.31658 14.9024 8.68342 15.2929 8.29289C15.6834 7.90237 16.3166 7.90237 16.7071 8.29289L19 10.5858L21.2929 8.29289C21.6834 7.90237 22.3166 7.90237 22.7071 8.29289Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const VolumeMuteIcon = assignWithoutSideEffects(_VolumeMuteIcon, {
  componentId: 'VolumeMuteIcon',
});

export default VolumeMuteIcon;
