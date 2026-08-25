<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    modalHeaderClass,
    modalEmptyHeaderCapsuleClass,
    modalHeaderContentClass,
    modalHeaderLeadingClass,
    modalHeaderTitleBlockClass,
    modalHeaderTitleRowClass,
    modalHeaderTrailingClass,
    modalCloseButtonClass,
    modalHeaderCloseButtonClass,
    modalHeaderDividerClass,
  } from '@razorpay/blade-core/styles';
  import { CloseIcon } from '../Icons/CloseIcon';
  import Text from '../Typography/Text/Text.svelte';
  import { getModalContext } from './modalContext';
  import type { ModalHeaderProps } from './types';

  let {
    title,
    subtitle,
    leading,
    trailing,
    titleSuffix,
    testID,
    ...rest
  }: ModalHeaderProps = $props();

  const ctx = getModalContext();

  let closeButtonEl = $state<HTMLButtonElement | null>(null);

  const isHeaderEmpty = $derived(!(title || subtitle || leading || trailing));
  const isDismissible = $derived(ctx?.isDismissible ?? true);

  /* Register the close button as the default focus target when dismissible.
   * The parent uses this when `initialFocusRef` is null. */
  $effect(() => {
    if (closeButtonEl && isDismissible) {
      ctx?.setDefaultFocusElement(closeButtonEl);
      return () => {
        ctx?.setDefaultFocusElement(null);
      };
    }
    return undefined;
  });

  function handleClose(): void {
    ctx?.close();
  }

  const metaAttrs = metaAttribute({ name: MetaConstants.ModalHeader, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const closeButtonClasses = $derived(
    [modalCloseButtonClass, modalHeaderCloseButtonClass].join(' '),
  );
</script>

<div class={modalHeaderClass} {...metaAttrs} {...analyticsAttrs}>
  {#if isHeaderEmpty}
    {#if isDismissible}
      <div class={modalEmptyHeaderCapsuleClass}>
        <button
          bind:this={closeButtonEl}
          type="button"
          class={modalCloseButtonClass}
          onclick={handleClose}
          {...makeAccessible({ label: 'Close' })}
        >
          <CloseIcon size="large" color="currentColor" />
        </button>
      </div>
    {/if}
  {:else}
    <div class={modalHeaderContentClass}>
      {#if leading}
        <div class={modalHeaderLeadingClass}>
          {@render leading()}
        </div>
      {/if}

      <div class={modalHeaderTitleBlockClass}>
        {#if title}
          <div class={modalHeaderTitleRowClass}>
            <Text
              size="large"
              weight="semibold"
              marginTop="1px"
              color="surface.text.gray.normal"
              wordBreak="break-word"
            >
              {title}
            </Text>
            {#if titleSuffix}
              {@render titleSuffix()}
            {/if}
          </div>
        {/if}
        {#if subtitle}
          <Text variant="body" size="small" weight="regular" color="surface.text.gray.muted">
            {subtitle}
          </Text>
        {/if}
      </div>

      {#if trailing}
        <div class={modalHeaderTrailingClass}>
          {@render trailing()}
        </div>
      {/if}

      {#if isDismissible}
        <button
          bind:this={closeButtonEl}
          type="button"
          class={closeButtonClasses}
          onclick={handleClose}
          {...makeAccessible({ label: 'Close' })}
        >
          <CloseIcon size="large" color="currentColor" />
        </button>
      {/if}
    </div>

    <div class={modalHeaderDividerClass} role="separator"></div>
  {/if}
</div>
