<script lang="ts">
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getAppBarTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { CheckCircleIcon } from '../Icons';
  import { useAppBarContext } from './AppBarContext';
  import type { AppBarLeadingProps } from './types';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getAppBarTemplateClasses();

  // Verify inside AppBar and read the variant for foreground color resolution.
  const appBarContext = useAppBarContext('AppBarLeading');

  let {
    title,
    subtitle,
    logo,
    prefix,
    isTrustedBusiness = false,
    titleSuffix,
    testID,
    ...rest
  }: AppBarLeadingProps = $props();

  const isNeutral = $derived(appBarContext.variant === 'neutral');

  const titleColor = $derived(
    isNeutral ? 'surface.text.staticWhite.normal' : 'surface.text.gray.normal',
  );
  const subtitleColor = $derived(
    isNeutral ? 'surface.text.staticWhite.muted' : 'surface.text.gray.subtle',
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.AppBarLeading, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={templateClasses.appBarLeading} {...metaAttrs} {...analyticsAttrs}>
  {#if prefix}
    <div class={templateClasses.appBarLeadingPrefix}>
      {@render prefix()}
    </div>
  {/if}

  {#if logo}
    <div class={templateClasses.appBarLeadingLogo}>
      {@render logo()}
    </div>
  {/if}

  {#if title || subtitle}
    <div class={templateClasses.appBarLeadingTitleWrap}>
      {#if title}
        <div class={templateClasses.appBarLeadingTitleRow}>
          <Text size="large" weight="semibold" color={titleColor} truncateAfterLines={1}>
            {title}
          </Text>
          {#if titleSuffix}
            <div class={templateClasses.appBarLeadingTitleSuffix}>
              {@render titleSuffix()}
            </div>
          {/if}
        </div>
      {/if}
      {#if subtitle}
        <Text size="small" weight="regular" color={subtitleColor}>
          {subtitle}
        </Text>
      {/if}
    </div>
  {/if}

  {#if isTrustedBusiness}
    <div class={templateClasses.appBarRtbPill}>
      <span class={templateClasses.appBarRtbShield} aria-hidden="true">
        <CheckCircleIcon size="small" color="surface.icon.staticWhite.normal" />
      </span>
      <Text size="xsmall" weight="regular" color="surface.text.staticWhite.normal">
        Razorpay Trusted Business
      </Text>
    </div>
  {/if}
</div>
