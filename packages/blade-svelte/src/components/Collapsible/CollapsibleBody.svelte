<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getCollapsibleTemplateClasses } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import { getCollapsibleContext } from './context';
  import type { CollapsibleBodyProps } from './types';

  const templateClasses = getCollapsibleTemplateClasses();

  let { children, testID, ...rest }: CollapsibleBodyProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error(
      '[blade-svelte] CollapsibleBody must be used inside a <Collapsible> component.',
    );
  }

  const ctx = $derived(getCtx());

  const isExpanded = $derived(ctx.isExpanded);
  const collapsibleBodyId = $derived(ctx.collapsibleBodyId);
  const size = $derived(ctx.size);

  const descriptionFontSize = $derived(size === 'large' ? 100 : 75);
  const descriptionLineHeight = $derived(size === 'large' ? 100 : 75);

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

  const metaAttrs = metaAttribute({ name: MetaConstants.CollapsibleBody, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const bodyA11y = $derived(
    makeAccessible({ role: 'region', hidden: !isExpanded }),
  );
</script>

<div
  bind:this={bodyRef}
  id={collapsibleBodyId}
  class={templateClasses.body}
  ontransitionend={onTransitionEnd}
  {...bodyA11y}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={templateClasses.bodyInner}>
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
