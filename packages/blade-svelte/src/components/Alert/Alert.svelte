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
    getAlertClasses,
    getAlertTemplateClasses,
    getAlertTextColorToken,
    getAlertIconColorToken,
    getAlertActionButtonColor,
    getAlertActionButtonVariant,
    getAlertLinkColor,
    alertIconWrapperClass,
    alertContentClass,
    alertContentFullWidthClass,
    alertTitleClass,
    alertDescriptionClass,
    alertDescriptionWithTitleClass,
    alertActionsVerticalClass,
    alertActionsHorizontalClass,
    alertActionPrimaryClass,
    alertActionPrimaryWithTrailingClass,
    alertActionSecondaryClass,
    alertActionSecondaryWithDismissClass,
    alertCloseButtonClass,
    alertIconOffset1Class,
    alertIconOffset2Class,
    alertIconWrapperCenterClass,
    alertIconOffsetDescriptionOnlyClass,
    alertCloseButtonDescriptionOnlyClass,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import BaseButton from '../Button/BaseButton/BaseButton.svelte';
  import BaseLink from '../Link/BaseLink/BaseLink.svelte';
  import { InfoIcon } from '../Icons/InfoIcon';
  import { CheckCircleIcon } from '../Icons/CheckCircleIcon';
  import { AlertOctagonIcon } from '../Icons/AlertOctagonIcon';
  import { AlertTriangleIcon } from '../Icons/AlertTriangleIcon';
  import { CloseIcon } from '../Icons/CloseIcon';
  import type { TextColors } from '../Typography/BaseText/types';
  import type { IconColor } from '../Icons/types';
  import type { AlertProps, SecondaryActionLinkButton } from './types';

  // Prevent tree-shaking of CSS classes used only in templates
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void getAlertTemplateClasses();

  let {
    description,
    title,
    isDismissible = true,
    onDismiss,
    icon: CustomIcon,
    emphasis = 'subtle',
    isFullWidth = false,
    color = 'neutral',
    actions,
    testID,
    ...rest
  }: AlertProps = $props();

  // Dismiss state
  let isVisible = $state(true);

  // Intent → icon mapping
  const intentIconMap = {
    positive: CheckCircleIcon,
    negative: AlertOctagonIcon,
    information: InfoIcon,
    neutral: InfoIcon,
    notice: AlertTriangleIcon,
  } as const;

  // Resolved icon component
  const Icon = $derived(CustomIcon ?? intentIconMap[color]);

  // Check if description is a string or snippet
  const isStringDescription = $derived(typeof description === 'string');
  const snippetDescription = $derived(
    !isStringDescription ? (description as Snippet) : undefined,
  );

  // Text color token
  const textColorToken = $derived(
    getAlertTextColorToken({ emphasis }) as TextColors,
  );

  // Icon color token
  const iconColorToken = $derived(
    getAlertIconColorToken({ color, emphasis }) as IconColor,
  );

  // Action button color/variant and link color derived from emphasis
  const buttonActionColor = $derived(
    getAlertActionButtonColor({ color, emphasis }),
  );
  const buttonActionVariant = $derived(
    getAlertActionButtonVariant({ emphasis }),
  );
  const linkActionColor = $derived(
    getAlertLinkColor({ emphasis }),
  );

  // Has actions
  const hasActions = $derived(!!actions?.primary || !!actions?.secondary);

  // Description-only alerts (no title, no actions) render the icon centered
  // with a 1px top offset, matching React's `isDescriptionOnly` branch.
  const isDescriptionOnly = $derived(!title && !hasActions);

  // Full-width alerts without a title also center-align the icon
  // (matches React's `shouldCenterAlign`).
  const shouldCenterAlign = $derived(isFullWidth && !title);

  // Icon offset class based on layout context.
  // Note: .icon-offset-2 is breakpoint-aware in CSS (spacing.1 on desktop,
  // spacing.2 on mobile) so we can pick it unconditionally for cases that
  // only need the mobile bump on React.
  const iconOffsetClass = $derived.by(() => {
    if (isDescriptionOnly) return alertIconOffsetDescriptionOnlyClass;
    if (!isFullWidth && title) return alertIconOffset2Class;
    if (isFullWidth && !title) return alertIconOffset2Class;
    return alertIconOffset1Class;
  });

  // Icon alignment class — center for description-only and full-width w/o title.
  const iconAlignClass = $derived(
    isDescriptionOnly || shouldCenterAlign ? alertIconWrapperCenterClass : '',
  );

  // Content classes
  const contentClasses = $derived.by(() => {
    const classes = [alertContentClass];
    if (isFullWidth) classes.push(alertContentFullWidthClass);
    return classes.filter(Boolean).join(' ');
  });

  // Description classes
  const descriptionClasses = $derived(
    title ? alertDescriptionWithTitleClass : alertDescriptionClass,
  );

  // Close button classes — apply a slight top offset for description-only alerts
  // so the dismiss icon stays visually centered with the single line of text.
  const closeButtonClasses = $derived.by(() => {
    const classes = [alertCloseButtonClass];
    if (isDescriptionOnly) classes.push(alertCloseButtonDescriptionOnlyClass);
    return classes.join(' ');
  });

  // Primary action needs trailing space if secondary action or dismiss button follows
  const primaryActionClasses = $derived.by(() => {
    const classes = [alertActionPrimaryClass];
    if (actions?.secondary || isDismissible) classes.push(alertActionPrimaryWithTrailingClass);
    return classes.join(' ');
  });

  // Secondary action needs trailing space if dismiss button follows
  const secondaryActionClasses = $derived.by(() => {
    const classes = [alertActionSecondaryClass];
    if (isDismissible) classes.push(alertActionSecondaryWithDismissClass);
    return classes.join(' ');
  });

  // Determine if secondary action is a link (has href)
  const secondaryIsLink = $derived(
    actions?.secondary && 'href' in actions.secondary,
  );

  // Alert container classes
  const alertClasses = $derived(getAlertClasses({ color, emphasis, isFullWidth }));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [alertClasses, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  // A11y: role and aria-live
  const a11yAttrs = $derived(
    makeAccessible({
      role: color === 'negative' || color === 'notice' ? 'alert' : 'status',
      ...(color === 'notice' && { liveRegion: 'polite' }),
    }),
  );

  // Meta attributes
  const metaAttrs = metaAttribute({ name: MetaConstants.Alert, testID });

  // Analytics attributes
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  // Dismiss handler
  function handleDismiss(): void {
    onDismiss?.();
    isVisible = false;
  }
</script>

{#if isVisible}
  <div
    class={combinedClasses}
    {...metaAttrs}
    {...a11yAttrs}
    {...analyticsAttrs}
  >
    <!-- Leading Icon -->
    <div class="{alertIconWrapperClass} {iconOffsetClass} {iconAlignClass}">
      <Icon size="medium" color={iconColorToken} />
    </div>

    <!-- Content area -->
    <div class={contentClasses}>
      <!-- Title -->
      {#if title}
        <div class={alertTitleClass}>
          <BaseText
            as="span"
            color={textColorToken}
            fontSize={100}
            lineHeight={100}
            fontFamily="text"
            fontWeight="semibold"
          >
            {title}
          </BaseText>
        </div>
      {/if}

      <!-- Description -->
      <div class={descriptionClasses}>
        <BaseText
          as="span"
          color={textColorToken}
          fontSize={75}
          lineHeight={75}
          fontFamily="text"
          fontWeight="regular"
        >
          {#if isStringDescription}
            {description}
          {:else if snippetDescription}
            {@render snippetDescription()}
          {/if}
        </BaseText>
      </div>

      <!-- Actions vertical (mobile / non-full-width) -->
      {#if hasActions}
        <div class={alertActionsVerticalClass}>
          {#if actions?.primary}
            <div class={primaryActionClasses}>
              <BaseButton
                size="small"
                onClick={actions.primary.onClick}
                color={buttonActionColor}
                variant={buttonActionVariant}
              >
                {actions.primary.text}
              </BaseButton>
            </div>
          {/if}
          {#if actions?.secondary}
            <div class={secondaryActionClasses}>
              <BaseLink
                size="small"
                color={linkActionColor}
                onClick={actions.secondary.onClick}
                href={secondaryIsLink ? (actions.secondary as SecondaryActionLinkButton).href : undefined}
                target={secondaryIsLink ? (actions.secondary as SecondaryActionLinkButton).target : undefined}
                rel={secondaryIsLink ? (actions.secondary as SecondaryActionLinkButton).rel : undefined}
              >
                {actions.secondary.text}
              </BaseLink>
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- Actions horizontal (desktop full-width only, toggled via CSS) -->
    {#if isFullWidth && hasActions}
      <div class={alertActionsHorizontalClass}>
        {#if actions?.primary}
          <div class={primaryActionClasses}>
            <BaseButton
              size="small"
              onClick={actions.primary.onClick}
              color={buttonActionColor}
              variant={buttonActionVariant}
            >
              {actions.primary.text}
            </BaseButton>
          </div>
        {/if}
        {#if actions?.secondary}
          <div class={secondaryActionClasses}>
            <BaseLink
              size="small"
              color={linkActionColor}
              onClick={actions.secondary.onClick}
              href={secondaryIsLink ? (actions.secondary as SecondaryActionLinkButton).href : undefined}
              target={secondaryIsLink ? (actions.secondary as SecondaryActionLinkButton).target : undefined}
              rel={secondaryIsLink ? (actions.secondary as SecondaryActionLinkButton).rel : undefined}
            >
              {actions.secondary.text}
            </BaseLink>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Close/Dismiss Button -->
    {#if isDismissible}
      <button
        class={closeButtonClasses}
        onclick={handleDismiss}
        {...makeAccessible({ label: 'Dismiss alert' })}
      >
        <CloseIcon
          size="medium"
          color={emphasis === 'intense' ? 'surface.icon.staticWhite.normal' : 'surface.icon.gray.subtle'}
        />
      </button>
    {/if}
  </div>
{/if}
