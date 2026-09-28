<script lang="ts">
  import { metaAttribute, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { baseFooterInnerClass, getDropdownTemplateClasses } from '@razorpay/blade-core/styles';
  import Divider from '../Divider/Divider.svelte';
  import type { BaseFooterProps } from './types';

  // Prevent tree-shaking of template classes used in compound selectors.
  void getDropdownTemplateClasses();

  let {
    children,
    showDivider = true,
    metaComponentName,
    testID,
    ...rest
  }: BaseFooterProps = $props();

  const metaAttrs = $derived(metaAttribute({ name: metaComponentName, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#if showDivider}
  <Divider />
{/if}
<div class={baseFooterInnerClass} {...metaAttrs} {...analyticsAttrs}>
  {@render children?.()}
</div>
