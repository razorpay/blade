import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _FastForwardIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.61394 4.21066C2.31246 3.97617 1.90375 3.93389 1.56065 4.10169C1.21755 4.2695 1 4.61807 1 5.00001V19C1 19.3819 1.21755 19.7305 1.56065 19.8983C1.90375 20.0661 2.31246 20.0238 2.61394 19.7894L11.6139 12.7894C11.8575 12.5999 12 12.3086 12 12V19C12 19.3819 12.2176 19.7305 12.5606 19.8983C12.9037 20.0661 13.3125 20.0238 13.6139 19.7894L22.6139 12.7894C22.8575 12.5999 23 12.3086 23 12C23 11.6914 22.8575 11.4001 22.6139 11.2107L13.6139 4.21066C13.3125 3.97617 12.9037 3.93389 12.5606 4.10169C12.2176 4.2695 12 4.61807 12 5.00001V12C12 11.6914 11.8575 11.4001 11.6139 11.2107L2.61394 4.21066ZM9.37118 12L3 16.9554V7.04465L9.37118 12ZM20.3712 12L14 16.9554V7.04465L20.3712 12Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const FastForwardIcon = assignWithoutSideEffects(_FastForwardIcon, {
  componentId: 'FastForwardIcon',
});

export default FastForwardIcon;
