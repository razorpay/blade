<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg
  width={iconProps.width}
  height={iconProps.height}
  viewBox="0 0 24 24"
  {...rest}
>
  <Path
    d="M4 12C4 11.4477 4.44772 11 5 11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H5C4.44772 13 4 12.5523 4 12Z"
    fill={iconProps.iconColor}
  />
</Svg>
