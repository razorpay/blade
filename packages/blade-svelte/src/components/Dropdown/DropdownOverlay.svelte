<script lang="ts">
  import { computePosition, autoUpdate, offset, flip, size as sizeMiddleware } from '@floating-ui/dom';
  import { metaAttribute, MetaConstants, makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import {
    getDropdownOverlayClasses,
    getDropdownTemplateClasses,
    dropdownFloatingClass,
  } from '@razorpay/blade-core/styles';
  import { portal } from '../../utils/portal';
  import OverlayContextReset from '../OverlayContextReset/OverlayContextReset.svelte';
  import { getBottomSheetContext } from '../BottomSheet/bottomSheetContext';
  import { getDropdownContext } from './dropdownContext';
  import type { DropdownOverlayProps } from './types';

  // Prevent tree-shaking of template classes used in compound selectors.
  void getDropdownTemplateClasses();

  // React parity: `OVERLAY_OFFSET` / `OVERLAY_TRANSITION_OFFSET` = size['8'] = 8;
  // `OVERLAY_PADDING` = size['12'] used as flip padding.
  const OVERLAY_OFFSET = 8;
  const OVERLAY_PADDING = 12;

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
    ...rest
  }: DropdownOverlayProps = $props();

  const dropdown = getDropdownContext();
  const bottomSheet = getBottomSheetContext();
  const isInBottomSheet = $derived(bottomSheet?.isInBottomSheet ?? false);

  const isOpen = $derived(dropdown?.isOpen ?? false);

  const reference = $derived(referenceRef ?? dropdown?.triggererWrapperEl ?? dropdown?.triggererEl ?? null);

  // React parity: React excludes only SelectInput / SearchInput / AutoComplete
  // from isMenu — NOT InputDropdownButton. Those triggers don't exist in this
  // Svelte partial yet, so isMenu is true for every current trigger when no
  // explicit referenceRef is passed. The a11y roles (listbox/option for
  // InputDropdownButton) are governed separately by isRoleMenu in
  // getA11yRoles.ts, keeping width and a11y concerns decoupled.
  const isMenu = $derived(!referenceRef || _isNestedDropdown);

  let floatingEl = $state<HTMLDivElement | null>(null);
  let floatingX = $state(0);
  let floatingY = $state(0);
  let referenceWidth = $state<number | null>(null);
  // Flip result — picks the enter/exit keyframe so the overlay slides in from the
  // side it opens (top-placed slides up).
  let placementSide = $state<'top' | 'bottom'>('bottom');

  // Visibility: the portal node is always mounted (so ActionList options stay
  // registered even while closed); `isActive` toggles display + drives the
  // enter/exit transition via `data-state`.
  let isActive = $state(false);
  // 'initial' = pre-reveal (no animation) — held until the placement side resolves
  // so the enter animation runs for the correct side. Enter path: closed→initial→open.
  let dataState = $state<'open' | 'closed' | 'initial'>('closed');
  let unmountTimeoutId: ReturnType<typeof setTimeout> | null = null;
  const UNMOUNT_FALLBACK_MS = 240;

  $effect(() => {
    if (unmountTimeoutId !== null) {
      clearTimeout(unmountTimeoutId);
      unmountTimeoutId = null;
    }
    if (!isOpen) {
      dataState = 'closed';
      if (isActive) {
        unmountTimeoutId = setTimeout(() => {
          unmountTimeoutId = null;
          if (!isOpen) isActive = false;
        }, UNMOUNT_FALLBACK_MS);
      }
      return () => {
        if (unmountTimeoutId !== null) {
          clearTimeout(unmountTimeoutId);
          unmountTimeoutId = null;
        }
      };
    }
    isActive = true;
    if (dataState !== 'open') dataState = 'initial';
    return () => {};
  });

  function handleSurfaceAnimationEnd(): void {
    if (!isOpen && dataState === 'closed') {
      if (unmountTimeoutId !== null) {
        clearTimeout(unmountTimeoutId);
        unmountTimeoutId = null;
      }
      isActive = false;
    }
  }

  // Focus the trigger on open (Safari doesn't focus non-input triggers on click).
  $effect(() => {
    if (isOpen) {
      dropdown?.triggererEl?.focus();
    }
  });

  // Floating UI positioning — active only while the overlay is visible.
  $effect(() => {
    const ref = reference;
    const float = floatingEl;
    const placement = defaultPlacement;
    if (!ref || !float || !isActive) return () => {};

    const update = (): void => {
      computePosition(ref, float, {
        placement,
        strategy: 'fixed',
        middleware: [
          offset({ mainAxis: OVERLAY_OFFSET }),
          flip({ padding: OVERLAY_OFFSET + OVERLAY_PADDING }),
          sizeMiddleware({
            apply({ rects }) {
              referenceWidth = rects.reference.width;
            },
          }),
        ],
      }).then(({ x, y, placement: resolvedPlacement }) => {
        floatingX = x;
        floatingY = y;
        placementSide = resolvedPlacement.split('-')[0] === 'top' ? 'top' : 'bottom';
        // Reveal once the side is known. Keyframes (not transitions) play from their
        // own `from` frame, so side + 'open' set together animate from the right offset.
        if (isOpen && dataState === 'initial') dataState = 'open';
      });
    };

    return autoUpdate(ref, float, update);
  });

  const surfaceClasses = $derived(getDropdownOverlayClasses({ isInBottomSheet, isMenu }));

  const floatingStyle = $derived(
    [
      `z-index:${zIndex}`,
      `transform:translate3d(${Math.round(floatingX)}px,${Math.round(floatingY)}px,0)`,
      `display:${isActive ? 'flex' : 'none'}`,
      // menu width comes from CSS min/max; input triggers take the reference width.
      width ? `width:${width}` : !isMenu && referenceWidth ? `width:${referenceWidth}px` : undefined,
      minWidth ? `min-width:${minWidth}` : undefined,
      maxWidth ? `max-width:${maxWidth}` : undefined,
    ]
      .filter(Boolean)
      .join(';'),
  );

  const metaAttrs = metaAttribute({ name: MetaConstants.DropdownOverlay, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div
  bind:this={floatingEl}
  class={dropdownFloatingClass}
  style={floatingStyle}
  data-dropdown-id={dropdown?.dropdownBaseId}
  use:portal={document.body}
>
  <OverlayContextReset>
    <div
      class={surfaceClasses}
      data-state={dataState}
      data-side={placementSide}
      onanimationend={handleSurfaceAnimationEnd}
      {...metaAttrs}
      {...analyticsAttrs}
    >
      {@render children()}
    </div>
  </OverlayContextReset>
</div>
