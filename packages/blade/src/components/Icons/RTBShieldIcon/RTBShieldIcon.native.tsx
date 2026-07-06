import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * Native fallback for RTBShieldIcon.
 *
 * The branded gradients/drop-shadow used on web are not supported by the Blade `_Svg`
 * native primitives, so native renders a solid-fill shield silhouette using the standard
 * icon color tokens. The white inner mark is kept as a knockout so the glyph stays legible.
 */
const _RTBShieldIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.7981 3.96094V15.3838C19.798 16.163 19.4121 16.8915 18.7679 17.3301L12.1311 21.8467L5.49443 17.3301C4.85022 16.8915 4.46425 16.163 4.46415 15.3838V3.96094L12.1311 2.09277L19.7981 3.96094Z"
        fill={iconColor}
      />
      <Path
        d="M11.5244 8.82L11.0532 10.6936L13.7494 8.80947L11.9861 15.9179L13.7767 15.9196L16.3815 5.42041L11.5244 8.82Z"
        fill="white"
      />
      <Path
        d="M8.62275 12.9321L7.88147 15.9204H11.5517L13.0534 9.8411L8.62275 12.9321Z"
        fill="white"
      />
    </Svg>
  );
};

const RTBShieldIcon = assignWithoutSideEffects(_RTBShieldIcon, {
  componentId: 'RTBShieldIcon',
});

export default RTBShieldIcon;
