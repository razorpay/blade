<script lang="ts">
  import { Icon, icons, type IconStyleProps } from '../../index';

  interface Props {
    args: IconStyleProps & {
      glyph: keyof typeof icons;
      accessibilityLabel?: string;
    };
  }

  let { args }: Props = $props();
</script>

<Icon
  source={icons[args.glyph]}
  size={args.size}
  color={args.color}
  accessibilityLabel={args.accessibilityLabel || undefined}
/>
