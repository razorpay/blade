<script lang="ts">
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getAppBarTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { TrustBadge } from '../TrustBadge';
  import { resolveComponentStyleOverride } from '../../utils/resolveComponentStyleOverride';
  import { getBladeThemeContextGetter } from '../BladeProvider/bladeThemeContext';
  import { getAppBarContext, useAppBarContext } from './AppBarContext';
  import type { AppBarLeadingProps, AppBarVariant } from './types';

  const templateClasses = getAppBarTemplateClasses();
  const themeContextGetter = getBladeThemeContextGetter();

  useAppBarContext('AppBarLeading');
  const getAppBarCtx = getAppBarContext() ?? (() => ({ variant: 'neutral' as AppBarVariant }));
  const appBarContext = $derived(getAppBarCtx());

  let {
    title,
    logo,
    trustBadgeVariant,
    trustBadgeLabel,
    testID,
    styleOverride,
    ...rest
  }: AppBarLeadingProps = $props();

  const resolvedStyleOverride = $derived(
    resolveComponentStyleOverride('AppBarLeading', styleOverride, themeContextGetter),
  );

  const titleSlotClass = $derived(resolvedStyleOverride?.title);

  const isNeutral = $derived(appBarContext.variant === 'neutral');

  const titleColor = $derived(
    titleSlotClass
      ? ('currentColor' as const)
      : isNeutral
        ? 'surface.text.staticWhite.normal'
        : 'surface.text.gray.normal',
  );

  const showFullBadge = $derived(trustBadgeVariant === 'default');
  const showIconBadge = $derived(trustBadgeVariant === 'icon-only');
  const hasTitleColumn = $derived(Boolean(title) || (showFullBadge && !logo));
  const stackFullBadgeBelowLogo = $derived(showFullBadge && Boolean(logo) && !title);

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.AppBarLeading, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={templateClasses.appBarLeading} {...metaAttrs} {...analyticsAttrs}>
  {#if logo}
    {#if stackFullBadgeBelowLogo}
      <div class={templateClasses.appBarLeadingLogoStack}>
        <div class={templateClasses.appBarLeadingLogo}>
          {@render logo()}
        </div>
        <div class={templateClasses.appBarLeadingBadge}>
          <TrustBadge variant="default" label={trustBadgeLabel} />
        </div>
      </div>
    {:else}
      <div class={templateClasses.appBarLeadingLogo}>
        {@render logo()}
      </div>
    {/if}
  {/if}

  {#if hasTitleColumn}
    <div class={templateClasses.appBarLeadingTitleWrap}>
      {#if title}
        <div
          class="{templateClasses.appBarLeadingTitleRow}{showIconBadge
            ? ` ${templateClasses.appBarLeadingTitleRowWithIconBadge}`
            : ''}"
        >
          <div class={templateClasses.appBarLeadingTitle}>
            <Text
              size="large"
              weight="semibold"
              color={titleColor}
              truncateAfterLines={1}
              className={titleSlotClass}
            >
              {title}
            </Text>
          </div>
          {#if showIconBadge}
            <TrustBadge variant="icon-only" label={trustBadgeLabel} />
          {/if}
        </div>
      {/if}
      {#if showFullBadge && !stackFullBadgeBelowLogo}
        <div class={templateClasses.appBarLeadingBadge}>
          <TrustBadge variant="default" label={trustBadgeLabel} />
        </div>
      {/if}
    </div>
  {:else if showIconBadge}
    <TrustBadge variant="icon-only" label={trustBadgeLabel} />
  {/if}
</div>
