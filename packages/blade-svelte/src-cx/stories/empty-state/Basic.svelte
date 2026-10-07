<script lang="ts">
  import {
    Button,
    EmptyState,
    Icon,
    type EmptyStateStyleProps,
  } from '../../index';
  import { AlertTriangleIcon } from '../../icons';

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
  {#snippet asset()}<Icon source={AlertTriangleIcon} size="xlarge" />{/snippet}
  <Button type="button">Create Payment Link</Button>
</EmptyState>
