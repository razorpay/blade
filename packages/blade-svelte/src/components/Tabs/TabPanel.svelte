<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import { getTabsTemplateClasses } from '@razorpay/blade-core/styles';
  import { getTabsContext } from './context';
  import type { TabPanelProps } from './types';

  const classes = getTabsTemplateClasses();

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
  <!-- When isLazy=true, inactive panels are destroyed and recreated on re-selection.
       Any internal state (scroll position, form values, focus) is lost each time the
       user switches away and back. This matches React's isLazy behavior. -->
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
    tabindex={isSelected ? 0 : -1}
    role="tabpanel"
    aria-labelledby={tabItemId}
    aria-hidden={!isSelected}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    {@render children()}
  </div>
{/if}
