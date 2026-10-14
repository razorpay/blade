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
    d="M15.2929 2.29289C15.6834 1.90237 16.3166 1.90237 16.7071 2.29289L21.7071 7.29289C22.0976 7.68342 22.0976 8.31658 21.7071 8.70711L8.70711 21.7071C8.51957 21.8946 8.26522 22 8 22H3C2.44772 22 2 21.5523 2 21V16C2 15.7348 2.10536 15.4804 2.29289 15.2929L15.2929 2.29289ZM4 16.4142V20H7.58579L19.5858 8L16 4.41421L4 16.4142Z"
    fill={iconProps.iconColor}
  />
</Svg>
