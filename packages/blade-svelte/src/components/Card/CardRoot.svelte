<script lang="ts">
  import type { Snippet } from 'svelte';
  import { makeAccessible, metaAttribute, MetaConstants, getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { cardRootStyles } from '@razorpay/blade-core/styles';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import type { StyledPropsBlade } from '@razorpay/blade-core/utils';

  let {
    children,
    as,
    borderRadius = 'medium',
    shouldScaleOnHover = false,
    isSelected = false,
    isFocused = false,
    validationState = 'none',
    accessibilityLabel,
    onHover,
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    cursor,
    testID,
    ...rest
  }: {
    children: Snippet;
    as?: 'label';
    borderRadius?: 'medium' | 'large' | 'xlarge';
    shouldScaleOnHover?: boolean;
    isSelected?: boolean;
    isFocused?: boolean;
    validationState?: 'none' | 'error' | 'success';
    accessibilityLabel?: string;
    onHover?: () => void;
    width?: string;
    height?: string;
    minHeight?: string;
    minWidth?: string;
    maxWidth?: string;
    cursor?: string;
    testID?: string;
  } & StyledPropsBlade = $props();

  let isPressed = $state(false);

  const rootClasses = $derived(
    cardRootStyles({
      borderRadius,
      shouldScaleOnHover,
      isPressed: shouldScaleOnHover ? isPressed : false,
      asLabel: as === 'label',
    })
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(() => {
    const classes = [rootClasses];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.Card, testID }));

  const a11yAttrs = $derived(
    makeAccessible({
      label: as === 'label' ? accessibilityLabel : undefined,
    })
  );

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Data attributes for CSS-driven states
  const dataSelected = $derived(isSelected ? 'true' : undefined);
  const dataFocused = $derived(isFocused ? 'true' : undefined);
  const dataValidation = $derived(
    validationState && validationState !== 'none' ? validationState : undefined
  );

  // Compute cursor style
  const cursorValue = $derived(
    cursor ? cursor : as === 'label' ? 'pointer' : 'initial'
  );

  function handleMouseEnter(): void {
    onHover?.();
  }

  function handleMouseDown(): void {
    if (shouldScaleOnHover) {
      isPressed = true;
    }
  }

  function handleMouseUp(): void {
    if (shouldScaleOnHover) {
      isPressed = false;
    }
  }

  function handleTouchStart(): void {
    if (shouldScaleOnHover) {
      isPressed = true;
    }
  }

  function handleTouchEnd(): void {
    if (shouldScaleOnHover) {
      isPressed = false;
    }
  }
</script>

<svelte:element
  this={as === 'label' ? 'label' : 'div'}
  class={combinedClasses()}
  data-selected={dataSelected}
  data-focused={dataFocused}
  data-validation={dataValidation}
  style:width={width}
  style:height={height}
  style:min-height={minHeight}
  style:min-width={minWidth}
  style:max-width={maxWidth}
  style:cursor={cursorValue}
  {...metaAttrs}
  {...a11yAttrs}
  {...analyticsAttrs}
  onmouseenter={handleMouseEnter}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  ontouchstart={handleTouchStart}
  ontouchend={handleTouchEnd}
>
  {@render children()}
</svelte:element>
