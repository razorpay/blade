<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getAnnouncementBannerClasses,
    getAnnouncementBannerTemplateClasses,
    announcementBannerIconWrapperClass,
    announcementBannerTextColorClass,
    announcementBannerIconColorClass,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import type { AnnouncementBannerProps } from './types';

  // Prevent tree-shaking of CSS classes used only in templates
  void getAnnouncementBannerTemplateClasses();

  let {
    children,
    alignment = 'center',
    icon: Icon,
    accessibilityLabel = 'Announcement',
    testID,
    ...rest
  }: AnnouncementBannerProps = $props();

  // Check if children is a string or a snippet
  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(
    !isStringChildren ? (children as Snippet) : undefined,
  );

  // Container classes
  const bannerClasses = $derived(getAnnouncementBannerClasses({ alignment }));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [bannerClasses, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  // Meta attributes
  const metaAttrs = $derived(
    metaAttribute({ name: MetaConstants.AnnouncementBanner, testID }),
  );

  // A11y: region landmark with an accessible label
  const a11yAttrs = $derived(
    makeAccessible({ role: 'region', label: accessibilityLabel }),
  );

  // Analytics attributes
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={combinedClasses}
  {...metaAttrs}
  {...a11yAttrs}
  {...analyticsAttrs}
>
  {#if Icon}
    <div class="{announcementBannerIconWrapperClass} {announcementBannerIconColorClass}" aria-hidden="true">
      <Icon size="small" color="currentColor" />
    </div>
  {/if}
  <BaseText
    as="span"
    className={announcementBannerTextColorClass}
    fontSize={75}
    lineHeight={75}
    fontFamily="text"
    fontWeight="medium"
    letterSpacing={50}
    truncateAfterLines={1}
  >
    {#if isStringChildren}
      {children}
    {:else if snippetChildren}
      {@render snippetChildren()}
    {/if}
  </BaseText>
</div>
