<script lang="ts">
  import {
    Button,
    EmptyState,
    Icon,
    icons,
    type EmptyStateStyleProps,
  } from '../../index';

  interface Props {
    args: EmptyStateStyleProps & { title?: string; description?: string };
  }

  let { args }: Props = $props();
</script>

<EmptyState
  size={args.size}
  title={args.title}
  description={args.description}
>
  {#snippet asset()}<Icon source={icons.warning} size="xlarge" />{/snippet}
  <Button type="button">Create Payment Link</Button>
</EmptyState>
