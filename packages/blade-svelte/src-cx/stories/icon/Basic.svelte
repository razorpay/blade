<script lang="ts">
  import { Icon, type IconStyleProps } from '../../index';
  import * as glyphs from '../../icons/glyphs';

  interface Props {
    args: IconStyleProps & {
      source: keyof typeof glyphs;
      accessibilityLabel?: string;
    };
  }

  let { args }: Props = $props();
</script>

<Icon
  source={glyphs[args.source]}
  size={args.size}
  color={args.color}
  accessibilityLabel={args.accessibilityLabel || undefined}
/>
