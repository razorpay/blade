<script module lang="ts">
  let nextTabsUid = 0;
</script>

<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getTabsTemplateClasses } from '@razorpay/blade-core/styles';
  import { setTabsContext } from './context';
  import type { TabsProps } from './types';

  const classes = getTabsTemplateClasses();

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

  const hasExplicitDefault = defaultValue !== undefined;
  let internalValue = $state<string>(defaultValue ?? '');
  let focusedValue = $state<string | null>(null);

  const selectedValue = $derived(
    controlledValue !== undefined ? controlledValue : internalValue,
  );

  const isVertical = $derived(orientation === 'vertical');

  const setFocusedValue = (value: string | null) => {
    focusedValue = value;
  };

  const setSelectedValue = (newValue: string, skipOnChange?: boolean) => {
    if (controlledValue === undefined) {
      internalValue = newValue;
    }
    if (!skipOnChange) {
      onChange?.(newValue);
    }
    focusedValue = null;
  };

  const registerTabItem = (value: string) => {
    if (!hasExplicitDefault && !selectedValue) {
      setSelectedValue(value, true);
    }
  };

  setTabsContext(() => ({
    baseId,
    selectedValue,
    setSelectedValue,
    registerTabItem,
    focusedValue,
    setFocusedValue,
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
