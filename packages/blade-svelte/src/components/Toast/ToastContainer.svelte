<script lang="ts">
  import { onMount } from 'svelte';
  import {
    metaAttribute,
    MetaConstants,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    toastContainerClass,
    toastHoverRegionClass,
    toastWrapperClass,
    getToastContainerTemplateClasses,
    getToastWrapperOpacity,
    calculateToastYPosition,
    GUTTER,
    MAX_TOASTS,
    MIN_TOAST_DESKTOP,
    MIN_TOAST_MOBILE,
    TOAST_Z_INDEX,
  } from '@razorpay/blade-core/styles';
  import Toast from './Toast.svelte';
  import {
    toastStore,
    updateToastHeight,
    pauseToast,
    resumeToast,
  } from './toastStore';
  import type { BladeToast, ToastContainerProps } from './types';

  // Prevent tree-shaking of CSS class imports that only appear in templates.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void getToastContainerTemplateClasses();

  let { offsetBottom, zIndex, testID, ...rest }: ToastContainerProps = $props();

  let isMobile = $state(false);
  let hasManuallyExpanded = $state(false);
  let toasts = $state<BladeToast[]>([]);

  // Subscribe to the global toast store and mirror into a `$state` array so
  // the template re-renders on every change.
  $effect(() => {
    const unsubscribe = toastStore.subscribe((value) => {
      toasts = value;
    });
    return () => {
      unsubscribe();
    };
  });

  onMount(() => {
    if (typeof window === 'undefined') return undefined;
    const mq = window.matchMedia('(max-width: 767px)');
    isMobile = mq.matches;
    const handler = (event: MediaQueryListEvent): void => {
      isMobile = event.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  // Always keep promo toasts at the bottom of the stack.
  const infoToasts = $derived(toasts.filter((t) => t.type !== 'promotional'));
  const promoToasts = $derived(toasts.filter((t) => t.type === 'promotional'));
  const recomputedToasts = $derived([...infoToasts, ...promoToasts]);

  const visibleInfoToasts = $derived(infoToasts.filter((t) => t.visible));
  const frontToastHeight = $derived(visibleInfoToasts[0]?.height ?? 0);

  const minToasts = $derived(isMobile ? MIN_TOAST_MOBILE : MIN_TOAST_DESKTOP);
  const isExpanded = $derived(hasManuallyExpanded || recomputedToasts.length <= minToasts);

  const hasPromoToast = $derived(promoToasts.length > 0 && Boolean(promoToasts[0]?.visible));
  const promoToastHeight = $derived(promoToasts[0]?.height ?? 0);

  // Total height when expanded — used to size the hover-capture region so the
  // mouse never falls into the GUTTER between toasts and triggers a leave.
  const totalHeight = $derived(
    recomputedToasts
      .filter((t) => t.visible)
      .reduce((sum, t) => sum + (t.height ?? 0), 0) + recomputedToasts.length * GUTTER,
  );

  const containerZIndex = $derived(zIndex ?? TOAST_Z_INDEX);

  // Container bottom-offset CSS var: explicit `offsetBottom` wins; otherwise
  // CSS-default mobile gutter (16px) / desktop gutter (24px) handled in the
  // CSS module.
  const containerStyle = $derived.by(() => {
    const parts: string[] = [];
    parts.push(`--toast-container-zindex: ${containerZIndex}`);
    if (typeof offsetBottom === 'number') {
      parts.push(`bottom: ${offsetBottom}px`);
    }
    return parts.join('; ');
  });

  const hoverRegionStyle = $derived(
    `--hover-region-bottom: ${promoToastHeight}px; --hover-region-height: ${
      isExpanded ? Math.max(0, totalHeight - promoToastHeight) : frontToastHeight
    }px`,
  );

  function handleMouseEnter(): void {
    if (isMobile) return;
    hasManuallyExpanded = true;
    pauseToast();
  }

  function handleMouseLeave(): void {
    if (isMobile) return;
    hasManuallyExpanded = false;
    resumeToast();
  }

  function handleToastClick(): void {
    if (!isMobile) return;
    const next = !hasManuallyExpanded;
    hasManuallyExpanded = next;
    if (next) {
      pauseToast();
    } else {
      resumeToast();
    }
  }

  function getWrapperStyle(toast: BladeToast, index: number): string {
    const isPromotional = toast.type === 'promotional';
    const toastIndex = visibleInfoToasts.findIndex((t) => t.id === toast.id);
    const toastsBefore =
      toastIndex >= 0
        ? visibleInfoToasts.filter((_, i) => i < toastIndex).length
        : 0;
    const heightsBefore =
      toastIndex >= 0
        ? visibleInfoToasts
            .filter((_, i) => i < toastIndex)
            .map((t) => t.height ?? 0)
        : [];

    const { offset, scale } = calculateToastYPosition({
      index,
      toastsBefore,
      isExpanded,
      hasPromoToast,
      promoToastHeight,
      isPromotional,
      heightsBefore,
    });

    const opacity = getToastWrapperOpacity({
      index,
      isVisible: toast.visible,
      isExpanded,
      isPromotional,
    });

    let toastHeight = toast.height;
    // Only force-size a back toast to `frontToastHeight` once it has been
    // measured. If an unmeasured toast were force-sized first, its initial
    // `clientHeight` reading would be the forced value (often 0 before the
    // front toast has measured) and `syncHeight` would lock that in as its
    // natural height — clipping the toast forever after.
    if (
      index > MAX_TOASTS - 1 &&
      !isPromotional &&
      !isExpanded &&
      typeof toast.height === 'number'
    ) {
      toastHeight = frontToastHeight;
    }
    const wrapperZIndex = -1 * index;

    const heightDecl = typeof toastHeight === 'number' ? `${toastHeight}px` : 'auto';
    return [
      `--toast-offset: ${offset}px`,
      `--toast-scale: ${scale}`,
      `--toast-zindex: ${wrapperZIndex}`,
      `--toast-height: ${heightDecl}`,
      `--toast-opacity: ${opacity}`,
    ].join('; ');
  }

  function handleWrapperMouseEnter(toast: BladeToast): void {
    if (toast.type === 'promotional') return;
    handleMouseEnter();
  }

  function handleWrapperMouseLeave(toast: BladeToast): void {
    if (toast.type === 'promotional') return;
    handleMouseLeave();
  }

  function handleWrapperClick(toast: BladeToast): void {
    if (toast.type === 'promotional') return;
    handleToastClick();
  }

  // Mirror the React reference (`ToastContainer.web.tsx`): measure each toast
  // exactly once on first paint. The wrapper's `height` is driven by
  // `--toast-height` (set from `toast.height`), and in collapsed view the
  // wrapper is force-sized to `frontToastHeight`. If we kept reacting to every
  // `clientHeight` change, that forced (smaller) value would be written back
  // into the store, clobbering the toast's true natural height — taller toasts
  // would then be clipped to the height of the newest one.
  function syncHeight(id: string, height: number | null | undefined): void {
    if (typeof height !== 'number' || Number.isNaN(height)) return;
    const current = toasts.find((t) => t.id === id);
    if (!current || typeof current.height === 'number') return;
    updateToastHeight(id, height);
  }

  const styledProps = $derived(getStyledPropsClasses(rest));
  const combinedClasses = $derived(
    [toastContainerClass, ...(styledProps.classes || [])].filter(Boolean).join(' '),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.ToastContainer, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  class={combinedClasses}
  style={containerStyle}
  {...metaAttrs}
  {...analyticsAttrs}
>
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class={toastHoverRegionClass}
    style={hoverRegionStyle}
    data-expanded={isExpanded}
    data-testid="toast-mouseover-container"
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
    onclick={handleToastClick}
  ></div>

  {#each recomputedToasts as toast, index (toast.id)}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={toastWrapperClass}
      style={getWrapperStyle(toast, index)}
      data-visible={toast.visible}
      bind:clientHeight={null, (h) => syncHeight(toast.id, h)}
      onmouseenter={() => handleWrapperMouseEnter(toast)}
      onmouseleave={() => handleWrapperMouseLeave(toast)}
      onclick={() => handleWrapperClick(toast)}
    >
      <Toast
        type={toast.type}
        color={toast.color}
        leading={toast.leading}
        action={toast.action}
        content={toast.content}
        onDismissButtonClick={toast.onDismissButtonClick}
        isVisible={toast.visible}
        id={toast.id}
        testID={toast.testID}
      />
    </div>
  {/each}
</div>
