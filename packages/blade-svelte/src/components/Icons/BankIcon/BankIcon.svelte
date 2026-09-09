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
    d="M5.105 10.429a1 1 0 0 0-1 1v5.333a1 1 0 0 0 1 1h1.158a1 1 0 0 0 1-1v-5.333a1 1 0 0 0-1-1H5.105Zm6.316 0a1 1 0 0 0-1 1v5.333a1 1 0 0 0 1 1h1.158a1 1 0 0 0 1-1v-5.333a1 1 0 0 0-1-1H11.42ZM2 22a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-1.143a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1V22Zm15.737-11.571a1 1 0 0 0-1 1v5.333a1 1 0 0 0 1 1h1.158a1 1 0 0 0 1-1v-5.333a1 1 0 0 0-1-1h-1.158Zm-5.273-9.186a1 1 0 0 0-.928 0l-9 4.714A1 1 0 0 0 2 6.843v.49a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-.49a1 1 0 0 0-.536-.886l-9-4.714Z"
    fill={iconProps.iconColor}
  />
</Svg>
