import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FreelanceFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.9688 2C14.7644 2 15.5272 2.3163 16.0898 2.87891C16.6525 3.44151 16.9688 4.20435 16.9688 5V6H19.9688C21.6256 6 22.9688 7.34315 22.9688 9V19C22.9688 20.6569 21.6256 22 19.9688 22H16.7188V6H15.2188V22H8.71875V6H7.21875V22H3.96875C2.3119 22 0.96875 20.6569 0.96875 19V9C0.96875 7.34315 2.3119 6 3.96875 6H6.96875V5C6.96875 4.20435 7.28505 3.44151 7.84766 2.87891C8.41026 2.3163 9.1731 2 9.96875 2H13.9688ZM9.96875 4C9.70353 4 9.44925 4.10543 9.26172 4.29297C9.07418 4.48051 8.96875 4.73478 8.96875 5V6H14.9688V5C14.9688 4.73478 14.8633 4.48051 14.6758 4.29297C14.4882 4.10543 14.234 4 13.9688 4H9.96875Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FreelanceFilledIcon = assignWithoutSideEffects(_FreelanceFilledIcon, {
  componentId: 'FreelanceFilledIcon',
});

export default FreelanceFilledIcon;
