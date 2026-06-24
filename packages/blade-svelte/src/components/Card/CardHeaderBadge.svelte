<script lang="ts">
  import Badge from '../Badge/Badge.svelte';
  import { useCardContext } from './CardContext';
  import type { BadgeProps } from '../Badge/types';

  // Verify inside Card
  useCardContext('CardHeaderBadge');

  let { ...props }: BadgeProps = $props();
</script>

<Badge {...props} />
