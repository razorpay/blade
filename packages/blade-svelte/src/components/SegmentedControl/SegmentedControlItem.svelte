<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getSegmentedControlTemplateClasses } from '@razorpay/blade-core/styles';
  import { getSegmentedControlContext } from './context';
  import type { SegmentedControlItemProps } from './types';

  const classes = getSegmentedControlTemplateClasses();

  let {
    value,
    children,
    leading: Leading,
    isDisabled: isItemDisabled = false,
    accessibilityLabel,
    testID,
    ...rest
  }: SegmentedControlItemProps = $props();

  const getCtx = getSegmentedControlContext();
  const ctx = $derived(getCtx());

  let buttonEl = $state<HTMLButtonElement | undefined>(undefined);

  const isSelected = $derived(ctx.selectedValue === value);
  const isDisabled = $derived(ctx.isDisabled || isItemDisabled);

  const shouldReceiveFocus = $derived(
    isSelected ||
      (ctx.selectedValue === undefined && !isDisabled && value === ctx.firstEnabledValue),
  );

  $effect(() => {
    if (!buttonEl) return;
    const cleanup = ctx.registerItem(value, buttonEl);
    return cleanup;
  });

  const handleClick = () => {
    if (isDisabled) return;
    ctx.setSelectedValue(value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();

      // Build ordered list of enabled items by traversing container children
      const container = buttonEl?.closest('[role="radiogroup"]');
      if (!container) return;
      const allButtons = Array.from(
        container.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
      );
      const currentIndex = allButtons.findIndex((el) => el === buttonEl);
      if (currentIndex === -1) return;

      let nextIndex: number;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % allButtons.length;
      } else {
        nextIndex = (currentIndex - 1 + allButtons.length) % allButtons.length;
      }

      allButtons[nextIndex].focus();
      allButtons[nextIndex].click();
    }
  };

  const iconSizeMap: Record<string, string> = {
    small: 'medium',
    medium: 'medium',
    large: 'large',
  };

  const textSizeClass = $derived(
    ctx.size === 'large' ? classes.itemTextSizeLarge : classes.itemTextSizeMedium,
  );

  const textColorClass = $derived(
    isDisabled
      ? classes.itemTextDisabled
      : isSelected
        ? classes.itemTextNormal
        : classes.itemTextMuted,
  );

  const iconColor = $derived(
    isDisabled
      ? 'interactive.icon.gray.disabled'
      : isSelected
        ? 'interactive.icon.gray.normal'
        : 'interactive.icon.gray.muted',
  );

  const itemSizeClass = $derived(() => {
    if (ctx.size === 'small') return classes.itemSizeSmall;
    if (ctx.size === 'large') return classes.itemSizeLarge;
    return classes.itemSizeMedium;
  });

  const buttonClasses = $derived(
    [
      classes.item,
      isSelected ? classes.itemSelected : '',
      itemSizeClass(),
    ]
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.SegmentedControlItem, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(
    makeAccessible({
      role: 'radio',
      checked: isSelected,
      label: accessibilityLabel,
      setSize: ctx.totalItems,
    }),
  );
</script>

<button
  bind:this={buttonEl}
  type="button"
  id="{ctx.baseId}-{value}-item"
  data-value={value}
  tabindex={shouldReceiveFocus ? 0 : -1}
  class={buttonClasses}
  disabled={isDisabled}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  {...a11yAttrs}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {#if Leading}
    {@const LeadingIcon = Leading as any}
    <LeadingIcon size={iconSizeMap[ctx.size]} color={iconColor} />
  {/if}
  {#if children}
    <span class={[classes.itemText, textSizeClass, textColorClass].filter(Boolean).join(' ')}>
      {@render children()}
    </span>
  {/if}
</button>
