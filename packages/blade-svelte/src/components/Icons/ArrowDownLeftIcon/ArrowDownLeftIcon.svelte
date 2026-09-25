<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <Path
    d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L7 15.5858V9C7 8.44772 6.55228 8 6 8C5.44772 8 5 8.44772 5 9V17.9998C5 18.1354 5.02699 18.2649 5.07588 18.3828C5.12432 18.4999 5.19595 18.6096 5.29078 18.705C5.29219 18.7064 5.2936 18.7078 5.29502 18.7092C5.48924 18.9023 5.74301 18.9992 5.997 19C5.998 19 5.999 19 6 19H15C15.5523 19 16 18.5523 16 18C16 17.4477 15.5523 17 15 17H8.41421L18.7071 6.70711Z"
    fill={iconProps.iconColor}
  />
</Svg>
