<script lang="ts">
  import { IconButton, type IconButtonStyleProps } from '../../index';
  import * as glyphs from '../../icons/glyphs';

  interface Props {
    args: IconButtonStyleProps & {
      icon: keyof typeof glyphs;
      accessibilityLabel: string;
      isDisabled?: boolean;
      isLoading?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<IconButton
  icon={glyphs[args.icon]}
  accessibilityLabel={args.accessibilityLabel}
  emphasis={args.emphasis}
  isHighlighted={args.isHighlighted}
  size={args.size}
  isDisabled={args.isDisabled}
  isLoading={args.isLoading}
/>
