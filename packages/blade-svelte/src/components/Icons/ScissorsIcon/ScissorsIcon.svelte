<script lang="ts">
  import { Svg, G, Path, Defs, ClipPath, Rect } from '../_Svg';
  import { getIconProps } from '../getIconProps';
  import type { IconProps } from '../types';

  let { size = 'medium', color = 'surface.icon.gray.normal', ...rest }: IconProps = $props();

  const iconProps = $derived(getIconProps({ size, color }));
</script>

<Svg width={iconProps.width} height={iconProps.height} viewBox="0 0 24 24" {...rest}>
  <G clipPath="url(#clip0_83_463)">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 9C7.65685 9 9 7.65685 9 6C9 4.34315 7.65685 3 6 3C4.34315 3 3 4.34315 3 6C3 7.65685 4.34315 9 6 9Z"
      stroke={iconProps.iconColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z"
      stroke={iconProps.iconColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20 4L8.12 15.88"
      stroke={iconProps.iconColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14.47 14.48L20 20"
      stroke={iconProps.iconColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8.12 8.12L12 12"
      stroke={iconProps.iconColor}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </G>
  <Defs>
    <ClipPath id="clip0_83_463">
      <Rect width="24" height="24" fill={iconProps.iconColor} />
    </ClipPath>
  </Defs>
</Svg>
