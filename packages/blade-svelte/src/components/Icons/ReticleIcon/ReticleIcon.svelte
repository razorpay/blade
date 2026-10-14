<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <Path
    d="M13.0254 23H10.9629V13.8789H13.0254V23ZM10.1211 13.0332H1V10.9707H10.1211V13.0332ZM23.001 13.0332H13.8799V10.9707H23.001V13.0332ZM13.0254 10.1211H10.9629V1H13.0254V10.1211Z"
    fill={iconProps.iconColor}
  />
</Svg>
