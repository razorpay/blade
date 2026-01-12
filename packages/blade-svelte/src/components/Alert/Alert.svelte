<script lang="ts">
  import type { AlertProps } from './types';
  import Text from '../Typography/Text/Text.svelte';
  import BaseButton from '../Button/BaseButton/BaseButton.svelte';
  import BaseLink from '../Link/BaseLink/BaseLink.svelte';
  import {
    alertStyles,
    getAlertTextColor,
    getAlertIconColor,
    getAlertAccessibilityRole,
    getAlertAriaLive,
    getAlertTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import {
    getStyledPropsClasses,
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
    makeAccessible,
  } from '@razorpay/blade-core/utils';

  let {
    description,
    title,
    isDismissible = true,
    onDismiss,
    icon,
    emphasis = 'subtle',
    isFullWidth = false,
    color = 'neutral',
    actions,
    testID,
    ...rest
  }: AlertProps = $props();

  // Internal visibility state
  let isVisible = $state(true);

  // Detect if we're on mobile (simplified - could use matchMedia for production)
  // For now, we'll assume desktop layout. In production, use media query or breakpoint utility
  const isMobile = $state(false);
  const isDesktop = $derived(!isMobile);

  // Get text color based on emphasis
  const textColor = $derived(getAlertTextColor(emphasis));

  // Get icon color based on color and emphasis
  const iconColor = $derived(getAlertIconColor({ color, emphasis }));

  // Determine if actions should be horizontal (desktop + full width)
  const showActionsHorizontal = $derived(isFullWidth && isDesktop);

  // Determine if icon should be centered
  const shouldCenterAlignIcon = $derived(isFullWidth && !title);

  // Get icon offset class based on layout
  const iconOffsetClass = $derived.by(() => {
    // Simplified offset logic - matches common cases
    if (isMobile) {
      if (!isFullWidth && title) {
        return templateClasses.iconOffset2;
      }
      if (isFullWidth && !title) {
        return templateClasses.iconOffset2;
      }
    }
    if (isFullWidth) {
      return templateClasses.iconOffset1;
    }
    return templateClasses.iconOffset1;
  });

  // Get template classes
  const templateClasses = getAlertTemplateClasses();

  // Generate alert CSS classes
  const alertClasses = $derived(
    alertStyles({
      color,
      emphasis,
      isFullWidth,
      isFullWidthDesktop: showActionsHorizontal,
    }),
  );

  // Get styled props classes
  const styledPropsClasses = $derived(getStyledPropsClasses(rest));

  // Combine all classes
  const allClasses = $derived([alertClasses, styledPropsClasses].filter(Boolean).join(' '));

  // Get analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Accessibility attributes
  const accessibilityRole = $derived(getAlertAccessibilityRole(color));
  const ariaLive = $derived(getAlertAriaLive(color));
  const a11yAttrs = $derived(
    makeAccessible({
      role: accessibilityRole,
      liveRegion: ariaLive,
    }),
  );

  // Handle dismiss
  function handleDismiss(): void {
    if (onDismiss) {
      onDismiss();
    }
    isVisible = false;
  }

  // Type guard to check if secondary action is a link
  function isSecondaryActionLink(
    action: AlertProps['actions']['secondary'],
  ): action is { text: string; href: string; onClick?: () => void; target?: string; rel?: string } {
    return action !== undefined && 'href' in action;
  }

  // Get content padding based on layout
  const contentPaddingLeftClass = $derived(
    isFullWidth ? templateClasses.contentPaddingLeftLarge : templateClasses.contentPaddingLeftSmall,
  );
  const contentPaddingRightClass = $derived(
    showActionsHorizontal
      ? templateClasses.contentPaddingRightLarge
      : templateClasses.contentPaddingRightSmall,
  );
</script>

{#if isVisible}
  <div
    class={allClasses}
    {...metaAttribute({ name: MetaConstants.Alert, testID })}
    {...analyticsAttrs}
    {...a11yAttrs}
  >
    <!-- Leading Icon -->
    <div
      class={`${shouldCenterAlignIcon ? templateClasses.iconContainerCentered : templateClasses.iconContainer} ${iconOffsetClass}`}
    >
      {#if icon}
        {@render icon()}
      {:else}
        <!-- Default icon placeholder - in production, render actual icon based on color -->
        <!-- For now, we'll skip the default icon since icon components might not be migrated -->
        <!-- TODO: Add default icon rendering when icon components are available -->
        <div style="width: 20px; height: 20px; background: currentColor; border-radius: 50%;" aria-hidden="true"></div>
      {/if}
    </div>

    <!-- Content Container -->
    <div class={`${templateClasses.content} ${contentPaddingLeftClass} ${contentPaddingRightClass}`}>
      <!-- Title -->
      {#if title}
        <div class={templateClasses.title}>
          <Text color={textColor} size="medium" weight="semibold">
            {title}
          </Text>
        </div>
      {/if}

      <!-- Description -->
      <div class={title ? templateClasses.descriptionNoOffset : templateClasses.description}>
        <Text color={textColor} size="small">
          {#if typeof description === 'string'}
            {description}
          {:else}
            {@render description()}
          {/if}
        </Text>
      </div>

      <!-- Actions Vertical (mobile or non-full-width) -->
      {#if !showActionsHorizontal && (actions?.primary || actions?.secondary)}
        <div class={templateClasses.actionsVertical}>
          {#if actions.primary}
            <div class={templateClasses.primaryAction}>
              <BaseButton
                size="small"
                onClick={actions.primary.onClick}
                color={emphasis === 'intense' ? 'white' : color}
                variant="secondary"
              >
                {actions.primary.text}
              </BaseButton>
            </div>
          {/if}
          {#if actions.secondary}
            <div class={templateClasses.secondaryAction}>
              {#if isSecondaryActionLink(actions.secondary)}
                <BaseLink
                  size="small"
                  color={emphasis === 'intense' ? 'white' : color}
                  href={actions.secondary.href}
                  target={actions.secondary.target}
                  rel={actions.secondary.rel}
                  onClick={actions.secondary.onClick}
                >
                  {actions.secondary.text}
                </BaseLink>
              {:else}
                <BaseLink
                  size="small"
                  color={emphasis === 'intense' ? 'white' : color}
                  variant="button"
                  onClick={actions.secondary.onClick}
                >
                  {actions.secondary.text}
                </BaseLink>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Actions Horizontal (desktop + full-width) -->
    {#if showActionsHorizontal && (actions?.primary || actions?.secondary)}
      <div class={templateClasses.actionsHorizontal}>
        {#if actions.primary}
          <div class={templateClasses.primaryAction}>
            <BaseButton
              size="small"
              onClick={actions.primary.onClick}
              color={emphasis === 'intense' ? 'white' : color}
              variant="secondary"
            >
              {actions.primary.text}
            </BaseButton>
          </div>
        {/if}
        {#if actions.secondary}
          <div class={templateClasses.secondaryAction}>
            {#if isSecondaryActionLink(actions.secondary)}
              <BaseLink
                size="small"
                color={emphasis === 'intense' ? 'white' : color}
                href={actions.secondary.href}
                target={actions.secondary.target}
                rel={actions.secondary.rel}
                onClick={actions.secondary.onClick}
              >
                {actions.secondary.text}
              </BaseLink>
            {:else}
              <BaseLink
                size="small"
                color={emphasis === 'intense' ? 'white' : color}
                variant="button"
                onClick={actions.secondary.onClick}
              >
                {actions.secondary.text}
              </BaseLink>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Close Button -->
    {#if isDismissible}
      <div class={templateClasses.closeButton}>
        <BaseButton
          variant="tertiary"
          size="large"
          color={emphasis === 'intense' ? 'white' : 'primary'}
          onClick={handleDismiss}
          accessibilityLabel="Dismiss alert"
        >
          ×
        </BaseButton>
      </div>
    {/if}
  </div>
{/if}
