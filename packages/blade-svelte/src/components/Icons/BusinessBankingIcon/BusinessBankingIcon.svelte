<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <Path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M20 2H16.5L10.4375 9.76L7.5 6H4L8.6875 12L4 18H7.5L10.4375 14.24L16.5 22H20L12.1875 12L20 2Z"
    fill={iconProps.iconColor}
  />
</Svg>
