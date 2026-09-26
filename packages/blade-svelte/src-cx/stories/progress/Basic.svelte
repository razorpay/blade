<script lang="ts">
  import { Progress, type ProgressStyleProps } from '../../index';

  interface Props {
    args: ProgressStyleProps & { accessibilityLabel?: string };
  }

  let { args }: Props = $props();
</script>

<div class="text-surface-gray-normal">
  <Progress
    type={args.type}
    size={args.size}
    accessibilityLabel={args.accessibilityLabel || undefined}
    class={args.type === 'bar' ? 'w-48' : ''}
  />
</div>
