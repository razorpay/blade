import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _VolumeHighIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.7773 4.22318C19.3868 3.83259 18.7536 3.8325 18.363 4.22296C17.9725 4.61343 17.9724 5.24659 18.3628 5.63718C21.8763 9.15167 21.8763 14.8487 18.3628 18.3632C17.9724 18.7538 17.9725 19.3869 18.363 19.7774C18.7536 20.1679 19.3868 20.1678 19.7773 19.7772C24.0715 15.4817 24.0715 8.51867 19.7773 4.22318Z"
        fill={iconColor}
      />
      <Path
        d="M16.2473 7.75318C15.8568 7.36259 15.2236 7.3625 14.833 7.75296C14.4425 8.14343 14.4424 8.77659 14.8328 9.16718C16.3944 10.7292 16.3944 13.2612 14.8328 14.8232C14.4424 15.2138 14.4425 15.8469 14.833 16.2374C15.2236 16.6279 15.8568 16.6278 16.2473 16.2372C18.5895 13.8942 18.5895 10.0962 16.2473 7.75318Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 5.00013C12 4.61573 11.7797 4.26535 11.4332 4.09883C11.0867 3.93231 10.6755 3.97913 10.3753 4.21926L5.64922 8.00013H2C1.44772 8.00013 1 8.44785 1 9.00013V15.0001C1 15.5524 1.44772 16.0001 2 16.0001H5.64922L10.3753 19.781C10.6755 20.0211 11.0867 20.068 11.4332 19.9014C11.7797 19.7349 12 19.3845 12 19.0001V5.00013ZM6.62469 9.781L10 7.08076V16.9195L6.62469 14.2193C6.44738 14.0774 6.22707 14.0001 6 14.0001H3V10.0001H6C6.22707 10.0001 6.44738 9.92285 6.62469 9.781Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const VolumeHighIcon = assignWithoutSideEffects(_VolumeHighIcon, {
  componentId: 'VolumeHighIcon',
});

export default VolumeHighIcon;
