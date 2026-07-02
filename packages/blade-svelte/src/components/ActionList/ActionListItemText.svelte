<script lang="ts">
  import Text from '../Typography/Text/Text.svelte';
  import { getActionListItemContext } from './actionListContext';
  import type { ActionListItemTextProps } from './types';

  let { children }: ActionListItemTextProps = $props();

  // Row-local context (mirrors React `useBaseMenuItem()`): disabled → disabled
  // token, else muted. No context (used standalone) → muted.
  const itemContext = getActionListItemContext();
  const color = $derived(
    itemContext?.isDisabled ? 'interactive.text.gray.disabled' : 'interactive.text.gray.muted',
  );
</script>

<Text variant="caption" size="medium" {color}>
  {@render children()}
</Text>
