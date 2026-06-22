<script lang="ts">
  import { onMount } from 'svelte';
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
    getAnnouncementBannerTextColorToken,
    getAnnouncementBannerIconColorToken,
    announcementBannerIconWrapperClass,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import type { TextColors } from '../Typography/BaseText/types';
  import type { IconColor } from '../Icons/types';
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

  // Mirror React's useTheme() colorScheme — read from the data-theme body attribute
  // set by BladeProvider (or ThemeSwitcher in dev). A MutationObserver keeps it reactive.
  let isDark = $state(false);

  onMount(() => {
    isDark = document.body.getAttribute('data-theme') === 'dark';
    const observer = new MutationObserver(() => {
      isDark = document.body.getAttribute('data-theme') === 'dark';
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  });

  // Check if children is a string or a snippet
  const isStringChildren = $derived(typeof children === 'string');
  const snippetChildren = $derived(
    !isStringChildren ? (children as Snippet) : undefined,
  );

  // Text and icon color tokens based on color scheme
  const textColorToken = $derived(
    getAnnouncementBannerTextColorToken(isDark) as TextColors,
  );
  const iconColorToken = $derived(
    getAnnouncementBannerIconColorToken(isDark) as IconColor,
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
    <div class={announcementBannerIconWrapperClass} aria-hidden="true">
      <Icon size="small" color={iconColorToken} />
    </div>
  {/if}
  <BaseText
    as="span"
    color={textColorToken}
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
