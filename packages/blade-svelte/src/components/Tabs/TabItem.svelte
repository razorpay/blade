<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getTabsTemplateClasses } from '@razorpay/blade-core/styles';
  import { getTabsContext } from './context';
  import type { TabItemProps } from './types';
  import type { IconSize } from '../Icons/types';

  const classes = getTabsTemplateClasses();

  const iconSizeMap: Record<string, IconSize> = {
    small: 'medium',
    medium: 'medium',
    large: 'large',
  };

  const paddingClassMap: Record<string, Record<string, Record<string, string>>> = {
    bordered: {
      Horiz: { small: classes.tabBorderedHorizSmall, medium: classes.tabBorderedHorizMedium, large: classes.tabBorderedHorizLarge },
      Vert: { small: classes.tabBorderedVertSmall, medium: classes.tabBorderedVertMedium, large: classes.tabBorderedVertLarge },
    },
    filled: {
      Horiz: { small: classes.tabFilledHorizSmall, medium: classes.tabFilledHorizMedium, large: classes.tabFilledHorizLarge },
      Vert: { small: classes.tabFilledVertSmall, medium: classes.tabFilledVertMedium, large: classes.tabFilledVertLarge },
    },
  };

  let {
    children,
    value,
    leading,
    trailing,
    accessibilityLabel,
    isDisabled = false,
    href,
    onClick,
    testID,
    ...rest
  }: TabItemProps = $props();

  const getCtx = getTabsContext();
  const ctx = $derived(getCtx());

  $effect.pre(() => {
    getCtx().registerTabItem(value);
  });

  const isSelected = $derived(ctx.selectedValue === value);
  const isFocused = $derived(ctx.focusedValue === value);
  const isFilled = $derived(ctx.variant === 'filled');
  const isBordered = $derived(ctx.variant === 'bordered' || ctx.variant === 'borderless');
  const normalizedVariant = $derived(ctx.variant === 'borderless' ? 'bordered' : ctx.variant);

  const panelId = $derived(`${ctx.baseId}-${value}-tabpanel`);
  const tabItemId = $derived(`${ctx.baseId}-${value}-tabitem`);

  const handleClick = (event: MouseEvent) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    ctx.setSelectedValue(value);
    onClick?.(event);
  };

  const textClasses = $derived(
    [
      classes.tabItemText,
      isSelected ? classes.tabItemTextSelected : '',
      ctx.size === 'large' ? classes.tabItemTextLarge : classes.tabItemTextMedium,
    ].filter(Boolean).join(' '),
  );

  const iconClasses = $derived(
    [
      classes.tabItemIcon,
      isSelected ? classes.tabItemIconSelected : '',
    ].filter(Boolean).join(' '),
  );

  const iconSize = $derived(iconSizeMap[ctx.size]);

  const buttonClasses = $derived.by(() => {
    const result: string[] = [classes.tabButton];

    result.push(ctx.isVertical ? classes.tabButtonVertical : classes.tabButtonHorizontal);

    if (ctx.isFullWidthTabItem || isFilled) {
      result.push(classes.tabButtonFullWidth);
    }

    const orientationKey = ctx.isVertical ? 'Vert' : 'Horiz';
    const paddingClass = paddingClassMap[normalizedVariant]?.[orientationKey]?.[ctx.size];
    if (paddingClass) {
      result.push(paddingClass);
    }

    if (isBordered) {
      result.push(
        ctx.isVertical ? classes.tabBorderedBorderLeft : classes.tabBorderedBorderBottom,
      );
    }

    if (isFilled) {
      if (ctx.size === 'small' && !ctx.isVertical) {
        result.push(classes.tabRadiusMedium);
      } else {
        result.push(classes.tabRadiusSmall);
      }
    } else {
      result.push(classes.tabRadiusNone);
    }

    if (isFilled && isSelected && ctx.isVertical) {
      result.push(classes.tabBgFilledSelectedVertical);
    } else {
      result.push(classes.tabBgTransparent);
    }

    if (isFilled && !isSelected) {
      result.push(classes.tabFilledUnselected);
    }

    if (isFilled && !ctx.isVertical) {
      result.push(classes.tabStackingContext);
    }

    if (isFilled) {
      if (ctx.size === 'small' && !ctx.isVertical) {
        result.push(classes.tabFocusRadiusMedium);
      } else {
        result.push(classes.tabFocusRadiusSmall);
      }
    } else {
      result.push(classes.tabFocusRadiusMedium);
    }

    if (isSelected) {
      result.push(classes.tabSelected);
    }

    if (href && isDisabled) {
      result.push(classes.tabDisabledLink);
    }

    return result.filter(Boolean).join(' ');
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.TabItem, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#snippet tabItemContent()}
  {#if leading}
    {@const Leading = leading}
    <span class={iconClasses}>
      <Leading size={iconSize} color="currentColor" />
    </span>
  {/if}
  {#if children}
    <span class={textClasses}>
      {@render children()}
    </span>
  {/if}
  {#if trailing}
    {@render trailing()}
  {/if}
{/snippet}

<!-- svelte-ignore a11y_role_supports_aria_props -->
{#if href}
  <a
    href={isDisabled ? undefined : href}
    id={tabItemId}
    class={buttonClasses}
    role="tab"
    aria-selected={isSelected}
    aria-controls={panelId}
    tabindex={isSelected || isFocused ? 0 : -1}
    aria-disabled={isDisabled}
    aria-label={accessibilityLabel}
    data-blade-tab-value={value}
    onclick={handleClick}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render tabItemContent()}
  </a>
{:else}
  <button
    type="button"
    id={tabItemId}
    class={buttonClasses}
    role="tab"
    aria-selected={isSelected}
    aria-controls={panelId}
    tabindex={isSelected || isFocused ? 0 : -1}
    disabled={isDisabled}
    aria-label={accessibilityLabel}
    data-blade-tab-value={value}
    onclick={handleClick}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render tabItemContent()}
  </button>
{/if}
