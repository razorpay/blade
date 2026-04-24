<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    getAccordionButtonClasses,
    getAccordionButtonBorderClasses,
    getAccordionTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { ChevronDownIcon } from '../Icons/ChevronDownIcon';
  import Divider from '../Divider/Divider.svelte';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import { getAccordionContext, getAccordionItemContext } from './context';
  import type { AccordionItemHeaderProps } from './types';

  const templateClasses = getAccordionTemplateClasses();

  let {
    title,
    subtitle,
    leading,
    children,
    trailing,
    titleSuffix,
    ...rest
  }: AccordionItemHeaderProps = $props();

  const getAccCtx = getAccordionContext();
  const getItemCtx = getAccordionItemContext();

  const accordionCtx = $derived(getAccCtx());
  const itemCtx = $derived(getItemCtx());

  const isExpanded = $derived(itemCtx.isExpanded);
  const isDisabled = $derived(itemCtx.isDisabled);
  const index = $derived(itemCtx.index);
  const collapsibleBodyId = $derived(itemCtx.collapsibleBodyId);

  const variant = $derived(accordionCtx.variant);
  const numberOfItems = $derived(accordionCtx.numberOfItems);
  const accordionSize = $derived(accordionCtx.size);
  const showNumberPrefix = $derived(accordionCtx.showNumberPrefix);

  const isFirstItem = $derived(index === 0);
  const isLastItem = $derived(index === numberOfItems - 1);

  const hasLeading = $derived(!!leading);
  const hasChildren = $derived(!!children);

  const isLeadingNumberOrIcon = $derived.by(() => {
    if (showNumberPrefix && typeof index === 'number') return true;
    return false;
  });

  const shouldAlignCenter = $derived(
    !subtitle && !isLeadingNumberOrIcon && !hasChildren,
  );

  const headerContentClass = $derived(
    [
      templateClasses.headerContent,
      accordionSize === 'medium' ? templateClasses.headerContentMedium : '',
      shouldAlignCenter ? templateClasses.headerContentCentered : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  const leadingSizeClass = $derived(
    accordionSize === 'large'
      ? templateClasses.headerLeadingLarge
      : templateClasses.headerLeadingMedium,
  );

  const titleFontSize = $derived(accordionSize === 'large' ? 200 : 100);
  const titleLineHeight = $derived(accordionSize === 'large' ? 200 : 100);
  const subtitleFontSize = 75 as const;
  const subtitleLineHeight = 75 as const;

  const chevronColor = $derived.by(() => {
    if (isDisabled) return 'interactive.icon.gray.disabled' as const;
    return 'interactive.icon.gray.muted' as const;
  });

  const chevronClass = $derived(
    [
      templateClasses.headerChevron,
      isExpanded ? templateClasses.chevronExpanded : '',
    ]
      .filter(Boolean)
      .join(' '),
  );

  // Button classes
  const buttonClass = $derived(
    getAccordionButtonClasses({ isExpanded, isDisabled }),
  );
  const borderClass = $derived(
    getAccordionButtonBorderClasses({ variant, isFirstItem, isLastItem, isExpanded }),
  );
  const combinedButtonClass = $derived(
    [buttonClass, borderClass].filter(Boolean).join(' '),
  );

  const onClick = () => {
    if (!isDisabled) {
      itemCtx.toggle();
    }
  };

  const headingA11y = makeAccessible({ role: 'heading', level: 3 });
  const buttonA11y = $derived(
    makeAccessible({ expanded: isExpanded, controls: collapsibleBodyId }),
  );
  const metaAttrs = metaAttribute({ name: MetaConstants.AccordionItemHeader });
  const buttonMetaAttrs = metaAttribute({ name: MetaConstants.AccordionButton });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div {...headingA11y} style="width: 100%;">
  <button
    type="button"
    class={combinedButtonClass}
    disabled={isDisabled || undefined}
    onclick={onClick}
    {...buttonA11y}
    {...buttonMetaAttrs}
    {...analyticsAttrs}
    data-analytics-name="accordion-item-button"
  >
    <div class={templateClasses.headerContainer} {...metaAttrs}>
      <div class={headerContentClass}>
        {#if showNumberPrefix && typeof index === 'number'}
          <div class="{templateClasses.headerLeading} {templateClasses.headerLeadingIcon}">
            <BaseText
              as="span"
              fontSize={titleFontSize}
              lineHeight={titleLineHeight}
              fontFamily="text"
              fontWeight="semibold"
              color="surface.text.gray.normal"
            >
              {index + 1}.
            </BaseText>
          </div>
        {:else if hasLeading}
          {@const isIcon = !hasChildren && !subtitle}
          <div
            class="{templateClasses.headerLeading} {leadingSizeClass} {isIcon
              ? templateClasses.headerLeadingIcon
              : templateClasses.headerLeadingSlot}"
          >
            {@render (leading as Snippet)()}
          </div>
        {/if}

        {#if hasChildren}
          <div class={templateClasses.headerMain}>
            {@render (children as Snippet)()}
          </div>
        {:else}
          <div class={templateClasses.headerMain}>
            <div class={templateClasses.headerTitleRow}>
              {#if title}
                <span class={templateClasses.headerTitleText}>
                  <BaseText
                    as="span"
                    fontSize={titleFontSize}
                    lineHeight={titleLineHeight}
                    fontFamily="text"
                    fontWeight="semibold"
                    color="surface.text.gray.normal"
                  >
                    {title}
                  </BaseText>
                </span>
              {/if}
              {#if titleSuffix}
                {@render titleSuffix()}
              {/if}
            </div>
            {#if subtitle}
              <BaseText
                as="span"
                fontSize={subtitleFontSize}
                lineHeight={subtitleLineHeight}
                fontFamily="text"
                fontWeight="regular"
                color="surface.text.gray.muted"
              >
                {subtitle}
              </BaseText>
            {/if}
          </div>
        {/if}

        {#if trailing}
          <div class={templateClasses.headerTrailing}>
            {@render trailing()}
          </div>
        {/if}

        <div class={chevronClass}>
          <ChevronDownIcon size="large" color={chevronColor} />
        </div>
      </div>

      {#if isExpanded}
        <div class={templateClasses.headerDivider}>
          <Divider thickness="thinner" />
        </div>
      {/if}
    </div>
  </button>
</div>
