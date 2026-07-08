<script lang="ts">
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getAppBarTemplateClasses } from '@razorpay/blade-core/styles';
  import { useAppBarContext } from './AppBarContext';
  import type { AppBarActionsProps } from './types';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getAppBarTemplateClasses();

  // Verify inside AppBar.
  useAppBarContext('AppBarActions');

  let { children, testID, ...rest }: AppBarActionsProps = $props();

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.AppBarActions, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={templateClasses.appBarActions} {...metaAttrs} {...analyticsAttrs}>
  {@render children()}
</div>
