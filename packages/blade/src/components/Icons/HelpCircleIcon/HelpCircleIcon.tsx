import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
const _HelpCircleIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });
  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path fill={iconColor} d="M 13.13 16.88 a 1.13 1.13 0 1 1 -1.12 -1.12 A 1.13 1.13 0 0 1 13.13 16.88 Z M 12 6.75 c -2.07 0 -3.75 1.51 -3.75 3.38 v 0.38 a 0.75 0.75 0 0 0 1.5 0 v -0.37 c 0 -1.03 1.01 -1.87 2.25 -1.87 s 2.25 0.84 2.25 1.88 -1.01 1.88 -2.25 1.88 a 0.75 0.75 0 0 0 -0.75 0.75 v 0.75 a 0.75 0.75 0 0 0 1.5 0 v -0.07 c 1.71 -0.31 3 -1.68 3 -3.31 C 15.75 8.26 14.07 6.75 12 6.75 Z m 9.75 5.25 A 9.75 9.75 0 1 1 12 2.25 9.76 9.76 0 0 1 21.75 12 Z m -1.5 0 a 8.25 8.25 0 1 0 -8.25 8.25 A 8.26 8.26 0 0 0 20.25 12 Z" />
    </Svg>
  );
};
const HelpCircleIcon = assignWithoutSideEffects(_HelpCircleIcon, {
  componentId: 'HelpCircleIcon',
});
export default HelpCircleIcon;