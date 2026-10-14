<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <Path
    d="M15.7071 3.29289C15.3166 2.90237 14.6834 2.90237 14.2929 3.29289L9.29289 8.29289C8.90237 8.68342 8.90237 9.31658 9.29289 9.70711C9.68342 10.0976 10.3166 10.0976 10.7071 9.70711L14 6.41421V16C14 17.6569 12.6569 19 11 19H4C3.44772 19 3 19.4477 3 20C3 20.5523 3.44772 21 4 21H11C13.7614 21 16 18.7614 16 16V6.41421L19.2929 9.70711C19.6834 10.0976 20.3166 10.0976 20.7071 9.70711C21.0976 9.31658 21.0976 8.68342 20.7071 8.29289L15.7071 3.29289Z"
    fill={iconProps.iconColor}
  />
</Svg>
