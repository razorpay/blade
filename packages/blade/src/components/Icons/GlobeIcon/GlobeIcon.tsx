import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _GlobeIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0118 1C18.0815 1.00638 23 5.9288 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92864 5.91875 1.00612 11.9887 1M16.9499 11C16.7257 8.23681 15.8009 5.58442 14.2743 3.28983C17.8312 4.21598 20.532 7.26324 20.9451 11H16.9499ZM14.9424 11C14.6912 8.28682 13.6697 5.70191 12 3.55077C10.3303 5.70191 9.30878 8.28682 9.05759 11H14.9424ZM9.05759 13H14.9424C14.6912 15.7132 13.6697 18.298 12 20.4492C10.3303 18.298 9.30879 15.7132 9.05759 13ZM7.05009 11H3.05493C3.46801 7.26324 6.1688 4.21598 9.72569 3.28983C8.19909 5.58442 7.27429 8.23681 7.05009 11ZM7.05009 13C7.2743 15.7632 8.19911 18.4156 9.72572 20.7102C6.16881 19.784 3.46801 16.7368 3.05493 13H7.05009ZM14.2743 20.7102C15.8009 18.4156 16.7257 15.7632 16.9499 13H20.9451C20.532 16.7368 17.8312 19.784 14.2743 20.7102Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const GlobeIcon = assignWithoutSideEffects(_GlobeIcon, {
  componentId: 'GlobeIcon',
});

export default GlobeIcon;
