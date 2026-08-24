<script lang="ts">
  import ActionList from '../ActionList.svelte';
  import ActionListItem from '../ActionListItem.svelte';
  import type { ActionListProps } from '../types';

  let props: ActionListProps = $props();
</script>

<ActionList {...props}>
  {#snippet children()}
    <ActionListItem title="Item 1" value="item1" />
  {/snippet}
</ActionList>
