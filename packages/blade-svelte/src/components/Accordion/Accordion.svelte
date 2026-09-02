<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    getStyledPropsClasses,
    makeAnalyticsAttribute,
    cx,
    logger,
  } from '@razorpay/blade-core/utils';
  import {
    getAccordionWrapperClasses,
    getAccordionTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { setAccordionContext } from './context';
  import { resolveComponentStyleOverride } from '../../utils/resolveComponentStyleOverride';
  import { getBladeThemeContextGetter } from '../BladeProvider/bladeThemeContext';
  import type { AccordionProps } from './types';

  const templateClasses = getAccordionTemplateClasses();
  const themeContextGetter = getBladeThemeContextGetter();

  let {
    children,
    defaultExpandedIndex,
    expandedIndex: controlledExpandedIndex,
    onExpandChange,
    showNumberPrefix = false,
    variant = 'transparent',
    size = 'large',
    maxWidth,
    minWidth,
    hasGrayBody = false,
    testID,
    styleOverride,
    ...rest
  }: AccordionProps = $props();

  const mergedStyleOverride = $derived(
    resolveComponentStyleOverride('Accordion', styleOverride, themeContextGetter),
  );

  const resolvedStyleOverride = $derived(
    variant === 'filled' ? undefined : mergedStyleOverride,
  );

  $effect(() => {
    if (
      variant === 'filled' &&
      mergedStyleOverride &&
      Object.keys(mergedStyleOverride).length > 0
    ) {
      logger({
        message:
          'styleOverride is ignored when variant="filled". Use variant="transparent" for slot overrides.',
        type: 'warn',
        moduleName: 'Accordion',
      });
    }
  });

  let internalExpandedIndex = $state<number | undefined>(defaultExpandedIndex);

  // Registration counter — plain JS, not reactive
  let _itemCounter = 0;
  let _numberOfItems = $state(0);

  // Reset counter before each render cycle
  $effect.pre(() => {
    // This runs before children render
    _itemCounter = 0;
  });

  const registerItem = (): number => {
    const idx = _itemCounter;
    _itemCounter++;
    _numberOfItems = _itemCounter;
    return idx;
  };

  const currentExpandedIndex = $derived(
    controlledExpandedIndex !== undefined ? controlledExpandedIndex : internalExpandedIndex,
  );

  const handleExpandChange = (nextExpandedIndex: number) => {
    if (controlledExpandedIndex !== undefined) {
      onExpandChange?.({ expandedIndex: nextExpandedIndex });
    } else {
      internalExpandedIndex = nextExpandedIndex;
      onExpandChange?.({ expandedIndex: nextExpandedIndex });
    }
  };

  setAccordionContext(() => ({
    expandedIndex: currentExpandedIndex,
    defaultExpandedIndex,
    onExpandChange: handleExpandChange,
    showNumberPrefix,
    variant,
    numberOfItems: _numberOfItems,
    size,
    registerItem,
    hasGrayBody,
    styleOverride: resolvedStyleOverride,
  }));

  const wrapperClass = $derived(getAccordionWrapperClasses({ variant }));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const outerClasses = $derived(
    cx(templateClasses.accordionOuter, ...(styledProps.classes || []), resolvedStyleOverride?.root),
  );

  const outerStyle = $derived.by(() => {
    const parts: string[] = [];
    if (minWidth) parts.push(`min-width: ${minWidth}`);
    if (maxWidth) parts.push(`max-width: ${maxWidth}`);
    return parts.length > 0 ? parts.join('; ') : undefined;
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.Accordion, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={outerClasses}
  style={outerStyle}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={wrapperClass}>
    {@render children()}
  </div>
</div>
