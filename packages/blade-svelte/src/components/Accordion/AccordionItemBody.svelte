<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getAccordionTemplateClasses } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import { getAccordionContext, getAccordionItemContext } from './context';
  import type { AccordionItemBodyProps } from './types';

  const templateClasses = getAccordionTemplateClasses();

  let { children, ...rest }: AccordionItemBodyProps = $props();

  const getAccCtx = getAccordionContext();
  const getItemCtx = getAccordionItemContext();

  const accordionCtx = $derived(getAccCtx());
  const itemCtx = $derived(getItemCtx());

  const isExpanded = $derived(itemCtx.isExpanded);
  const collapsibleBodyId = $derived(itemCtx.collapsibleBodyId);
  const accordionSize = $derived(accordionCtx.size);

  const isGrayBody = $derived(accordionCtx.hasGrayBody);
  // When the gray body belongs to the last item, round its bottom corners so the
  // edge-to-edge gray surface follows the filled card's rounded bottom.
  const isLastItem = $derived(
    typeof itemCtx.index === 'number' && itemCtx.index === accordionCtx.numberOfItems - 1,
  );

  const collapsibleContentClass = $derived(
    [
      templateClasses.collapsibleContent,
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

  let bodyRef: HTMLDivElement | undefined = $state(undefined);
  let isInitialRender = true;

  $effect(() => {
    const expanded = isExpanded;

    if (!bodyRef) return;

    if (isInitialRender) {
      isInitialRender = false;
      if (expanded) {
        bodyRef.style.height = 'auto';
        bodyRef.style.display = 'block';
        bodyRef.style.opacity = '1';
      } else {
        bodyRef.style.height = '0px';
        bodyRef.style.display = 'none';
        bodyRef.style.opacity = '0';
      }
      return;
    }

    bodyRef.style.display = 'block';
    const actualHeight = bodyRef.scrollHeight;

    if (!expanded) {
      requestAnimationFrame(() => {
        if (!bodyRef) return;
        bodyRef.style.height = `${actualHeight}px`;
        bodyRef.style.opacity = '1';

        requestAnimationFrame(() => {
          if (!bodyRef) return;
          bodyRef.style.height = '0px';
          bodyRef.style.opacity = '0';
        });
      });
    } else {
      requestAnimationFrame(() => {
        if (!bodyRef) return;
        bodyRef.style.height = '0px';
        bodyRef.style.opacity = '0';

        requestAnimationFrame(() => {
          if (!bodyRef) return;
          bodyRef.style.height = `${actualHeight}px`;
          bodyRef.style.opacity = '1';
        });
      });
    }
  });

  const onTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName === 'height' && bodyRef) {
      if (isExpanded) {
        requestAnimationFrame(() => {
          if (bodyRef) bodyRef.style.height = 'auto';
        });
      } else {
        requestAnimationFrame(() => {
          if (bodyRef) bodyRef.style.display = 'none';
        });
      }
    }
  };

  const metaAttrs = metaAttribute({ name: MetaConstants.AccordionItemBody });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const bodyA11y = $derived(
    makeAccessible({ role: 'region', hidden: !isExpanded }),
  );
</script>

<div
  bind:this={bodyRef}
  id={collapsibleBodyId}
  class={collapsibleContentClass}
  ontransitionend={onTransitionEnd}
  {...bodyA11y}
  {...metaAttrs}
  {...analyticsAttrs}
>
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
