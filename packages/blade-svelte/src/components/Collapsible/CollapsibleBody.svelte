<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getCollapsibleBodyClasses, getCollapsibleTemplateClasses } from '@razorpay/blade-core/styles';
  import { getCollapsibleContext } from './context';
  import type { CollapsibleBodyProps } from './types';

  const templateClasses = getCollapsibleTemplateClasses();

  let { children, width, testID, _hasMargin = true, ...rest }: CollapsibleBodyProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error('[blade-svelte] CollapsibleBody must be used inside a <Collapsible> component.');
  }

  const ctx = $derived(getCtx());

  const isExpanded = $derived(ctx.isExpanded);
  const defaultIsExpanded = $derived(ctx.defaultIsExpanded);
  const collapsibleBodyId = $derived(ctx.collapsibleBodyId);
  const direction = $derived(ctx.direction);

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(!isStringChildren ? (children as Snippet) : undefined);

  const bodyContentClass = getCollapsibleBodyClasses();
  const innerStyle = $derived(
    _hasMargin
      ? `margin-top: ${direction === 'bottom' ? 'var(--spacing-4)' : '0px'}; margin-bottom: ${
          direction === 'top' ? 'var(--spacing-4)' : '0px'
        }`
      : '',
  );

  let bodyRef: HTMLDivElement | undefined = $state(undefined);
  let isInitialRender = true;

  $effect(() => {
    const expanded = isExpanded;

    if (!bodyRef) return;

    if (isInitialRender) {
      isInitialRender = false;
      // Initial styles are driven by `defaultIsExpanded` (see styles), inline
      // styles take over after first render.
      if (expanded) {
        bodyRef.style.height = 'auto';
        bodyRef.style.display = 'block';
        bodyRef.style.opacity = '1';
      } else {
        bodyRef.style.height = '0px';
        bodyRef.style.display = 'none';
        bodyRef.style.opacity = '0.8';
      }
      return;
    }

    bodyRef.style.display = 'block';
    const actualHeight = bodyRef.scrollHeight;

    if (!expanded) {
      // collapse: actual height -> 0px
      requestAnimationFrame(() => {
        if (!bodyRef) return;
        bodyRef.style.height = `${actualHeight}px`;
        bodyRef.style.opacity = '1';

        requestAnimationFrame(() => {
          if (!bodyRef) return;
          bodyRef.style.height = '0px';
          bodyRef.style.opacity = '0.8';
        });
      });
    } else {
      // expand: 0px -> actual height (then -> auto in transitionend)
      requestAnimationFrame(() => {
        if (!bodyRef) return;
        bodyRef.style.height = '0px';
        bodyRef.style.opacity = '0.8';

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

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.CollapsibleBody, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const bodyA11y = $derived(makeAccessible({ role: 'region', hidden: !isExpanded }));
</script>

<div
  id={collapsibleBodyId}
  style={width ? `width: ${width}` : undefined}
  {...bodyA11y}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div
    bind:this={bodyRef}
    class={bodyContentClass}
    data-default-expanded={defaultIsExpanded ? 'true' : 'false'}
    ontransitionend={onTransitionEnd}
  >
    <div class={templateClasses.bodyInner} style={innerStyle}>
      {#if isStringChildren}
        {children}
      {:else if snippetChildren}
        {@render snippetChildren()}
      {/if}
    </div>
  </div>
</div>
