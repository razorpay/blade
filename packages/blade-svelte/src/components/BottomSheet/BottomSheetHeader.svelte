<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
  } from '@razorpay/blade-core/utils';
  import {
    bottomSheetHeaderClass,
    bottomSheetHeaderContentClass,
    bottomSheetHeaderLeadingClass,
    bottomSheetHeaderTitleBlockClass,
    bottomSheetHeaderTitleRowClass,
    bottomSheetHeaderTrailingClass,
    bottomSheetHeaderBackButtonClass,
    bottomSheetHeaderCloseButtonClass,
    bottomSheetHeaderDividerClass,
    bottomSheetEmptyHeaderClass,
    bottomSheetEmptyHeaderFloatingClass,
    bottomSheetCloseButtonCapsuleClass,
    bottomSheetCloseButtonCapsuleFloatingClass,
    bottomSheetCloseButtonClass,
  } from '@razorpay/blade-core/styles';
  import { CloseIcon } from '../Icons/CloseIcon';
  import { ChevronLeftIcon } from '../Icons/ChevronLeftIcon';
  import Text from '../Typography/Text/Text.svelte';
  import { getBottomSheetContext } from './bottomSheetContext';
  import type { BottomSheetHeaderProps } from './types';

  let {
    title,
    subtitle,
    leading,
    trailing,
    titleSuffix,
    showBackButton = false,
    onBackButtonClick,
    children,
    testID,
    ...rest
  }: BottomSheetHeaderProps = $props();

  const ctx = getBottomSheetContext();

  let headerEl = $state<HTMLDivElement | null>(null);
  let closeButtonEl = $state<HTMLButtonElement | null>(null);

  const isHeaderEmpty = $derived(
    !(title || subtitle || leading || trailing || showBackButton || children),
  );

  /* Report empty-header state up to the parent so it can decide whether the
   * grab handle floats over the body (matches React's `isHeaderFloating`
   * derivation). */
  $effect(() => {
    ctx?.setIsHeaderEmpty(isHeaderEmpty);
  });

  /* Measure the header height after mount/open so the parent can size its
   * total content. Mirrors React's `useIsomorphicLayoutEffect` measurement.
   * Run for any non-empty header (covers leading/trailing/showBackButton/children
   * cases too — not just title/subtitle) so snap-point math always accounts for
   * the rendered header. */
  $effect(() => {
    if (!headerEl) return;
    if (isHeaderEmpty) return;
    // Re-run on isOpen toggle by reading it.
    void ctx?.isOpen;
    ctx?.setHeaderHeight(headerEl.getBoundingClientRect().height);
  });

  /* Register the close button as the default focus target whenever the
   * header is non-empty and dismissible. The parent uses this when
   * `initialFocusElement` is null. */
  $effect(() => {
    if (closeButtonEl && ctx?.isDismissible !== false) {
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

  function handleBackButtonClick(): void {
    onBackButtonClick?.();
  }

  const metaAttrs = metaAttribute({ name: MetaConstants.BottomSheetHeader, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const isHeaderFloating = $derived(Boolean(ctx?.isHeaderFloating));
  const isDismissible = $derived(ctx?.isDismissible ?? true);

  const emptyHeaderClasses = $derived(
    [bottomSheetEmptyHeaderClass, isHeaderFloating ? bottomSheetEmptyHeaderFloatingClass : '']
      .filter(Boolean)
      .join(' '),
  );

  const closeCapsuleClasses = $derived(
    [
      bottomSheetCloseButtonCapsuleClass,
      isHeaderFloating ? bottomSheetCloseButtonCapsuleFloatingClass : '',
    ]
      .filter(Boolean)
      .join(' '),
  );
</script>

<div
  bind:this={headerEl}
  class={bottomSheetHeaderClass}
  data-empty={isHeaderEmpty}
  {...metaAttrs}
  {...analyticsAttrs}
>
  {#if isHeaderEmpty}
    <div class={emptyHeaderClasses}>
      {#if isDismissible}
        <div class={closeCapsuleClasses}>
          <button
            bind:this={closeButtonEl}
            type="button"
            class={bottomSheetCloseButtonClass}
            onclick={handleClose}
            {...makeAccessible({ label: 'Close' })}
          >
            <CloseIcon size="large" color="currentColor" />
          </button>
        </div>
      {/if}
    </div>
  {:else}
    <div class={bottomSheetHeaderContentClass}>
      {#if showBackButton}
        <button
          type="button"
          class={bottomSheetHeaderBackButtonClass}
          onclick={handleBackButtonClick}
          {...makeAccessible({ label: 'Back' })}
        >
          <ChevronLeftIcon size="large" color="currentColor" />
        </button>
      {/if}

      {#if leading}
        <div class={bottomSheetHeaderLeadingClass}>
          {@render leading()}
        </div>
      {/if}

      <div class={bottomSheetHeaderTitleBlockClass}>
        {#if title}
          <div class={bottomSheetHeaderTitleRowClass}>
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
          <Text
            variant="body"
            size="small"
            weight="regular"
            color="surface.text.gray.muted"
          >
            {subtitle}
          </Text>
        {/if}
      </div>

      {#if trailing}
        <div class={bottomSheetHeaderTrailingClass}>
          {@render trailing()}
        </div>
      {/if}

      {#if isDismissible}
        <button
          bind:this={closeButtonEl}
          type="button"
          class={bottomSheetHeaderCloseButtonClass}
          onclick={handleClose}
          {...makeAccessible({ label: 'Close' })}
        >
          <CloseIcon size="large" color="currentColor" />
        </button>
      {/if}
    </div>

    {#if children}
      {@render children()}
    {/if}

    <div class={bottomSheetHeaderDividerClass} role="separator"></div>
  {/if}
</div>
