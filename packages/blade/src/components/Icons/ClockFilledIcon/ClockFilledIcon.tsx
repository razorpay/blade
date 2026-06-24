import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _ClockFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1ZM12 5C11.4477 5 11 5.44772 11 6V12C11 12.2652 11.1054 12.5195 11.293 12.707L14.293 15.707C14.6835 16.0976 15.3165 16.0976 15.707 15.707C16.0976 15.3165 16.0976 14.6835 15.707 14.293L13 11.5859V6C13 5.44772 12.5523 5 12 5Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const ClockFilledIcon = assignWithoutSideEffects(_ClockFilledIcon, {
  componentId: 'ClockFilledIcon',
});

export default ClockFilledIcon;
