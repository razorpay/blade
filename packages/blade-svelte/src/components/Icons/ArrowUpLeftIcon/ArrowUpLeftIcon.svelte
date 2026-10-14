<script lang="ts">
  import { Svg, Path } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <Path
    d="M6 5C5.44772 5 5 5.44772 5 6V15C5 15.5523 5.44772 16 6 16C6.55228 16 7 15.5523 7 15V8.41421L17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L8.41421 7H15C15.5523 7 16 6.55228 16 6C16 5.44772 15.5523 5 15 5H6Z"
    fill={iconProps.iconColor}
  />
</Svg>
