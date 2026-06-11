<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getTabsClasses } from '@razorpay/blade-core/styles';
  import { getTabsContext } from './context';
  import type { TabPanelProps } from './types';

  const classes = getTabsClasses();

  let {
    children,
    value,
    testID,
    ...rest
  }: TabPanelProps = $props();

  const getCtx = getTabsContext();
  const ctx = $derived(getCtx());

  const isSelected = $derived(ctx.selectedValue === value);
  const panelId = $derived(`${ctx.baseId}-${value}-tabpanel`);
  const tabItemId = $derived(`${ctx.baseId}-${value}-tabitem`);

  const panelClasses = $derived(
    [classes.tabPanel, !isSelected && !ctx.isLazy ? classes.tabPanelHidden : '']
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.TabPanel, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#if ctx.isLazy}
  {#if isSelected}
    <div
      id={panelId}
      class={classes.tabPanel}
      tabindex={0}
      role="tabpanel"
      aria-labelledby={tabItemId}
      {...metaAttrs}
      {...analyticsAttrs}
    >
      {@render children()}
    </div>
  {/if}
{:else}
  <div
    id={panelId}
    class={panelClasses}
    tabindex={0}
    role="tabpanel"
    aria-labelledby={tabItemId}
    aria-hidden={!isSelected}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render children()}
  </div>
{/if}
