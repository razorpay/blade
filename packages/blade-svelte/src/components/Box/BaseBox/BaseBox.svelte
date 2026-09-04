<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    cx,
  } from '@razorpay/blade-core/utils';
  import { getBoxClasses } from '@razorpay/blade-core/styles';
  import type { BaseBoxProps } from '../types';

  type BaseBoxComponentProps = BaseBoxProps & {
    /** DOM node reference, exposed for the `ref` (scrollIntoView/focus) use case. */
    element?: HTMLElement;
  };

  let {
    as = 'div',
    children,
    element = $bindable(undefined),
    className,
    testID,
    id,
    tabIndex,
    draggable,
    elementtiming,
    onMouseOver,
    onMouseEnter,
    onMouseLeave,
    onScroll,
    onDragStart,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDragEnd,
    onDrop,
    ...rest
  }: BaseBoxComponentProps = $props();

  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(
    !isStringChildren ? (children as Snippet | undefined) : undefined,
  );

  // `rest` still contains every style prop (padding, display, ...) plus
  // `data-blade-component`, `data-analytics-*` and `$isCard`. getBoxClasses
  // only reads the style props by name and ignores the rest.
  const boxClasses = $derived(getBoxClasses(rest));
  const combinedClasses = $derived(cx(boxClasses, className));

  const metaAttrs = $derived(
    metaAttribute({
      name: (rest['data-blade-component'] as string) ?? MetaConstants.BaseBox,
      testID,
    }),
  );

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<svelte:element
  this={as}
  bind:this={element}
  class={combinedClasses}
  {id}
  tabindex={tabIndex}
  {draggable}
  {elementtiming}
  {...metaAttrs}
  {...analyticsAttrs}
  onmouseover={onMouseOver}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeave}
  onscroll={onScroll}
  ondragstart={onDragStart}
  ondragenter={onDragEnter}
  ondragleave={onDragLeave}
  ondragover={onDragOver}
  ondragend={onDragEnd}
  ondrop={onDrop}
>
  {#if isStringChildren}
    {children}
  {:else if snippetChildren}
    {@render snippetChildren()}
  {/if}
</svelte:element>
