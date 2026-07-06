<script lang="ts">
  import Badge from '../Badge/Badge.svelte';
  import type { ActionListItemBadgeProps } from './types';

  // `size` is forced to `medium` and a `spacing.3` left margin is applied
  // (mirrors React `_ActionListItemBadge`); all other Badge props flow through.
  let { ...badgeProps }: ActionListItemBadgeProps = $props();
</script>

<Badge size="medium" marginLeft="spacing.3" {...badgeProps} />
