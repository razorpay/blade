<script lang="ts">
  import {
    IconButton,
    icons,
    type IconButtonStyleProps,
  } from '../../index';

  interface Props {
    args: IconButtonStyleProps & {
      glyph: keyof typeof icons;
      accessibilityLabel: string;
      isDisabled?: boolean;
      isLoading?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<IconButton
  icon={icons[args.glyph]}
  accessibilityLabel={args.accessibilityLabel}
  emphasis={args.emphasis}
  isHighlighted={args.isHighlighted}
  size={args.size}
  isDisabled={args.isDisabled}
  isLoading={args.isLoading}
/>
