<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { getCardGroupTemplateClasses } from '@razorpay/blade-core/styles';
  import CollapsibleBody from '../Collapsible/CollapsibleBody.svelte';
  import { setInsideCardGroupBody } from './cardGroupContext';
  import type { CardGroupCollapsibleItemBodyProps } from './types';

  const templateClasses = getCardGroupTemplateClasses();

  let { children: content, testID, ...rest }: CardGroupCollapsibleItemBodyProps = $props();

  // Content rendered here is not a disclosure trigger — see cardGroupContext.
  setInsideCardGroupBody();

  const metaAttrs = $derived(
    metaAttribute({ name: MetaConstants.CardGroupCollapsibleItemBody, testID }),
  );
</script>

<CollapsibleBody _hasMargin={false} {...rest}>
  <div class={templateClasses.cardGroupCollapsibleBody} {...metaAttrs}>
    {#if typeof content === 'string'}
      {content}
    {:else}
      {@render content()}
    {/if}
  </div>
</CollapsibleBody>
