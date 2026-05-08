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
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import BaseLink from '../Link/BaseLink/BaseLink.svelte';
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

  // Text size mapping
  const textSizes = getBreadcrumbTextSizes();
  const fontSize = $derived(textSizes.fontSize[size]);
  const lineHeight = $derived(textSizes.lineHeight[size]);

  // Separator color
  const separatorColor = $derived<TextColors>(
    color === 'white' ? 'surface.text.staticWhite.muted' : 'surface.text.gray.muted',
  );

  // Current page colors
  const currentPageTextColor = $derived<TextColors>(
    color === 'white' ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal',
  );
  const currentPageIconColor = $derived<IconColor>(
    color === 'white' ? 'surface.icon.staticWhite.normal' : 'surface.icon.gray.normal',
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

<li
  class={breadcrumbListItemClass}
  {...liA11yAttrs}
  {...metaAttrs}
>
  {#if isCurrentPage}
    <div class={currentPageWrapperClass}>
      {#if Icon}
        <Icon {size} color={currentPageIconColor} />
      {/if}
      {#if children}
        <BaseText
          as="span"
          color={currentPageTextColor}
          {fontSize}
          {lineHeight}
          fontFamily="text"
          fontWeight="medium"
        >
          {#if isStringChildren}
            {children}
          {:else if snippetChildren}
            {@render snippetChildren()}
          {/if}
        </BaseText>
      {/if}
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

  <!-- Separator (hidden for last item via CSS, shown if showLastSeparator) -->
  <span class={separatorWrapperClass} {...makeAccessible({ hidden: true })}>
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
  </span>
</li>
