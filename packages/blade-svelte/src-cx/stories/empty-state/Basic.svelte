<script lang="ts">
  import {
    Button,
    EmptyState,
    Icon,
    icons,
    type EmptyStateStyleProps,
  } from '../../index';

  interface Props {
    args: EmptyStateStyleProps & { title?: string; message?: string };
  }

  let { args }: Props = $props();
</script>

<EmptyState
  color={args.color}
  title={args.title ?? 'Payment failed'}
  message={args.message}
  class="w-80"
>
  {#snippet media()}<Icon source={icons.warning} size="large" />{/snippet}
  <Button type="button">Try again</Button>
</EmptyState>
