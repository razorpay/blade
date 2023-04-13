import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const CompassIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.1887 8.0762C17.3085 7.71687 17.215 7.3207 16.9471 7.05287C16.6793 6.78504 16.2831 6.69151 15.9238 6.81129L9.56381 8.93129C9.2652 9.03083 9.03089 9.26514 8.93135 9.56375L6.81135 15.9237C6.69158 16.2831 6.7851 16.6792 7.05293 16.9471C7.32076 17.2149 7.71693 17.3084 8.07626 17.1887L14.4363 15.0687C14.7349 14.9691 14.9692 14.7348 15.0687 14.4362L17.1887 8.0762ZM9.34118 14.6588L10.6706 10.6705L14.6589 9.34111L13.3295 13.3294L9.34118 14.6588Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default CompassIcon;
