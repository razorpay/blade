<script lang="ts">
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getAppBarTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { TrustBadge } from '../TrustBadge';
  import { getAppBarContext, useAppBarContext } from './AppBarContext';
  import type { AppBarLeadingProps, AppBarVariant } from './types';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getAppBarTemplateClasses();

  useAppBarContext('AppBarLeading');
  const getAppBarCtx = getAppBarContext() ?? (() => ({ variant: 'neutral' as AppBarVariant }));
  const appBarContext = $derived(getAppBarCtx());

  let {
    title,
    logo,
    trustBadge,
    testID,
    ...rest
  }: AppBarLeadingProps = $props();

  const isNeutral = $derived(appBarContext.variant === 'neutral');
  const trustBadgeEmphasis = $derived(isNeutral ? 'intense' : 'subtle');

  const titleColor = $derived(
    isNeutral ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal',
  );

  const showFullBadge = $derived(trustBadge?.variant === 'full');
  const showIconBadge = $derived(trustBadge?.variant === 'icon-only');
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
          <TrustBadge variant="full" emphasis={trustBadgeEmphasis} label={trustBadge?.label} />
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
            <Text size="large" weight="semibold" color={titleColor} truncateAfterLines={1}>
              {title}
            </Text>
          </div>
          {#if showIconBadge}
            <TrustBadge variant="icon-only" emphasis={trustBadgeEmphasis} label={trustBadge?.label} />
          {/if}
        </div>
      {/if}
      {#if showFullBadge && !stackFullBadgeBelowLogo}
        <div class={templateClasses.appBarLeadingBadge}>
          <TrustBadge variant="full" emphasis={trustBadgeEmphasis} label={trustBadge?.label} />
        </div>
      {/if}
    </div>
  {:else if showIconBadge}
    <TrustBadge variant="icon-only" emphasis={trustBadgeEmphasis} label={trustBadge?.label} />
  {/if}
</div>
