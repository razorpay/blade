<script lang="ts">
  import { metaAttribute, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import {
    getDropdownTemplateClasses,
    baseHeaderInnerClass,
    baseHeaderRowClass,
    baseHeaderTitleBlockClass,
    baseHeaderLeadingClass,
    baseHeaderTitleRowClass,
    baseHeaderTrailingClass,
  } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import Divider from '../Divider/Divider.svelte';
  import IconButton from '../Button/IconButton/IconButton.svelte';
  import { ChevronLeftIcon, CloseIcon } from '../Icons';
  import type { BaseHeaderProps } from './types';

  // Prevent tree-shaking of template classes used in compound selectors.
  void getDropdownTemplateClasses();

  let {
    title,
    subtitle,
    leading,
    trailing,
    titleSuffix,
    showDivider = true,
    showBackButton = false,
    showCloseButton = true,
    onBackButtonClick,
    onCloseButtonClick,
    isDisabled = false,
    metaComponentName,
    testID,
    children,
    ...rest
  }: BaseHeaderProps = $props();

  const titleColor = $derived(
    isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.normal',
  );
  const subtitleColor = $derived(
    isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted',
  );

  const hasOnlyChildren = $derived(
    Boolean(children) && !(title || subtitle || titleSuffix || leading),
  );

  const metaAttrs = $derived(metaAttribute({ name: metaComponentName, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div {...metaAttrs} {...analyticsAttrs}>
  <div class={baseHeaderInnerClass}>
    <div class={baseHeaderRowClass}>
      {#if showBackButton}
        <div class={baseHeaderLeadingClass}>
          <IconButton
            icon={ChevronLeftIcon}
            size="large"
            accessibilityLabel="Back"
            onClick={() => onBackButtonClick?.()}
          />
        </div>
      {/if}

      {#if !hasOnlyChildren}
        <div class={baseHeaderTitleBlockClass}>
          <div class={baseHeaderTitleRowClass}>
            {#if leading}
              <span class={baseHeaderLeadingClass}>{@render leading()}</span>
            {/if}
            {#if title}
              <Text as="span" size="large" weight="semibold" color={titleColor} wordBreak="break-word">
                {title}
              </Text>
            {/if}
            {#if titleSuffix}
              {@render titleSuffix()}
            {/if}
          </div>
          {#if subtitle}
            <Text variant="body" size="small" weight="regular" color={subtitleColor}>
              {subtitle}
            </Text>
          {/if}
        </div>
      {/if}

      {#if trailing}
        <div class={baseHeaderTrailingClass}>{@render trailing()}</div>
      {/if}

      {#if showCloseButton}
        <div class={baseHeaderTrailingClass}>
          <IconButton
            icon={CloseIcon}
            size="large"
            accessibilityLabel="Close"
            onClick={() => onCloseButtonClick?.()}
          />
        </div>
      {/if}
    </div>

    {#if children}
      {@render children()}
    {/if}
  </div>
  {#if showDivider}
    <Divider />
  {/if}
</div>
