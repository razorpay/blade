<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <Path
    d="M6.5 6.5L17.5 17.5L12 23V1L17.5 6.5L6.5 17.5"
    stroke={iconProps.iconColor}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</Svg>
