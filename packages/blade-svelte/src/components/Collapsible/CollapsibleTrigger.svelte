<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getCollapsibleTriggerClasses,
    getCollapsibleChevronClasses,
    getCollapsibleTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import { getCollapsibleContext } from './context';
  import type { CollapsibleTriggerProps } from './types';
  import type { IconColor, IconSize } from '../Icons/types';

  const templateClasses = getCollapsibleTemplateClasses();

  let { label, icon: Icon, children, testID, ...rest }: CollapsibleTriggerProps = $props();

  const getCtx = getCollapsibleContext();

  if (!getCtx) {
    throw new Error(
      '[blade-svelte] CollapsibleTrigger must be used inside a <Collapsible> component.',
    );
  }

  const ctx = $derived(getCtx());

  const isExpanded = $derived(ctx.isExpanded);
  const isDisabled = $derived(ctx.isDisabled);
  const collapsibleBodyId = $derived(ctx.collapsibleBodyId);
  const size = $derived(ctx.size);

  const hasCustomChildren = $derived(!!children);

  // Icon size based on Collapsible size — matches AccordionItemHeader leading icon sizes
  const iconSize = $derived<IconSize>(size === 'large' ? 'large' : 'medium');

  // Font size for the label
  const labelFontSize = $derived(size === 'large' ? 200 : 100);
  const labelLineHeight = $derived(size === 'large' ? 200 : 100);

  const chevronColor = $derived<IconColor>(
    isDisabled ? 'interactive.icon.gray.disabled' : 'interactive.icon.gray.muted',
  );

  const triggerClass = $derived(getCollapsibleTriggerClasses({ isDisabled }));
  const chevronClass = $derived(getCollapsibleChevronClasses({ isExpanded }));

  const buttonA11y = $derived(
    makeAccessible({ expanded: isExpanded, controls: collapsibleBodyId }),
  );
  const metaAttrs = metaAttribute({ name: MetaConstants.CollapsibleButton, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const onClick = () => {
    if (!isDisabled) {
      ctx.toggle();
    }
  };
</script>

<button
  type="button"
  class={triggerClass}
  disabled={isDisabled || undefined}
  onclick={onClick}
  {...buttonA11y}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <div class={templateClasses.triggerContent}>
    {#if Icon && !hasCustomChildren}
      <span class={templateClasses.triggerIcon}>
        <Icon size={iconSize} color={isDisabled ? 'interactive.icon.gray.disabled' : 'surface.icon.gray.normal'} />
      </span>
    {/if}

    {#if hasCustomChildren}
      {@render (children as Snippet)()}
    {:else if label}
      <span class={templateClasses.triggerLabel}>
        <BaseText
          as="span"
          fontSize={labelFontSize}
          lineHeight={labelLineHeight}
          fontFamily="text"
          fontWeight="semibold"
          color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.normal'}
        >
          {label}
        </BaseText>
      </span>
    {/if}
  </div>

  <span class={chevronClass}>
    <ChevronDownIcon size="large" color={chevronColor} />
  </span>
</button>
