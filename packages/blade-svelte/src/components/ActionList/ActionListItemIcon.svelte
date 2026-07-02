<script lang="ts">
  import { getActionListItemContext } from './actionListContext';
  import type { ActionListItemIconProps } from './types';

  let { icon: Icon }: ActionListItemIconProps = $props();

  // Row-local context (mirrors React `useBaseMenuItem()`): negative intent →
  // negative icon; otherwise gray normal/disabled per the row's disabled state.
  const itemContext = getActionListItemContext();
  const color = $derived(
    itemContext?.intent === 'negative'
      ? 'feedback.icon.negative.intense'
      : itemContext?.isDisabled
        ? 'interactive.icon.gray.disabled'
        : 'interactive.icon.gray.normal',
  );
</script>

<Icon {color} size="medium" />
