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
    d="M4 12C4 8.13401 7.13401 5 11 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H11C8.23858 7 6 9.23858 6 12C6 14.7614 8.23858 17 11 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H11C7.13401 19 4 15.866 4 12Z"
    fill={iconProps.iconColor}
  />
</Svg>
