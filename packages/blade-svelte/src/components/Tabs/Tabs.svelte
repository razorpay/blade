<script module lang="ts">
  let nextTabsUid = 0;
</script>

<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getTabsClasses } from '@razorpay/blade-core/styles';
  import { setTabsContext } from './context';
  import type { TabsProps } from './types';

  const classes = getTabsClasses();

  let {
    children,
    defaultValue,
    value: controlledValue,
    onChange,
    orientation = 'horizontal',
    size = 'medium',
    variant = 'bordered',
    isFullWidthTabItem = false,
    isLazy = false,
    testID,
    ...rest
  }: TabsProps = $props();

  nextTabsUid += 1;
  const baseId = `tabs-${nextTabsUid}`;

  let internalValue = $state<string>(defaultValue ?? '');

  const selectedValue = $derived(
    controlledValue !== undefined ? controlledValue : internalValue,
  );

  const isVertical = $derived(orientation === 'vertical');

  const setSelectedValue = (newValue: string, skipOnChange?: boolean) => {
    if (controlledValue !== undefined) {
      if (!skipOnChange) {
        onChange?.(newValue);
      }
    } else {
      internalValue = newValue;
      if (!skipOnChange) {
        onChange?.(newValue);
      }
    }
  };

  const registerTabItem = (value: string) => {
    if (!selectedValue) {
      setSelectedValue(value, true);
    }
  };

  setTabsContext(() => ({
    baseId,
    selectedValue,
    setSelectedValue,
    registerTabItem,
    isVertical,
    size,
    variant,
    isFullWidthTabItem,
    isLazy,
  }));

  const wrapperClasses = $derived(
    [classes.tabsWrapper, isVertical ? classes.tabsVertical : classes.tabsHorizontal]
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.Tabs, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={wrapperClasses}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {@render children()}
</div>
