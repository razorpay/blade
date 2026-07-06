<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import { getCollapsibleInnerClasses } from '@razorpay/blade-core/styles';
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
    // Accepted for API parity with React. Svelte renders children as opaque
    // snippets, so the allowed-children check React performs cannot be mirrored
    // here. The flag lets callers (e.g. AccordionItem) document that an
    // arbitrary trigger is intentional.
    _dangerouslyDisableValidations = false,
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

  const innerClass = $derived(
    getCollapsibleInnerClasses({
      direction,
      shouldApplyWidthRestrictions: _shouldApplyWidthRestrictions,
    }),
  );
</script>

<div class={rootClass} {...metaAttrs} {...analyticsAttrs}>
  <div class={innerClass}>
    {@render children()}
  </div>
</div>
