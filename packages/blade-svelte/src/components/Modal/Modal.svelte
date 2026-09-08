<script lang="ts">
  import {
    disableBodyScroll,
    enableBodyScroll,
    clearAllBodyScrollLocks,
  } from 'body-scroll-lock-upgrade';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    logger,
  } from '@razorpay/blade-core/utils';
  import {
    MODAL_Z_INDEX,
    getModalSurfaceClasses,
    getModalTemplateClasses,
    modalWrapperClass,
  } from '@razorpay/blade-core/styles';
  import { portal } from '../../utils/portal';
  import ModalBackdrop from './ModalBackdrop.svelte';
  import { setModalContext } from './modalContext';
  import type { ModalContextValue } from './modalContext';
  import type { ModalProps } from './types';

  /* Anchor structural classes against the bundler's tree-shaker — CSS modules
   * export ESM objects whose unused individual exports otherwise get dropped. */
  void getModalTemplateClasses();

  let {
    isOpen = false,
    children,
    onDismiss,
    isDismissible = true,
    initialFocusRef = null,
    size = 'small',
    accessibilityLabel,
    zIndex = MODAL_Z_INDEX,
    testID,
    ...rest
  }: ModalProps = $props();

  let surfaceEl = $state<HTMLElement | null>(null);
  let defaultFocusEl = $state<HTMLElement | null>(null);
  let originalFocusEl: HTMLElement | null = null;

  /* Presence — DOM stays mounted past `isOpen=false` until the exit transition
   * completes. Mirrors BottomSheet's pattern. */
  let isMounted = $state(false);
  let isVisible = $state(false);
  let unmountTimeoutId: ReturnType<typeof setTimeout> | null = null;
  /* Allow ~320ms (--duration-moderate 280ms + buffer) for the exit transition
   * before unmounting. */
  const UNMOUNT_FALLBACK_MS = 320;

  function returnFocus(): void {
    if (!originalFocusEl) return;
    try {
      originalFocusEl.focus({ preventScroll: true });
    } catch {
      /* ignore — element may have been unmounted. */
    }
    originalFocusEl = null;
  }

  function focusOnInitialRef(): void {
    const target = initialFocusRef ?? defaultFocusEl ?? surfaceEl;
    if (!target) return;
    try {
      target.focus({ preventScroll: true });
    } catch {
      /* ignore */
    }
  }

  function close(): void {
    if (isDismissible) {
      onDismiss?.();
    }
    returnFocus();
  }

  /* Sync controlled open state to internal presence/animation. */
  $effect(() => {
    if (unmountTimeoutId !== null) {
      clearTimeout(unmountTimeoutId);
      unmountTimeoutId = null;
    }
    if (isOpen) {
      isMounted = true;
      if (typeof document !== 'undefined') {
        originalFocusEl = originalFocusEl ?? (document.activeElement as HTMLElement | null);
      }
      const rafId = requestAnimationFrame(() => {
        isVisible = true;
        /* Defer focus to after the close button has mounted. */
        requestAnimationFrame(focusOnInitialRef);
      });
      return () => cancelAnimationFrame(rafId);
    }

    isVisible = false;
    /* Return focus whenever isOpen flips to false, even when driven by the
     * parent directly (not just via close()/onDismiss). */
    returnFocus();
    if (isMounted) {
      unmountTimeoutId = setTimeout(() => {
        unmountTimeoutId = null;
        if (!isOpen) {
          isMounted = false;
        }
      }, UNMOUNT_FALLBACK_MS);
    }
    return () => {
      if (unmountTimeoutId !== null) {
        clearTimeout(unmountTimeoutId);
        unmountTimeoutId = null;
      }
    };
  });

  /* Body scroll lock while mounted. `body-scroll-lock-upgrade` gives us
   * `reserveScrollBarGap: true` (no layout shift) — descendants of the target
   * (the ModalBody) still scroll. */
  $effect(() => {
    if (!surfaceEl) return undefined;
    const target = surfaceEl;
    disableBodyScroll(target, { reserveScrollBarGap: true });
    return () => enableBodyScroll(target);
  });

  $effect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        clearAllBodyScrollLocks();
      }
    };
  });

  let portalWrapperEl = $state<HTMLElement | null>(null);

  /* Make background content inert (or aria-hidden as a fallback) while
   * mounted, so background elements are not focusable/clickable and are
   * hidden from assistive tech. Restored on unmount. */
  $effect(() => {
    if (!isMounted || typeof document === 'undefined' || !portalWrapperEl) return undefined;

    const supportsInert = 'inert' in HTMLElement.prototype;
    const siblings = Array.from(document.body.children).filter(
      (el) => el !== portalWrapperEl,
    ) as HTMLElement[];

    siblings.forEach((el) => {
      if (supportsInert) {
        (el as HTMLElement & { inert: boolean }).inert = true;
      } else {
        el.setAttribute('aria-hidden', 'true');
      }
    });

    return () => {
      siblings.forEach((el) => {
        if (supportsInert) {
          (el as HTMLElement & { inert: boolean }).inert = false;
        } else {
          el.removeAttribute('aria-hidden');
        }
      });
    };
  });

  /* APG requires dialogs to have an accessible name. */
  $effect(() => {
    if (isMounted && !accessibilityLabel) {
      logger({
        message: 'accessibilityLabel is required for Modal to be accessible.',
        type: 'warn',
        moduleName: 'Modal',
      });
    }
  });

  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  /* Escape dismisses (when dismissible); Tab is trapped within the surface. */
  $effect(() => {
    if (!isMounted) return undefined;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        if (isDismissible) close();
        return;
      }
      if (event.key !== 'Tab' || !surfaceEl) return;

      const focusables = Array.from(
        surfaceEl.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusables.length === 0) {
        event.preventDefault();
        surfaceEl.focus({ preventScroll: true });
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !surfaceEl.contains(active)) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else if (active === last || !surfaceEl.contains(active)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  /* Provide context to descendants. The getter returns the live state object so
   * updates propagate automatically. */
  const contextValue: ModalContextValue = {
    isInsideModal: true,
    get isOpen() {
      return isVisible;
    },
    close,
    get isDismissible() {
      return isDismissible;
    },
    setDefaultFocusElement: (el: HTMLElement | null) => {
      defaultFocusEl = el;
    },
  };
  setModalContext(() => contextValue);

  const styledProps = $derived(getStyledPropsClasses(rest));
  const surfaceExtraClasses = $derived((styledProps.classes || []).filter(Boolean).join(' '));
  const surfaceClasses = $derived(
    [getModalSurfaceClasses({ size }), surfaceExtraClasses].filter(Boolean).join(' '),
  );

  const surfaceMetaAttrs = metaAttribute({ name: MetaConstants.Modal, testID });
  const surfaceA11yAttrs = makeAccessible({
    role: 'dialog',
    modal: true,
    label: accessibilityLabel,
  });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const surfaceState = $derived(isVisible ? 'open' : 'closed');
  const wrapperStyle = $derived(`--modal-z-index:${zIndex}`);
</script>

{#if isMounted}
  <div bind:this={portalWrapperEl} use:portal={document.body}>
    <div class={modalWrapperClass} style={wrapperStyle} data-blade-component="modal-wrapper">
      <ModalBackdrop />
      <div
        bind:this={surfaceEl}
        class={surfaceClasses}
        tabindex="-1"
        data-state={surfaceState}
        {...surfaceMetaAttrs}
        {...surfaceA11yAttrs}
        {...analyticsAttrs}
      >
        {@render children()}
      </div>
    </div>
  </div>
{/if}
