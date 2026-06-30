<script lang="ts">
  import type { Snippet } from 'svelte';
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { getAccordionTemplateClasses } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import CollapsibleBody from '../Collapsible/CollapsibleBody.svelte';
  import { getAccordionContext, getAccordionItemContext } from './context';
  import type { AccordionItemBodyProps } from './types';

  const templateClasses = getAccordionTemplateClasses();

  let { children, ...rest }: AccordionItemBodyProps = $props();

  const getItemCtx = getAccordionItemContext();
  const itemCtx = $derived(getItemCtx());
  const getAccCtx = getAccordionContext();
  const accordionCtx = $derived(getAccCtx());

  const accordionSize = $derived(accordionCtx.size);

  const isGrayBody = $derived(accordionCtx.hasGrayBody);
  // When the gray body belongs to the last item, round its bottom corners so the
  // edge-to-edge gray surface follows the filled card's rounded bottom.
  const isLastItem = $derived(
    typeof itemCtx.index === 'number' && itemCtx.index === accordionCtx.numberOfItems - 1,
  );

  // Gray surface + last-item radius live *inside* CollapsibleBody so they collapse
  // along with the animated height instead of staying painted while collapsed.
  const grayWrapperClass = $derived(
    [
      isGrayBody ? templateClasses.collapsibleContentGray : '',
      isGrayBody && isLastItem ? templateClasses.collapsibleContentGrayLast : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  const bodyClass = $derived(
    [templateClasses.body, isGrayBody ? templateClasses.bodyGray : '']
      .filter(Boolean)
      .join(' '),
  );

  const descriptionFontSize = $derived(accordionSize === 'large' ? 100 : 75);
  const descriptionLineHeight = $derived(accordionSize === 'large' ? 100 : 75);

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(!isStringChildren ? (children as Snippet) : undefined);

  const metaAttrs = metaAttribute({ name: MetaConstants.AccordionItemBody });
</script>

<CollapsibleBody width="100%" _hasMargin={false} {...rest}>
  <div class={grayWrapperClass} {...metaAttrs}>
    <div class={bodyClass}>
      <BaseText
        as="div"
        color="surface.text.gray.subtle"
        fontSize={descriptionFontSize}
        lineHeight={descriptionLineHeight}
        letterSpacing={50}
        fontFamily="text"
        fontWeight="regular"
      >
        {#if isStringChildren}
          {children}
        {:else if snippetChildren}
          {@render snippetChildren()}
        {/if}
      </BaseText>
    </div>
  </div>
</CollapsibleBody>
