import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';

const TrademarkRegisteredIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.25 8.25C9.25 7.69772 9.69772 7.25 10.25 7.25H13.25C14.112 7.25 14.9386 7.59241 15.5481 8.2019C16.1576 8.8114 16.5 9.63805 16.5 10.5C16.5 11.362 16.1576 12.1886 15.5481 12.7981C15.386 12.9602 15.2086 13.1034 15.0192 13.2263L16.3325 15.1969C16.6388 15.6565 16.5146 16.2774 16.055 16.5836C15.5954 16.8899 14.9746 16.7657 14.6683 16.3061L12.9648 13.75H11.25V15.75C11.25 16.3023 10.8023 16.75 10.25 16.75C9.69772 16.75 9.25 16.3023 9.25 15.75V8.25ZM11.25 11.75H13.25C13.5815 11.75 13.8995 11.6183 14.1339 11.3839C14.3683 11.1495 14.5 10.8315 14.5 10.5C14.5 10.1685 14.3683 9.85054 14.1339 9.61612C13.8995 9.3817 13.5815 9.25 13.25 9.25H11.25V11.75Z"
        fill={iconColor}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.5 12C2.5 6.47715 6.97715 2 12.5 2C18.0228 2 22.5 6.47715 22.5 12C22.5 17.5228 18.0228 22 12.5 22C6.97715 22 2.5 17.5228 2.5 12ZM12.5 4C8.08172 4 4.5 7.58172 4.5 12C4.5 16.4183 8.08172 20 12.5 20C16.9183 20 20.5 16.4183 20.5 12C20.5 7.58172 16.9183 4 12.5 4Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default TrademarkRegisteredIcon;
