<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import { setCollapsibleContext } from './context';
  import type { CollapsibleProps } from './types';

  let {
    children,
    direction = 'bottom',
    defaultIsExpanded = false,
    isExpanded: controlledIsExpanded,
    onExpandChange,
    testID,
    _shouldApplyWidthRestrictions = true,
    ...rest
  }: CollapsibleProps = $props();

  const collapsibleBodyUid = $props.id();
  const collapsibleBodyId = `${collapsibleBodyUid}-body`;

  // Mirror React: keep the initial value of (defaultIsExpanded || isExpanded)
  // so later changes don't affect the body's initial height calculation.
  const getInitialDefaultExpanded = () => Boolean(defaultIsExpanded || controlledIsExpanded);
  const getInitialExpanded = () => controlledIsExpanded ?? defaultIsExpanded;
  const initialDefaultExpanded = getInitialDefaultExpanded();

  let internalIsExpanded = $state<boolean>(getInitialExpanded());

  const currentIsExpanded = $derived(
    controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded,
  );

  const handleExpandChange = (next: boolean) => {
    if (controlledIsExpanded !== undefined) {
      // controlled
      onExpandChange?.({ isExpanded: next });
    } else {
      // uncontrolled
      internalIsExpanded = next;
      onExpandChange?.({ isExpanded: next });
    }
  };

  setCollapsibleContext(() => ({
    isExpanded: currentIsExpanded,
    defaultIsExpanded: initialDefaultExpanded,
    onExpandChange: handleExpandChange,
    direction,
    collapsibleBodyId,
  }));

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Collapsible, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const rootClass = $derived((styledProps.classes ?? []).filter(Boolean).join(' '));

  // Width restrictions mirror React: min-width spacing.200, responsive max-width.
  const MIN_WIDTH = 'var(--spacing-2)';
  const MAX_WIDTH = 'min(calc(100vw - var(--spacing-10)), 1136px)';

  const innerStyle = $derived(
    [
      'display: flex',
      `flex-direction: ${direction === 'bottom' ? 'column' : 'column-reverse'}`,
      'align-items: flex-start',
      `min-width: ${_shouldApplyWidthRestrictions ? MIN_WIDTH : '0px'}`,
      `max-width: ${_shouldApplyWidthRestrictions ? MAX_WIDTH : 'none'}`,
    ].join('; '),
  );
</script>

<div class={rootClass} {...metaAttrs} {...analyticsAttrs}>
  <div style={innerStyle}>
    {@render children()}
  </div>
</div>
