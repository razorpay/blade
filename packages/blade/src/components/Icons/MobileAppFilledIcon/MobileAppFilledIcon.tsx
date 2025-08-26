import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _MobileAppFilledIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 1.00049C18.6569 1.00049 20 2.34363 20 4.00049V20.0005C20 21.6573 18.6569 23.0005 17 23.0005H7C5.34315 23.0005 4 21.6573 4 20.0005V4.00049C4 2.34363 5.34315 1.00049 7 1.00049H17ZM9 17.0005C8.44772 17.0005 8 17.4482 8 18.0005C8 18.5528 8.44772 19.0005 9 19.0005H15C15.5523 19.0005 16 18.5528 16 18.0005C16 17.4482 15.5523 17.0005 15 17.0005H9Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const MobileAppFilledIcon = assignWithoutSideEffects(_MobileAppFilledIcon, {
  componentId: 'MobileAppFilledIcon',
});

export default MobileAppFilledIcon;
