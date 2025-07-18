import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _SortIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.54893 1.29663C8.359 1.1067 8.1014 1 7.8328 1C7.5642 1 7.3066 1.1067 7.11667 1.29663L2.29662 6.11675C1.90112 6.51225 1.90113 7.1535 2.29663 7.549C2.69214 7.9445 3.33338 7.9445 3.72889 7.54899L6.88779 4.39005V12.9499C6.88779 13.5092 7.34121 13.9627 7.90054 13.9627C8.45987 13.9627 8.9133 13.5092 8.9133 12.9499V4.5255L11.9368 7.54899C12.3323 7.9445 12.9735 7.9445 13.369 7.54899C13.7645 7.15349 13.7645 6.51225 13.369 6.11674L8.54893 1.29663Z"
        fill={iconColor}
      />
      <Path
        d="M15.2611 22.8159C14.9925 22.8159 14.7349 22.7092 14.545 22.5193L9.72486 17.6992C9.32935 17.3037 9.32935 16.6624 9.72486 16.2669C10.1204 15.8714 10.7616 15.8714 11.1571 16.2669L14.1806 19.2904L14.1806 10.866C14.1806 10.3067 14.634 9.85326 15.1934 9.85326C15.7527 9.85326 16.2061 10.3067 16.2061 10.866L16.2061 19.4259L19.365 16.2669C19.7605 15.8714 20.4018 15.8714 20.7973 16.2669C21.1928 16.6624 21.1928 17.3037 20.7973 17.6992L15.9772 22.5193C15.7873 22.7092 15.5297 22.8159 15.2611 22.8159Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const SortIcon = assignWithoutSideEffects(_SortIcon, {
  componentId: 'SortIcon',
});

export default SortIcon;
