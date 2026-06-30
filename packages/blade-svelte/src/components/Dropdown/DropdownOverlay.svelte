<script lang="ts">
  import { untrack } from 'svelte';
  import { computePosition, autoUpdate, offset, flip, size as sizeMiddleware } from '@floating-ui/dom';
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import {
    dropdownOverlayPortalClass,
    getDropdownOverlayClasses,
    getDropdownTemplateClasses,
  } from '@razorpay/blade-core/styles';
  import { portal } from '../../utils/portal';
  import { getDropdownContext } from './dropdownContext';
  import type { DropdownOverlayProps } from './types';

  // Reference template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getDropdownTemplateClasses();

  const OVERLAY_OFFSET = 4; // mainAxis offset in px (matches React's OVERLAY_OFFSET)
  const OVERLAY_PADDING = 12; // rough padding for flip to decide top/bottom

  let {
    children,
    testID,
    zIndex = 1001,
    width,
    minWidth,
    maxWidth,
    referenceRef,
    defaultPlacement = 'bottom-start',
    _isNestedDropdown = false,
    ...dataAnalyticsProps
  }: DropdownOverlayProps = $props();

  const getCtx = getDropdownContext();
  const ctx = $derived(getCtx());

  // Whether overlay behaves as a menu (flexible width) or input-bound (matches input width)
  const isMenu = $derived(
    (ctx.dropdownTriggerer !== 'SelectInput' &&
      ctx.dropdownTriggerer !== 'SearchInput' &&
      ctx.dropdownTriggerer !== 'AutoComplete' &&
      referenceRef == undefined) ||
      _isNestedDropdown,
  );

  let floatingEl = $state<HTMLDivElement | null>(null);
  let isMounted = $state(false);
  let dataState = $state<'open' | 'closed'>('closed');

  let floatingX = $state(0);
  let floatingY = $state(0);

  // Unmount timeout to let close animation finish
  let unmountTimeoutId: ReturnType<typeof setTimeout> | null = null;
  const UNMOUNT_FALLBACK_MS = 240;

  // Track open state changes to drive mount/unmount and dataState.
  // Only ctx.isOpen is tracked as a reactive dependency. All other ctx reads
  // are wrapped in untrack() so arrow-key navigation (which mutates activeIndex etc.)
  // does not cancel and reschedule the open animation rAF.
  $effect(() => {
    const open = ctx.isOpen;

    if (unmountTimeoutId !== null) {
      clearTimeout(unmountTimeoutId);
      unmountTimeoutId = null;
    }

    if (!open) {
      dataState = 'closed';
      if (isMounted) {
        unmountTimeoutId = setTimeout(() => {
          unmountTimeoutId = null;
          untrack(() => {
            if (!ctx.isOpen) isMounted = false;
          });
        }, UNMOUNT_FALLBACK_MS);
      }
      return () => {
        if (unmountTimeoutId !== null) {
          clearTimeout(unmountTimeoutId);
          unmountTimeoutId = null;
        }
      };
    }

    isMounted = true;
    const rafId = requestAnimationFrame(() => {
      dataState = 'open';
    });

    // Focus the triggerer on Safari (non-input focus fix)
    untrack(() => {
      ctx.triggererRef.current?.focus();
    });

    return () => cancelAnimationFrame(rafId);
  });

  function handleTransitionEnd(): void {
    if (!ctx.isOpen && dataState === 'closed') {
      if (unmountTimeoutId !== null) {
        clearTimeout(unmountTimeoutId);
        unmountTimeoutId = null;
      }
      isMounted = false;
    }
  }

  // Floating UI positioning
  $effect(() => {
    const float = floatingEl;
    const isMenuVal = isMenu;
    const placement = defaultPlacement;
    const widthProp = width;
    const minWidthProp = minWidth;
    const maxWidthProp = maxWidth;

    if (!float || !isMounted) return () => {};

    const referenceElement =
      referenceRef ??
      ctx.triggererWrapperRef.current ??
      ctx.triggererRef.current;

    if (!referenceElement) return () => {};

    const update = (): void => {
      computePosition(referenceElement, float, {
        placement,
        strategy: 'fixed',
        middleware: [
          offset({ mainAxis: OVERLAY_OFFSET }),
          flip({ padding: OVERLAY_OFFSET + OVERLAY_PADDING }),
          sizeMiddleware({
            apply({ rects, elements }) {
              const overlayWidth = isMenuVal ? undefined : `${rects.reference.width}px`;
              const overlayMinWidth = isMenuVal ? '240px' : undefined;
              const overlayMaxWidth = isMenuVal ? '400px' : undefined;

              Object.assign(elements.floating.style, {
                width: widthProp ?? overlayWidth,
                minWidth: minWidthProp ?? overlayMinWidth,
                maxWidth: maxWidthProp ?? overlayMaxWidth,
              });
            },
          }),
        ],
      }).then(({ x, y }) => {
        floatingX = x;
        floatingY = y;
      });
    };

    return autoUpdate(referenceElement, float, update);
  });

  // Click-outside dismiss
  function handleClickOutside(e: MouseEvent): void {
    const t = e.target as Node;
    if (
      floatingEl &&
      !floatingEl.contains(t) &&
      ctx.triggererRef.current &&
      !ctx.triggererRef.current.contains(t)
    ) {
      ctx.close();
    }
  }

  // Escape key dismiss
  function handleEscape(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      ctx.close();
    }
  }

  $effect(() => {
    if (ctx.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
    return () => {};
  });

  const overlayClasses = $derived(getDropdownOverlayClasses());

  const portalStyle = $derived(
    [
      `z-index:${zIndex}`,
      `transform:translate3d(${Math.round(floatingX)}px,${Math.round(floatingY)}px,0)`,
      `position:fixed`,
      `top:0`,
      `left:0`,
    ].join(';'),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.DropdownOverlay, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(dataAnalyticsProps));
</script>

{#if isMounted}
  <div
    bind:this={floatingEl}
    class={dropdownOverlayPortalClass}
    style={portalStyle}
    use:portal={document.body}
  >
    <div
      class={overlayClasses}
      data-state={dataState}
      ontransitionend={handleTransitionEnd}
      {...metaAttrs}
      {...analyticsAttrs}
    >
      {@render children()}
    </div>
  </div>
{/if}
