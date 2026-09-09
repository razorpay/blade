<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    breadcrumbListItemClass,
    separatorWrapperClass,
    currentPageWrapperClass,
    getBreadcrumbTextSizes,
    getStepperItemSelectedClasses,
    getStepperItemLinkClasses,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import BaseLink from '../Link/BaseLink/BaseLink.svelte';
  import { ChevronRightIcon } from '../Icons/ChevronRightIcon';
  import type { TextColors } from '../Typography/BaseText/types';
  import type { IconColor } from '../Icons/types';
  import type { BreadcrumbItemProps, BreadcrumbContextValue } from './types';
  import { BREADCRUMB_CONTEXT_KEY } from './constants';

  let {
    href,
    onClick,
    isCurrentPage = false,
    children,
    icon: Icon,
    accessibilityLabel,
    ...rest
  }: BreadcrumbItemProps = $props();

  // Get context from parent Breadcrumb
  const getCtx = getContext<() => BreadcrumbContextValue>(BREADCRUMB_CONTEXT_KEY);

  // Reactive context values
  const size = $derived(getCtx().size);
  const color = $derived(getCtx().color);
  const variant = $derived(getCtx().variant);
  const isStepper = $derived(variant === 'stepper');

  // Text size mapping
  const textSizes = getBreadcrumbTextSizes();
  const fontSize = $derived(textSizes.fontSize[size]);
  const lineHeight = $derived(textSizes.lineHeight[size]);

  // Separator color (used for the "/" in the default variant)
  const separatorColor = $derived<TextColors>(
    color === 'white' ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted',
  );

  // Chevron separator color (stepper variant)
  const chevronColor = $derived<IconColor>(
    color === 'white' ? 'surface.icon.staticWhite.normal' : 'surface.icon.gray.muted',
  );

  // Current page colors — the stepper renders the current page as a filled
  // pill using interactive tokens, the default variant uses surface tokens.
  const currentPageTextColor = $derived<TextColors>(
    isStepper
      ? color === 'primary'
        ? 'interactive.text.primary.normal'
        : color === 'white'
          ? 'interactive.text.staticWhite.normal'
          : 'interactive.text.gray.normal'
      : color === 'white'
        ? 'surface.text.staticWhite.normal'
        : 'surface.text.gray.normal',
  );
  const currentPageIconColor = $derived<IconColor>(
    isStepper
      ? color === 'primary'
        ? 'interactive.icon.primary.normal'
        : color === 'white'
          ? 'interactive.icon.staticWhite.normal'
          : 'interactive.icon.gray.normal'
      : color === 'white'
        ? 'surface.icon.staticWhite.normal'
        : 'surface.icon.gray.normal',
  );
  const currentPageFontWeight = $derived<'medium' | 'semibold'>(
    isStepper ? 'semibold' : 'medium',
  );

  // Stepper pill classes: selected (current page) vs unselected (navigable
  // link). The link's focus ring is defined in the stepper CSS itself using
  // the Figma `interactive.border.primary.faded` token.
  const stepperSelectedClasses = $derived(getStepperItemSelectedClasses(color));
  const stepperLinkClasses = $derived(getStepperItemLinkClasses(color));

  // Unselected stepper items use subtle text/icon so only the current step is
  // emphasised (matches the Figma `.stepper-item` spec).
  const stepperLinkTextColor = $derived<TextColors>(
    color === 'white' ? 'interactive.text.staticWhite.subtle' : 'interactive.text.gray.subtle',
  );
  const stepperLinkIconColor = $derived<IconColor>(
    color === 'white' ? 'interactive.icon.staticWhite.normal' : 'interactive.icon.gray.subtle',
  );

  // Opacity for non-primary link colors (matches React's opacity[700] = 0.56)
  const linkOpacity = $derived(color !== 'primary' ? 0.56 : 1);

  // Check children type
  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(!isStringChildren ? (children as Snippet) : undefined);

  // Aria attributes for the <li>
  const ariaCurrent = $derived(isCurrentPage ? 'page' : undefined);
  const liA11yAttrs = $derived(makeAccessible({ current: ariaCurrent }));

  // Meta attributes
  const metaAttrs = metaAttribute({ name: MetaConstants.BreadcrumbItem });

  // Analytics attributes
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#snippet itemLabel(
  iconColor: IconColor,
  textColor: TextColors,
  fontWeight: 'regular' | 'medium' | 'semibold',
)}
  {#if Icon}
    <Icon {size} color={iconColor} />
  {/if}
  {#if children}
    <BaseText as="span" color={textColor} {fontSize} {lineHeight} fontFamily="text" {fontWeight}>
      {#if isStringChildren}
        {children}
      {:else if snippetChildren}
        {@render snippetChildren()}
      {/if}
    </BaseText>
  {/if}
{/snippet}

<li
  class={breadcrumbListItemClass}
  {...liA11yAttrs}
  {...metaAttrs}
>
  {#if isStepper}
    <!-- Stepper: every item is a pill. Current page is a filled, static pill;
         other steps are navigable links that tint on hover/focus. -->
    {#if isCurrentPage}
      <div class={stepperSelectedClasses}>
        {@render itemLabel(currentPageIconColor, currentPageTextColor, currentPageFontWeight)}
      </div>
    {:else}
      <a
        class={stepperLinkClasses}
        {href}
        onclick={onClick}
        {...makeAccessible({ label: accessibilityLabel })}
        {...analyticsAttrs}
      >
        {@render itemLabel(stepperLinkIconColor, stepperLinkTextColor, 'regular')}
      </a>
    {/if}
  {:else if isCurrentPage}
    <div class={currentPageWrapperClass}>
      {@render itemLabel(currentPageIconColor, currentPageTextColor, currentPageFontWeight)}
    </div>
  {:else}
    <BaseLink
      {size}
      {color}
      opacity={linkOpacity}
      icon={Icon}
      {href}
      {onClick}
      accessibilityProps={{ label: accessibilityLabel }}
      {...analyticsAttrs}
      {children}
    />
  {/if}

  <!-- Separator (hidden for last item via CSS, shown if showLastSeparator).
       Stepper uses a chevron icon, default uses a "/". -->
  <span class={separatorWrapperClass} {...makeAccessible({ hidden: true })}>
    {#if isStepper}
      <ChevronRightIcon {size} color={chevronColor} />
    {:else}
      <BaseText
        as="span"
        color={separatorColor}
        {fontSize}
        {lineHeight}
        fontFamily="text"
        fontWeight="medium"
      >
        /
      </BaseText>
    {/if}
  </span>
</li>
