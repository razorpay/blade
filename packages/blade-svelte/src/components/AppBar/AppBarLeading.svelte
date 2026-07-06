<script lang="ts">
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getAppBarTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { TrustedMarker } from '../TrustedMarker';
  import { getAppBarContext, useAppBarContext } from './AppBarContext';
  import type { AppBarLeadingProps, AppBarVariant } from './types';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getAppBarTemplateClasses();

  useAppBarContext('AppBarLeading');
  const getAppBarCtx = getAppBarContext() ?? (() => ({ variant: 'neutral' as AppBarVariant }));
  const appBarContext = $derived(getAppBarCtx());

  let { title, logo, rtbBadge, testID, ...rest }: AppBarLeadingProps = $props();

  const isNeutral = $derived(appBarContext.variant === 'neutral');

  const titleColor = $derived(
    isNeutral ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal',
  );

  const showFullRtb = $derived(rtbBadge === 'full');
  const showIconRtb = $derived(rtbBadge === 'icon');
  const hasTitleColumn = $derived(Boolean(title) || (showFullRtb && !logo));
  const stackFullRtbBelowLogo = $derived(showFullRtb && Boolean(logo) && !title);

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.AppBarLeading, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={templateClasses.appBarLeading} {...metaAttrs} {...analyticsAttrs}>
  {#if logo}
    {#if stackFullRtbBelowLogo}
      <div class={templateClasses.appBarLeadingLogoStack}>
        <div class={templateClasses.appBarLeadingLogo}>
          {@render logo()}
        </div>
        <div class={templateClasses.appBarLeadingBadge}>
          <TrustedMarker type="full" variant={appBarContext.variant} />
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
          class="{templateClasses.appBarLeadingTitleRow}{showIconRtb
            ? ` ${templateClasses.appBarLeadingTitleRowWithIconRtb}`
            : ''}"
        >
          <div class={templateClasses.appBarLeadingTitle}>
            <Text size="large" weight="semibold" color={titleColor} truncateAfterLines={1}>
              {title}
            </Text>
          </div>
          {#if showIconRtb}
            <TrustedMarker type="icon" variant={appBarContext.variant} />
          {/if}
        </div>
      {/if}
      {#if showFullRtb && !stackFullRtbBelowLogo}
        <div class={templateClasses.appBarLeadingBadge}>
          <TrustedMarker type="full" variant={appBarContext.variant} />
        </div>
      {/if}
    </div>
  {:else if showIconRtb}
    <TrustedMarker type="icon" variant={appBarContext.variant} />
  {/if}
</div>
