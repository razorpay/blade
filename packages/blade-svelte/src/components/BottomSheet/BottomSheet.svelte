<script lang="ts">
  import { onMount } from 'svelte';
  import { DragGesture, rubberbandIfOutOfBounds } from '@use-gesture/vanilla';
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
  } from '@razorpay/blade-core/utils';
  import {
    BOTTOM_SHEET_Z_INDEX,
    BOTTOM_SHEET_DEFAULT_SNAP_POINTS,
    bottomSheetSurfaceClass,
    bottomSheetInnerWrapperClass,
    bottomSheetGrabHandleClass,
    bottomSheetGrabHandleFloatingClass,
    getBottomSheetTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { portal } from '../../utils/portal';
  import {
    bottomSheetStack,
    addBottomSheetToStack,
    removeBottomSheetFromStack,
  } from './bottomSheetStack';
  import { setBottomSheetContext } from './bottomSheetContext';
  import type { BottomSheetContextValue } from './bottomSheetContext';
  import type { BottomSheetProps, SnapPoints } from './types';
  import { computeMaxContent, computeSnapPointBounds } from './utils';
  import BottomSheetBackdrop from './BottomSheetBackdrop.svelte';

  /* Anchor structural classes against the Rollup tree-shaker — CSS modules
   * export ESM objects whose unused individual exports otherwise get
   * dropped from the build.
   * eslint-disable-next-line @typescript-eslint/no-unused-vars */
  void getBottomSheetTemplateClasses();

  let {
    isOpen = false,
    onDismiss,
    children,
    initialFocusElement = null,
    snapPoints = [...BOTTOM_SHEET_DEFAULT_SNAP_POINTS] as SnapPoints,
    isDismissible = true,
    zIndex = BOTTOM_SHEET_Z_INDEX,
    testID,
    ...rest
  }: BottomSheetProps = $props();

  /* Stable id for the stack — `crypto.randomUUID()` falls back to a Math.random
   * suffix so jsdom (without crypto) still produces a unique value. */
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `bottomsheet-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  let grabHandleEl = $state<HTMLDivElement | null>(null);
  let scrollEl = $state<HTMLElement | null>(null);
  let defaultFocusEl = $state<HTMLElement | null>(null);
  let originalFocusEl: HTMLElement | null = null;

  /* Measured heights of children (reported via context). */
  let contentHeight = $state(0);
  let headerHeight = $state(0);
  let footerHeight = $state(0);
  let grabHandleHeight = $state(0);

  /* UI state. */
  let positionY = $state(0);
  let isDragging = $state(false);
  let hasBodyPadding = $state(true);
  let isHeaderEmpty = $state(false);
  let windowHeight = $state(typeof window !== 'undefined' ? window.innerHeight : 800);

  /* Presence — DOM stays mounted past `isOpen=false` until the exit
   * transition completes. Mirrors Tooltip's pattern. */
  let isMounted = $state(false);
  let isVisible = $state(false);
  let unmountTimeoutId: ReturnType<typeof setTimeout> | null = null;
  /* Allow ~320ms (--duration-moderate 280ms + buffer) for the exit
   * transition before unmounting. */
  const UNMOUNT_FALLBACK_MS = 320;

  /* Mirrors React's `preventScrollingRef` — set during drag to gate the
   * body's scroll/touchmove listeners below. */
  let preventScrolling = $state(true);

  /* Track stack for reactive z-index. */
  let stackArr = $state<string[]>([]);
  $effect(() => {
    const unsubscribe = bottomSheetStack.subscribe((value) => {
      stackArr = value;
    });
    return unsubscribe;
  });

  const currentStackIndex = $derived(stackArr.indexOf(id));
  const isOnTopOfStack = $derived(stackArr[0] === id);
  const bottomSheetZIndex = $derived(zIndex - Math.max(0, currentStackIndex));

  const totalHeight = $derived(grabHandleHeight + headerHeight + footerHeight + contentHeight);

  let initialSnapPointFraction = $state(snapPoints[1]);

  /* Adjust the initial snap point so a small total content sits on the
   * lowest snap point, otherwise stays on the middle one. Mirrors React. */
  $effect(() => {
    const middleSnapPoint = snapPoints[1] * windowHeight;
    const lowerSnapPoint = snapPoints[0] * windowHeight;
    if (totalHeight > lowerSnapPoint && totalHeight < middleSnapPoint) {
      initialSnapPointFraction = snapPoints[0];
    } else {
      initialSnapPointFraction = snapPoints[1];
    }
  });

  function setPositionY(value: number, limit = true): void {
    if (!limit) {
      positionY = value;
      return;
    }
    const maxValue = computeMaxContent({
      contentHeight,
      footerHeight,
      headerHeight: headerHeight > 0 ? headerHeight + grabHandleHeight : 0,
      maxHeight: value,
    });
    positionY = maxValue;
  }

  function returnFocus(): void {
    if (!originalFocusEl) return;
    try {
      originalFocusEl.focus();
    } catch {
      /* ignore — element may have been unmounted. */
    }
    originalFocusEl = null;
  }

  function focusOnInitialRef(): void {
    const target = initialFocusElement ?? defaultFocusEl;
    if (!target) return;
    try {
      target.focus();
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

  function handleOnOpen(): void {
    setPositionY(windowHeight * initialSnapPointFraction);
    if (typeof document !== 'undefined') {
      originalFocusEl = originalFocusEl ?? (document.activeElement as HTMLElement | null);
    }
    /* Defer focus to after first paint so the close button has mounted. */
    requestAnimationFrame(() => {
      requestAnimationFrame(focusOnInitialRef);
    });
  }

  function handleOnClose(): void {
    setPositionY(0, false);
  }

  /* Sync controlled open state to internal animation/position. */
  $effect(() => {
    if (unmountTimeoutId !== null) {
      clearTimeout(unmountTimeoutId);
      unmountTimeoutId = null;
    }
    if (isOpen) {
      isMounted = true;
      /* Defer to next frame so the animation runs on first render. */
      const rafId = requestAnimationFrame(() => {
        isVisible = true;
        handleOnOpen();
      });
      return () => cancelAnimationFrame(rafId);
    }

    isVisible = false;
    handleOnClose();
    if (isMounted) {
      unmountTimeoutId = setTimeout(() => {
        unmountTimeoutId = null;
        if (!isOpen) {
          isMounted = false;
          /* Reset measured heights so re-open replays the entrance animation. */
          headerHeight = 0;
          footerHeight = 0;
          contentHeight = 0;
          grabHandleHeight = 0;
          positionY = 0;
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

  /* Stack registration. */
  $effect(() => {
    if (isMounted) {
      addBottomSheetToStack(id);
      return () => removeBottomSheetFromStack(id);
    }
    return undefined;
  });

  /* Body scroll lock — defer to `body-scroll-lock-upgrade` so we get
   * `reserveScrollBarGap: true` (no layout shift on Windows / non-overlay
   * scrollbars) and proper iOS Safari momentum handling. Mirrors React's
   * `useScrollLock({ targetRef: scrollRef, reserveScrollBarGap: true })`. */
  $effect(() => {
    if (!scrollEl) return undefined;
    const target = scrollEl;
    const isReady = contentHeight > 0;
    const shouldLock = isReady && stackArr.length > 0;
    if (shouldLock) {
      disableBodyScroll(target, { reserveScrollBarGap: true });
      return () => enableBodyScroll(target);
    }
    return undefined;
  });

  /* Belt-and-braces: clear all body locks when the last sheet unmounts
   * (matches React's `clearAllBodyScrollLocks()` cleanup). */
  $effect(() => {
    if (stackArr.length === 0 && typeof document !== 'undefined') {
      clearAllBodyScrollLocks();
    }
  });

  /* Track viewport height for snap-point math. */
  onMount(() => {
    if (typeof window === 'undefined') return undefined;
    windowHeight = window.innerHeight;
    const handler = (): void => {
      windowHeight = window.innerHeight;
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });

  /* Measure grab handle height (matches React's effect). */
  $effect(() => {
    if (!grabHandleEl) return;
    void isOpen;
    const cs = getComputedStyle(grabHandleEl);
    const marginBottom = parseFloat(cs.marginBottom) || 0;
    grabHandleHeight = grabHandleEl.getBoundingClientRect().height + marginBottom;
  });

  /* Escape key dismisses the top sheet (when dismissible). */
  $effect(() => {
    if (!isMounted) return undefined;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Escape') return;
      if (!isOnTopOfStack) return;
      if (!isDismissible) return;
      close();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  /* Prevent body scrolling for over-pull on iOS Safari. Kept as-is — the
   * scroll-lock library handles the page-level overscroll, but this still
   * suppresses the rare sub-pixel negative-scrollTop case on touchstart. */
  $effect(() => {
    if (!scrollEl) return undefined;
    const node = scrollEl;
    function preventOverscroll(event: Event): void {
      if (node.scrollTop < 0) event.preventDefault();
    }
    node.addEventListener('touchstart', preventOverscroll, { passive: false });
    return () => node.removeEventListener('touchstart', preventOverscroll);
  });

  /* Drag handler — verbatim port of React's `useDrag` body
   * (BottomSheet.web.tsx lines 248–368). Receives `isContentDragging` as
   * a positional arg so we can wire two `DragGesture` instances (grab handle
   * vs. content scroll element) instead of using `bind(args)` (which has no
   * vanilla equivalent). */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  function runDragHandler(state: any, isContentDragging: boolean): void {
    const {
      active,
      last,
      cancel,
      tap,
      movement: [, movementY],
      velocity: [, velocityY],
      lastOffset: [, lastOffsetY],
      down,
      dragging,
      event,
    } = state;

    /* Escape hatch — components like SpinWheel can opt out of drag
     * interception via `[data-allow-scroll]`. */
    const touchTarget = event?.target as Element | undefined;
    const isScrollableContent = touchTarget?.closest('[data-allow-scroll]');
    if (isScrollableContent) {
      return;
    }

    isDragging = Boolean(dragging);

    const rawY = lastOffsetY - movementY;
    const lowerSnapPoint = windowHeight * snapPoints[0];
    const upperSnapPoint = windowHeight * snapPoints[snapPoints.length - 1];

    /* Velocity-driven momentum — same formula as React. */
    const predictedDistance = movementY * (velocityY / 2);
    const predictedY = Math.max(
      lowerSnapPoint,
      Math.min(upperSnapPoint, rawY - predictedDistance * 2),
    );

    let newY = rawY;

    if (down) {
      const dampening = 0.55;
      if (totalHeight < upperSnapPoint) {
        newY = rubberbandIfOutOfBounds(rawY, 0, totalHeight, dampening);
      } else {
        newY = rubberbandIfOutOfBounds(rawY, 0, upperSnapPoint, dampening);
      }
    } else {
      newY = predictedY;
    }

    const isPosAtUpperSnapPoint = newY >= upperSnapPoint;

    if (isContentDragging) {
      if (isPosAtUpperSnapPoint) {
        newY = upperSnapPoint;
      }

      /* Pin to upper snap point while content isn't scrolled to top — keeps
       * the scroll feel natural when crossing the boundary between sheet
       * drag and content scroll. */
      const isContentScrolledAtTop = scrollEl != null && scrollEl.scrollTop <= 0;
      if (lastOffsetY === upperSnapPoint && !isContentScrolledAtTop) {
        newY = upperSnapPoint;
      }
      preventScrolling = newY < upperSnapPoint;
    }

    if (last) {
      const [nearest, lower] = computeSnapPointBounds(
        newY,
        snapPoints.map((point) => windowHeight * point) as SnapPoints,
      );

      const lowerPointBuffer = 60;
      const lowerestSnap = Math.min(lower, totalHeight) - lowerPointBuffer;
      const shouldClose = rawY < lowerestSnap;

      if (shouldClose) {
        if (isDismissible) {
          isDragging = false;
          cancel();
          close();
          return;
        }
        isDragging = false;
        cancel();
        const firstSnapPoint = windowHeight * snapPoints[0];
        setPositionY(firstSnapPoint, true);
        return;
      }

      /* `filterTaps: true` makes taps fire with `last: true, tap: true` —
       * skip the snap-to-nearest branch so a tap doesn't trigger a flicker. */
      if (!active && !tap) {
        newY = nearest;
      }
    }

    setPositionY(newY, !down);
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  /* Wire `DragGesture` instances reactively. We attach to the same elements
   * React binds: the grab handle (with no `args`, so `isContentDragging` is
   * false) and the body's scroll element (with `isContentDragging: true`).
   * `from` is a getter so each drag-start picks up the *current* `positionY`. */
  $effect(() => {
    if (!grabHandleEl) return undefined;
    if (!isOnTopOfStack || !isOpen) return undefined;
    const gesture = new DragGesture(
      grabHandleEl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: any) => runDragHandler(state, false),
      { from: () => [0, positionY], filterTaps: true },
    );
    return () => gesture.destroy();
  });

  $effect(() => {
    if (!scrollEl) return undefined;
    if (!isOnTopOfStack || !isOpen) return undefined;
    const gesture = new DragGesture(
      scrollEl,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state: any) => runDragHandler(state, true),
      { from: () => [0, positionY], filterTaps: true },
    );
    return () => gesture.destroy();
  });

  /* Gate scroll/touchmove on the body while we're not at the upper snap
   * point — mirrors React's `preventScrollingRef`-driven listener. */
  $effect(() => {
    if (!scrollEl) return undefined;
    const node = scrollEl;
    function preventScrollingHandler(event: Event): void {
      if (!preventScrolling) return;
      const target = event.target as Element | null;
      const isAllowedComponent = target?.closest('[data-allow-scroll]');
      if (!isAllowedComponent) {
        event.preventDefault();
      }
    }
    node.addEventListener('scroll', preventScrollingHandler);
    node.addEventListener('touchmove', preventScrollingHandler);
    return () => {
      node.removeEventListener('scroll', preventScrollingHandler);
      node.removeEventListener('touchmove', preventScrollingHandler);
    };
  });

  /* Provide context to descendants. The getter returns the live state object
   * so updates propagate automatically. */
  const contextValue: BottomSheetContextValue = {
    isInBottomSheet: true,
    get isOpen() {
      return isVisible;
    },
    close,
    get isHeaderFloating() {
      return !hasBodyPadding && isHeaderEmpty;
    },
    get isDismissible() {
      return isDismissible;
    },
    setContentHeight: (h: number) => {
      contentHeight = h;
    },
    setHeaderHeight: (h: number) => {
      headerHeight = h;
    },
    setFooterHeight: (h: number) => {
      footerHeight = h;
    },
    setHasBodyPadding: (has: boolean) => {
      hasBodyPadding = has;
    },
    setIsHeaderEmpty: (empty: boolean) => {
      isHeaderEmpty = empty;
    },
    setScrollElement: (el: HTMLElement | null) => {
      scrollEl = el;
    },
    setDefaultFocusElement: (el: HTMLElement | null) => {
      defaultFocusEl = el;
    },
  };
  setBottomSheetContext(() => contextValue);

  const surfaceStyle = $derived(
    [`--bs-position-y:${positionY}px`, `--bs-z-index:${bottomSheetZIndex}`].join(';'),
  );

  const styledProps = $derived(getStyledPropsClasses(rest));
  const surfaceExtraClasses = $derived((styledProps.classes || []).filter(Boolean).join(' '));

  const grabHandleClasses = $derived(
    [bottomSheetGrabHandleClass, !hasBodyPadding && isHeaderEmpty ? bottomSheetGrabHandleFloatingClass : '']
      .filter(Boolean)
      .join(' '),
  );

  const surfaceMetaAttrs = metaAttribute({
    name: MetaConstants.BottomSheet,
    testID: testID ?? 'bottomsheet-surface',
  });
  const surfaceA11yAttrs = makeAccessible({ modal: true, role: 'dialog' });
  const grabHandleMetaAttrs = metaAttribute({ name: MetaConstants.BottomSheetGrabHandle });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const surfaceState = $derived(isVisible ? 'open' : 'closed');
</script>

{#if isMounted}
  <div use:portal={document.body}>
    <BottomSheetBackdrop
      isOpen={isVisible}
      zIndex={bottomSheetZIndex}
      {isDismissible}
      onClose={close}
    />
    <div
      class="{bottomSheetSurfaceClass} {surfaceExtraClasses}"
      style={surfaceStyle}
      data-state={surfaceState}
      data-dragging={isDragging}
      {...surfaceMetaAttrs}
      {...surfaceA11yAttrs}
      {...analyticsAttrs}
    >
      <div class={bottomSheetInnerWrapperClass}>
        <div bind:this={grabHandleEl} class={grabHandleClasses} {...grabHandleMetaAttrs}></div>
        {@render children()}
      </div>
    </div>
  </div>
{/if}
