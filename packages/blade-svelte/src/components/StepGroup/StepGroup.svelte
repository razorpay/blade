<script lang="ts">
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { stepGroupStyles, nestedStepGroupClass } from '@razorpay/blade-core/styles';
  import {
    setStepRootContext,
    setStepLocalContext,
    getStepRootContext,
    getStepLocalContext,
  } from './context';
  import type { StepGroupProps } from './types';

  let {
    size = 'medium',
    orientation = 'vertical',
    children,
    width,
    minWidth,
    maxWidth,
    testID,
    ...rest
  }: StepGroupProps = $props();

  // Determine if this is the root StepGroup (no parent root context)
  const existingRootCtx = getStepRootContext();
  const isRoot = !existingRootCtx;

  // Determine nestingLevel from parent local context
  let nestingLevel = 0;
  if (!isRoot) {
    const parentLocalCtx = getStepLocalContext();
    if (parentLocalCtx) {
      nestingLevel = parentLocalCtx().nestingLevel + 1;
    }
  }

  // Root context: manages total index across all nested groups
  let _totalCounter = 0;
  let _totalCount = $state(0);

  $effect.pre(() => {
    _totalCounter = 0;
  });

  const registerTotal = (): number => {
    const idx = _totalCounter;
    _totalCounter++;
    _totalCount = _totalCounter;
    return idx;
  };

  if (isRoot) {
    setStepRootContext(() => ({
      size,
      orientation,
      registerTotal,
      getTotalCount: () => _totalCount,
    }));
  }

  // Local context: manages index within this group
  let _localCounter = 0;
  let _localCount = $state(0);

  $effect.pre(() => {
    _localCounter = 0;
  });

  const registerLocal = (): number => {
    const idx = _localCounter;
    _localCounter++;
    _localCount = _localCounter;
    return idx;
  };

  setStepLocalContext(() => ({
    nestingLevel,
    registerLocal,
    getLocalCount: () => _localCount,
  }));

  const containerClass = $derived(
    isRoot
      ? stepGroupStyles({ size, orientation })
      : `${stepGroupStyles({})} ${nestedStepGroupClass}`,
  );

  const containerStyle = $derived.by(() => {
    const parts: string[] = [];
    if (width) parts.push(`width: ${width}`);
    if (minWidth) parts.push(`min-width: ${minWidth}`);
    parts.push(`max-width: ${maxWidth ?? '100%'}`);
    return parts.join('; ');
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.StepGroup, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={containerClass} style={containerStyle} {...metaAttrs} {...analyticsAttrs}>
  {@render children()}
</div>
