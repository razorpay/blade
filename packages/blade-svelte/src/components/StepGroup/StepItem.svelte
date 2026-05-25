<script lang="ts">
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import {
    stepItemStyles,
    interactiveHeaderStyles,
    stepItemContentClass,
    stepItemChildrenClass,
    headerRowClass,
    staticHeaderClass,
  } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import type { TextColors } from '../Typography/BaseText/types';
  import StepLine from './StepLine.svelte';
  import { getStepRootContext, getStepLocalContext } from './context';
  import type { StepItemProps } from './types';

  let {
    title,
    titleColor,
    timestamp,
    description,
    stepProgress = 'none',
    marker,
    trailing,
    isSelected = false,
    isDisabled = false,
    href,
    target,
    onClick,
    children,
    minWidth,
    ...rest
  }: StepItemProps = $props();

  // Get contexts
  const getRootCtx = getStepRootContext();
  const getLocalCtx = getStepLocalContext();

  // Register this item with both root (total) and local (within-group) counters
  // These calls run once at initialization, in DOM order (depth-first)
  const totalIndex: number = getRootCtx ? getRootCtx().registerTotal() : 0;
  const localIndex: number = getLocalCtx().registerLocal();

  // Reactive values from contexts
  const size = $derived(getRootCtx ? getRootCtx().size : 'medium');
  const orientation = $derived(getRootCtx ? getRootCtx().orientation : 'vertical');
  const totalCount = $derived(getRootCtx ? getRootCtx().getTotalCount() : 1);
  const localCount = $derived(getLocalCtx().getLocalCount());
  const nestingLevel = $derived(getLocalCtx().nestingLevel);

  // Compute step type for the line indicator
  type StepType = 'single-item' | 'start' | 'middle' | 'end' | 'default';
  const stepType = $derived.by((): StepType => {
    if (nestingLevel === 0) return 'default';
    if (localCount === 1) return 'single-item';
    if (localIndex === 0) return 'start';
    if (localIndex === localCount - 1) return 'end';
    return 'middle';
  });

  const isFirstItem = $derived(totalIndex === 0);
  const isLastItem = $derived(totalIndex === totalCount - 1);
  const isInteractive = $derived(Boolean(href) || Boolean(onClick));
  const isNested = $derived(nestingLevel > 0);

  // Title color logic — maps to Text component color tokens
  const titleColorValue = $derived(
    (isDisabled
      ? 'surface.text.gray.disabled'
      : isSelected
        ? 'surface.text.primary.normal'
        : (titleColor ?? 'surface.text.gray.subtle')) as TextColors,
  );

  // Title size based on group size
  const titleSize = $derived(size === 'large' ? 'large' : 'medium') as 'large' | 'medium';
  // Subtitle size (timestamp, description)
  const subtitleSize = $derived(size === 'large' ? 'medium' : 'small') as 'medium' | 'small';

  // Title weight: top-level items use medium, nested use regular
  const titleWeight = $derived(isNested ? 'regular' : 'medium') as 'regular' | 'medium';

  // Subtitle/timestamp color
  const subtitleColor = $derived(
    (isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted') as TextColors,
  );

  const itemClass = $derived(stepItemStyles({ orientation }));
  const headerBtnClass = $derived(interactiveHeaderStyles({ isSelected }));

  const metaAttrs = metaAttribute({ name: MetaConstants.StepItem });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={itemClass} {...metaAttrs} {...analyticsAttrs}>
  <!-- Step line with marker -->
  <StepLine
    {stepType}
    shouldShowStartBranch={!isFirstItem}
    shouldShowEndBranch={!isLastItem}
    {marker}
    {stepProgress}
    {orientation}
    {size}
  />

  <!-- Content area -->
  <div class={stepItemContentClass}>
    {#if isInteractive}
      <!-- Interactive header: button or anchor -->
      <svelte:element
        this={href ? 'a' : 'button'}
        class={headerBtnClass}
        {href}
        {target}
        disabled={isDisabled || undefined}
        onclick={onClick}
      >
        <!-- Header content -->
        <div class={headerRowClass}>
          <div>
            <Text
              as="span"
              size={titleSize}
              weight={titleWeight}
              color={titleColorValue}
            >
              {title}
            </Text>
            {#if timestamp}
              <Text
                as="p"
                variant="caption"
                size={subtitleSize}
                color={subtitleColor}
              >
                {timestamp}
              </Text>
            {/if}
            {#if description}
              <Text
                as="p"
                size={subtitleSize}
                color={subtitleColor}
              >
                {description}
              </Text>
            {/if}
          </div>
          {#if trailing}
            <div>{@render trailing()}</div>
          {/if}
        </div>
      </svelte:element>
    {:else}
      <!-- Static header -->
      <div class={staticHeaderClass}>
        <div class={headerRowClass}>
          <div>
            <Text
              as="span"
              size={titleSize}
              weight={titleWeight}
              color={titleColorValue}
            >
              {title}
            </Text>
            {#if timestamp}
              <Text
                as="p"
                variant="caption"
                size={subtitleSize}
                color={subtitleColor}
              >
                {timestamp}
              </Text>
            {/if}
            {#if description}
              <Text
                as="p"
                size={subtitleSize}
                color={subtitleColor}
              >
                {description}
              </Text>
            {/if}
          </div>
          {#if trailing}
            <div>{@render trailing()}</div>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Additional children content -->
    {#if children}
      <div class={stepItemChildrenClass}>
        {@render children()}
      </div>
    {/if}
  </div>
</div>
