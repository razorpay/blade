<script lang="ts">
  import { MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import BaseHeader from '../BaseHeaderFooter/BaseHeader.svelte';
  import { getDropdownContext } from './dropdownContext';
  import type { DropdownHeaderProps } from './types';

  let {
    title,
    subtitle,
    leading,
    trailing,
    titleSuffix,
    children,
    testID,
    ...rest
  }: DropdownHeaderProps = $props();

  const dropdown = getDropdownContext();

  // Keep focus off the (static) header on mousedown, except when an AutoComplete
  // lives in the header (mirrors React DropdownHeader `onMouseDown`).
  function handleMouseDown(event: MouseEvent): void {
    if (!dropdown?.hasAutoCompleteInHeader) {
      event.preventDefault();
    }
  }

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmousedown={handleMouseDown}>
  <BaseHeader
    {title}
    {subtitle}
    {leading}
    {trailing}
    {titleSuffix}
    {children}
    metaComponentName={MetaConstants.DropdownHeader}
    {testID}
    showBackButton={false}
    showCloseButton={false}
    {...analyticsAttrs}
  />
</div>
