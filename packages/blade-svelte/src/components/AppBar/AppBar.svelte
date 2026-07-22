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
  import IconButton from '../Button/IconButton/IconButton.svelte';
  import { ArrowLeftIcon } from '../Icons';
  import { setAppBarContext } from './AppBarContext';
  import type { AppBarProps } from './types';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getAppBarTemplateClasses();

  let {
    children,
    showBackButton = false,
    onBackButtonClick,
    backButtonAccessibilityLabel = 'Go back',
    backButtonTooltip,
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

  // `subtle` emphasis renders a static-white icon for the dark `neutral` surface;
  // `intense` renders the gray icon for the light `subtle` surface.
  // Lazy-load the Tooltip component: it's only rendered for the back button when a
  // `backButtonTooltip` is provided, so we keep it out of the main bundle otherwise.
  // The back button renders without the Tooltip wrapper until the chunk loads;
  // the Tooltip then wraps it on the next render (CSR only — see known behavior change).
  let Tooltip = $state<typeof import('../Tooltip/Tooltip.svelte').default | null>(null);
  let tooltipLoadPromise: Promise<void> | null = null;

  $effect(() => {
    if (!showBackButton || !backButtonTooltip || Tooltip || tooltipLoadPromise) return;

    let cancelled = false;
    tooltipLoadPromise = import('../Tooltip/Tooltip.svelte')
      .then((module) => {
        if (!cancelled) Tooltip = module.default;
      })
      .catch((error) => {
        console.error('Failed to load Tooltip chunk:', error);
      })
      .finally(() => {
        if (!cancelled) tooltipLoadPromise = null;
      });

    return () => { cancelled = true; };
  });

  const backButtonEmphasis = $derived<'subtle' | 'intense'>(
    variant === 'neutral' ? 'subtle' : 'intense',
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
  <div class={templateClasses.appBarLeadingRow}>
    {#if showBackButton}
      <div class={templateClasses.appBarBackButton}>
        {#if backButtonTooltip && Tooltip}
          <Tooltip content={backButtonTooltip.content} placement={backButtonTooltip.placement}>
            <IconButton
              icon={ArrowLeftIcon}
              emphasis={backButtonEmphasis}
              size="medium"
              accessibilityLabel={backButtonAccessibilityLabel}
              onClick={(e) => onBackButtonClick?.(e)}
            />
          </Tooltip>
        {:else}
          <IconButton
            icon={ArrowLeftIcon}
            emphasis={backButtonEmphasis}
            size="medium"
            accessibilityLabel={backButtonAccessibilityLabel}
            onClick={(e) => onBackButtonClick?.(e)}
          />
        {/if}
      </div>
    {/if}
    {@render children()}
  </div>
</header>
