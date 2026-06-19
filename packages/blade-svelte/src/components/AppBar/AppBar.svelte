<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import { getAppBarClasses, getAppBarTemplateClasses } from '@razorpay/blade-core/styles';
  import { getUtilityClass } from '@razorpay/blade-core/styles';
  import Button from '../Button/Button.svelte';
  import Tooltip from '../Tooltip/Tooltip.svelte';
  import { ChevronLeftIcon } from '../Icons';
  import { setAppBarContext } from './AppBarContext';
  import type { AppBarProps } from './types';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getAppBarTemplateClasses();

  let {
    children,
    backButton,
    variant = 'neutral',
    isSticky = true,
    accessibilityLabel,
    backgroundColor,
    width,
    testID,
    ...rest
  }: AppBarProps = $props();

  // Expose variant to AppBarLeading / AppBarActions so they can resolve the
  // correct (static-white vs adaptive) foreground colors.
  setAppBarContext(() => ({ variant }));

  // Icon-only Button is white on the dark `neutral` surface, primary otherwise.
  const backButtonColor = $derived<'white' | 'primary'>(
    variant === 'neutral' ? 'white' : 'primary',
  );

  // Convert a dot-notation background token (e.g. "surface.background.gray.intense")
  // into the matching blade-core utility class ("background-surface-background-gray-intense").
  const backgroundOverrideClass = $derived(
    backgroundColor
      ? getUtilityClass(`background-${backgroundColor.split('.').join('-')}` as never)
      : undefined,
  );

  const variantClasses = $derived(getAppBarClasses({ variant }));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [variantClasses, backgroundOverrideClass, ...(styledProps.classes ?? [])]
      .filter(Boolean)
      .join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.AppBar, testID }));
  const a11yAttrs = $derived(makeAccessible({ role: 'banner', label: accessibilityLabel }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const dataSticky = $derived(isSticky ? 'true' : 'false');
</script>

<header
  class={combinedClasses}
  data-sticky={dataSticky}
  style:width={width ?? '100%'}
  {...metaAttrs}
  {...a11yAttrs}
  {...analyticsAttrs}
>
  <div class={templateClasses.appBarLeading}>
    {#if backButton}
      <div class={templateClasses.appBarBackButton}>
        {#if backButton.tooltip}
          <Tooltip content={backButton.tooltip.content} placement={backButton.tooltip.placement}>
            <Button
              icon={ChevronLeftIcon}
              variant="tertiary"
              color={backButtonColor}
              size="medium"
              accessibilityLabel={backButton.accessibilityLabel}
              onClick={backButton.onClick}
            />
          </Tooltip>
        {:else}
          <Button
            icon={ChevronLeftIcon}
            variant="tertiary"
            color={backButtonColor}
            size="medium"
            accessibilityLabel={backButton.accessibilityLabel}
            onClick={backButton.onClick}
          />
        {/if}
      </div>
    {/if}
    {@render children()}
  </div>
</header>
