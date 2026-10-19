<script lang="ts">
  import { DotLoader, type DotLoaderStyleProps } from '../../index';

  interface Props {
    args: DotLoaderStyleProps & { accessibilityLabel?: string };
  }

  let { args }: Props = $props();
</script>

<DotLoader
  size={args.size}
  color={args.color}
  accessibilityLabel={args.accessibilityLabel || undefined}
/>
