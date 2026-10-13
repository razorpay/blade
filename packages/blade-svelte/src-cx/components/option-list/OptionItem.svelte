<script lang="ts" generics="T">
  import type { ComponentProps } from 'svelte';
  import { createOptionMatch } from '../../runes/option-list/search.svelte';
  import OptionItemRow from './OptionItemRow.svelte';

  // One option of an OptionList. Inside a list with a `query`, an option
  // that fails it is not mounted at all — it leaves the value's rows, the
  // keyboard and the tab order — and is not counted, so its section and the
  // list know when none is left.
  type Props = ComponentProps<typeof OptionItemRow<T>>;

  let props: Props = $props();

  const match = createOptionMatch(() => ({
    title: props.text ?? props.title ?? '',
    value: props.value,
  }));
</script>

{#if match.isShown}
  <OptionItemRow {...props} />
{/if}
