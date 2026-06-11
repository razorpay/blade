<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getTabsClasses } from '@razorpay/blade-core/styles';
  import { getTabsContext } from './context';
  import type { TabItemProps } from './types';

  const classes = getTabsClasses();

  let {
    children,
    value,
    leading,
    trailing,
    isDisabled = false,
    href,
    onClick,
    testID,
    ...rest
  }: TabItemProps = $props();

  const getCtx = getTabsContext();
  const ctx = $derived(getCtx());

  // Auto-select first tab if no value is set
  getCtx().registerTabItem(value);

  const isSelected = $derived(ctx.selectedValue === value);
  const isFilled = $derived(ctx.variant === 'filled');
  const isBordered = $derived(ctx.variant === 'bordered' || ctx.variant === 'borderless');
  const _variant = $derived(ctx.variant === 'borderless' ? 'bordered' : ctx.variant);

  const panelId = $derived(`${ctx.baseId}-${value}-tabpanel`);
  const tabItemId = $derived(`${ctx.baseId}-${value}-tabitem`);

  const handleClick = (event: MouseEvent) => {
    ctx.setSelectedValue(value);
    onClick?.(event);
  };

  const textColorClass = $derived(
    isSelected ? 'interactive-text-gray-normal' : 'interactive-text-gray-muted',
  );

  const textSize = $derived(
    ctx.size === 'large' ? 'large' : 'medium',
  );


  const buttonClasses = $derived(() => {
    const result: string[] = [classes.tabButton];

    // Direction
    result.push(ctx.isVertical ? classes.tabButtonVertical : classes.tabButtonHorizontal);

    // Full width
    if (ctx.isFullWidthTabItem || isFilled) {
      result.push(classes.tabButtonFullWidth);
    }

    // Padding based on variant, orientation, size
    const orientation = ctx.isVertical ? 'Vert' : 'Horiz';
    const sizeKey = ctx.size.charAt(0).toUpperCase() + ctx.size.slice(1);
    const paddingClass = `tab${_variant === 'bordered' ? 'Bordered' : 'Filled'}${orientation}${sizeKey}`;
    if (classes[paddingClass]) {
      result.push(classes[paddingClass]);
    }

    // Border for bordered variant
    if (isBordered) {
      result.push(
        ctx.isVertical ? classes.tabBorderedBorderLeft : classes.tabBorderedBorderBottom,
      );
    }

    // Border radius
    if (isFilled) {
      if (ctx.size === 'small' && !ctx.isVertical) {
        result.push(classes.tabRadiusMedium);
      } else {
        result.push(classes.tabRadiusSmall);
      }
    } else {
      result.push(classes.tabRadiusNone);
    }

    // Background
    if (isFilled && isSelected && ctx.isVertical) {
      result.push(classes.tabBgFilledSelectedVertical);
    } else {
      result.push(classes.tabBgTransparent);
    }

    // Filled unselected hover class
    if (isFilled && !isSelected) {
      result.push(classes.tabFilledUnselected);
    }

    // Stacking context for filled horizontal
    if (isFilled && !ctx.isVertical) {
      result.push(classes.tabStackingContext);
    }

    // Focus radius
    if (isFilled) {
      if (ctx.size === 'small' && !ctx.isVertical) {
        result.push(classes.tabFocusRadiusMedium);
      } else {
        result.push(classes.tabFocusRadiusSmall);
      }
    } else {
      result.push(classes.tabFocusRadiusMedium);
    }

    return result.filter(Boolean).join(' ');
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.TabItem, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<!-- svelte-ignore a11y_role_supports_aria_props -->
{#if href}
  <a
    {href}
    id={tabItemId}
    class={buttonClasses()}
    role="tab"
    aria-selected={isSelected}
    aria-controls={panelId}
    tabindex={isSelected ? 0 : -1}
    aria-disabled={isDisabled}
    onclick={handleClick}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {#if leading}
      {@render leading()}
    {/if}
    {#if children}
      <span
        class="tab-item-text"
        style="color: var(--{textColorClass}); font-size: var(--font-size-{textSize === 'large' ? '175' : '100'}); font-weight: var(--font-weight-medium); line-height: var(--line-height-{textSize === 'large' ? 'l' : 'm'});"
      >
        {#if children}{@render children()}{/if}
      </span>
    {/if}
    {#if trailing}
      {@render trailing()}
    {/if}
  </a>
{:else}
  <button
    type="button"
    id={tabItemId}
    class={buttonClasses()}
    role="tab"
    aria-selected={isSelected}
    aria-controls={panelId}
    tabindex={isSelected ? 0 : -1}
    disabled={isDisabled}
    onclick={handleClick}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {#if leading}
      {@render leading()}
    {/if}
    {#if children}
      <span
        class="tab-item-text"
        style="color: var(--{textColorClass}); font-size: var(--font-size-{textSize === 'large' ? '175' : '100'}); font-weight: var(--font-weight-medium); line-height: var(--line-height-{textSize === 'large' ? 'l' : 'm'});"
      >
        {@render children()}
      </span>
    {/if}
    {#if trailing}
      {@render trailing()}
    {/if}
  </button>
{/if}
