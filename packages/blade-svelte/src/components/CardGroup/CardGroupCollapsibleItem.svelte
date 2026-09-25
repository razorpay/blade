<script lang="ts">
  import { getCardGroupTemplateClasses } from '@razorpay/blade-core/styles';
  import Collapsible from '../Collapsible/Collapsible.svelte';
  import type { CardGroupCollapsibleItemProps } from './types';

  const templateClasses = getCardGroupTemplateClasses();

  let {
    children: content,
    isExpanded,
    defaultIsExpanded = false,
    onExpandChange,
    testID,
    ...rest
  }: CardGroupCollapsibleItemProps = $props();
</script>

<div class={templateClasses.cardGroupCollapsibleItem}>
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
</div>
