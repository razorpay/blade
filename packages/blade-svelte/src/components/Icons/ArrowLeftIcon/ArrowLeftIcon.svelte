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
    d="M10.7071 6.70711C11.0976 6.31658 11.0976 5.68342 10.7071 5.29289C10.3166 4.90237 9.68342 4.90237 9.29289 5.29289L3.29289 11.2929C2.90237 11.6834 2.90237 12.3166 3.29289 12.7071L9.29289 18.7071C9.68342 19.0976 10.3166 19.0976 10.7071 18.7071C11.0976 18.3166 11.0976 17.6834 10.7071 17.2929L6.41421 13H20C20.5523 13 21 12.5523 21 12C21 11.4477 20.5523 11 20 11H6.41421L10.7071 6.70711Z"
    fill={iconProps.iconColor}
  />
</Svg>
