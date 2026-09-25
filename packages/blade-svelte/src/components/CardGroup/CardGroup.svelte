<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getCardGroupSurfaceClasses,
    getCardGroupTemplateClasses,
    getCardSurfaceClasses,
  } from '@razorpay/blade-core/styles';
  import { setCardGroupContext } from './cardGroupContext';
  import type { CardGroupProps } from './types';

  const templateClasses = getCardGroupTemplateClasses();
  // Same elevated treatment as <Card variant="primary">; padding is zero so
  // rows run edge to edge and the group's own overflow clip rounds them.
  const surfaceClass = [
    getCardSurfaceClasses({ type: 'primary', padding: 'spacing.0', borderRadius: 'medium' }),
    getCardGroupSurfaceClasses(),
  ].join(' ');

  let { children, accessibilityLabel, testID, ...rest }: CardGroupProps = $props();

  setCardGroupContext(() => ({ isInsideCardGroup: true }));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const rootClass = $derived(
    [surfaceClass, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.CardGroup, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const a11yAttrs = $derived(makeAccessible({ role: 'group', label: accessibilityLabel }));
</script>

<div class={rootClass} {...a11yAttrs} {...metaAttrs} {...analyticsAttrs}>
  <div class={templateClasses.cardGroupBody}>
    {@render children()}
  </div>
</div>
