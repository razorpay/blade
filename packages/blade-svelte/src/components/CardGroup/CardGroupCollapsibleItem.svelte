<script lang="ts">
  import Collapsible from '../Collapsible/Collapsible.svelte';
  import type { CardGroupCollapsibleItemProps } from './types';

  let {
    children: content,
    isExpanded,
    defaultIsExpanded = false,
    onExpandChange,
    testID,
    ...rest
  }: CardGroupCollapsibleItemProps = $props();
</script>

<Collapsible
  {isExpanded}
  {defaultIsExpanded}
  {onExpandChange}
  direction="bottom"
  _shouldApplyWidthRestrictions={false}
  {testID}
  {...rest}
>
  {@render content()}
</Collapsible>
