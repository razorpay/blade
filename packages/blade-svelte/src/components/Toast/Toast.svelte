<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    MAKE_ANALYTICS_CONSTANTS,
  } from '@razorpay/blade-core/utils';
  import {
    getToastClasses,
    getToastTemplateClasses,
    getToastIconColorToken,
    getToastTextColorToken,
    getToastActionButtonProps,
    toastIconWrapperClass,
    toastContentClass,
    toastTrailingClass,
    toastDismissButtonClass,
  } from '@razorpay/blade-core/styles';
  import Button from '../Button/Button.svelte';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import { CloseIcon } from '../Icons/CloseIcon';
  import { CheckCircleIcon } from '../Icons/CheckCircleIcon';
  import { AlertOctagonIcon } from '../Icons/AlertOctagonIcon';
  import { AlertTriangleIcon } from '../Icons/AlertTriangleIcon';
  import { InfoIcon } from '../Icons/InfoIcon';
  import type { TextColors } from '../Typography/BaseText/types';
  import type { IconColor } from '../Icons/types';
  import type { IconComponent } from '../Icons';
  import { dismissToast } from './toastStore';
  import type { ToastProps } from './types';

  // Prevent tree-shaking of CSS class imports that only appear in templates.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void getToastTemplateClasses();

  let {
    type = 'informational',
    color = 'neutral',
    leading,
    action,
    content,
    onDismissButtonClick,
    isVisible = true,
    id = '',
    testID,
    ...rest
  }: ToastProps = $props();

  // Default icon by feedback color when no `leading` provided. Promotional
  // toasts surface no default icon — they only show one if the caller passes
  // `leading` explicitly.
  const intentIconMap = {
    positive: CheckCircleIcon,
    negative: AlertOctagonIcon,
    information: InfoIcon,
    neutral: InfoIcon,
    notice: AlertTriangleIcon,
  } as const;

  const isPromotional = $derived(type === 'promotional');
  const Icon = $derived<IconComponent | undefined>(
    isPromotional ? leading : leading ?? intentIconMap[color],
  );

  const isStringContent = $derived(typeof content === 'string');
  const snippetContent = $derived(!isStringContent ? (content as Snippet) : undefined);

  const iconColorToken = $derived(getToastIconColorToken({ type }) as IconColor);
  const textColorToken = $derived(getToastTextColorToken({ type }) as TextColors);
  const actionButtonProps = $derived(getToastActionButtonProps({ type }));

  const toastClasses = $derived(getToastClasses({ type, color, isVisible }));
  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [toastClasses, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.Toast, testID });
  const a11yAttrs = makeAccessible({ role: 'status', liveRegion: 'polite' });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  function handleActionClick(event: MouseEvent): void {
    event.stopPropagation();
    action?.onClick?.({ event, toastId: id });
  }

  function handleDismissClick(event: MouseEvent): void {
    event.stopPropagation();
    onDismissButtonClick?.({ event, toastId: id });
    if (id) {
      dismissToast(id);
    }
  }
</script>

<div class={combinedClasses} {...metaAttrs} {...a11yAttrs} {...analyticsAttrs}>
  {#if Icon}
    <div class={toastIconWrapperClass}>
      <Icon size="medium" color={iconColorToken} />
    </div>
  {/if}

  <div class={toastContentClass}>
    {#if isPromotional}
      {#if isStringContent}
        {content}
      {:else if snippetContent}
        {@render snippetContent()}
      {/if}
    {:else}
      <BaseText
        as="span"
        color={textColorToken}
        fontSize={75}
        lineHeight={75}
        fontFamily="text"
        fontWeight="regular"
      >
        {#if isStringContent}
          {content}
        {:else if snippetContent}
          {@render snippetContent()}
        {/if}
      </BaseText>
    {/if}

    {#if isPromotional && action}
      <div>
        <Button
          size="xsmall"
          variant={actionButtonProps.variant}
          color={actionButtonProps.color}
          isLoading={action.isLoading}
          onClick={handleActionClick}
          data-analytics-name={MAKE_ANALYTICS_CONSTANTS.TOAST.ACTION_BUTTON}
        >
          {action.text}
        </Button>
      </div>
    {/if}
  </div>

  <div class={toastTrailingClass}>
    {#if !isPromotional && action}
      <div>
        <Button
          size="xsmall"
          variant={actionButtonProps.variant}
          color={actionButtonProps.color}
          isLoading={action.isLoading}
          onClick={handleActionClick}
          data-analytics-name={MAKE_ANALYTICS_CONSTANTS.TOAST.ACTION_BUTTON}
        >
          {action.text}
        </Button>
      </div>
    {/if}
    <button
      type="button"
      class={toastDismissButtonClass}
      onclick={handleDismissClick}
      {...makeAccessible({ label: 'Dismiss toast' })}
    >
      <CloseIcon size="medium" color={iconColorToken} />
    </button>
  </div>
</div>
