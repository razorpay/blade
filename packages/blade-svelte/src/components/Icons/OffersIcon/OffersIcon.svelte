<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <Path
    d="M21.41 11.58L12.415 2.585C12.05 2.225 11.55 2 11 2H4C2.895 2 2 2.895 2 4V11C2 11.555 2.225 12.055 2.59 12.415L11.59 21.415C11.95 21.775 12.45 22 13 22C13.55 22 14.055 21.775 14.415 21.415L21.415 14.415C21.775 14.05 22 13.55 22 13C22 12.445 21.775 11.945 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7Z"
    fill={iconProps.iconColor}
  />
</Svg>
