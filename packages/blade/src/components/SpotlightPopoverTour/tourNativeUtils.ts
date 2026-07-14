/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Dimensions } from 'react-native';
import { logger } from '~utils/logger';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ScrollableInstance = {
  scrollTo?: (options: { x?: number; y?: number; animated?: boolean }) => void;
  scrollToOffset?: (options: { offset: number; animated?: boolean }) => void;
  setNativeProps?: (props: Record<string, unknown>) => void;
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
  measure?: (
    callback: (
      x: number,
      y: number,
      width: number,
      height: number,
      pageX: number,
      pageY: number,
    ) => void,
  ) => void;
};

/** Minimal host shape for measureInWindow — View or any TourElement host */
type TourMeasurable = {
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

/** Accept any step host ref (View / HTMLElement brand) — measure via duck-typing */
type StepRef = { readonly current: unknown };

const measureStepRect = (ref: StepRef): Promise<Rect | null> => {
  return new Promise((resolve) => {
    const node = ref.current as (TourMeasurable & ScrollableInstance) | null;
    if (!node || typeof node.measureInWindow !== 'function') {
      resolve(null);
      return;
    }

    let settled = false;
    const finish = (result: Rect | null): void => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    // Tests / stalling hosts may never invoke the callback — don't hang settle flow.
    // 500ms ceiling accounts for slow devices / blocked JS thread; caller handles null gracefully.
    const timeoutId = setTimeout(() => finish(null), 500);

    node.measureInWindow((x, y, width, height) => {
      clearTimeout(timeoutId);
      if (width === 0 && height === 0) {
        finish(null);
        return;
      }
      finish({ x, y, width, height });
    });
  });
};

const isRectVisibleInBounds = (
  rect: Rect,
  boundsWidth: number,
  boundsHeight: number,
  threshold = 0.5,
): boolean => {
  // Incomplete / unavailable layout metrics — don't treat as off-screen
  if (boundsWidth === 0 || boundsHeight === 0) {
    return true;
  }

  const intersectionLeft = Math.max(rect.x, 0);
  const intersectionTop = Math.max(rect.y, 0);
  const intersectionRight = Math.min(rect.x + rect.width, boundsWidth);
  const intersectionBottom = Math.min(rect.y + rect.height, boundsHeight);

  const intersectionWidth = Math.max(0, intersectionRight - intersectionLeft);
  const intersectionHeight = Math.max(0, intersectionBottom - intersectionTop);
  const intersectionArea = intersectionWidth * intersectionHeight;
  const rectArea = rect.width * rect.height;

  if (rectArea <= 0) {
    return false;
  }

  return intersectionArea / rectArea >= threshold;
};

const isRectVisibleInWindow = (rect: Rect, threshold = 0.5): boolean => {
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  return isRectVisibleInBounds(rect, windowWidth, windowHeight, threshold);
};

/** Approximate popover footprint used when deciding whether to scroll for placement room */
const POPOVER_RESERVE = { width: 300, height: 240 } as const;
const POPOVER_EDGE_PAD = 24;
const POPOVER_STATUS_PAD = 48;

type PlacementSide = 'top' | 'bottom' | 'left' | 'right';

const getPlacementSide = (placement?: string): PlacementSide => {
  const side = (placement ?? 'top').split('-')[0] as PlacementSide;
  if (side === 'top' || side === 'bottom' || side === 'left' || side === 'right') {
    return side;
  }
  return 'top';
};

/**
 * Whether the preferred popover side has enough clear space outside the target.
 * Used to decide "scroll for room" even when the target is already ≥50% visible.
 */
const hasRoomForPopoverPlacement = (
  rect: Rect,
  placement: string | undefined,
  gap: number,
  reserve = POPOVER_RESERVE,
): boolean => {
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  if (windowWidth === 0 || windowHeight === 0) {
    return true;
  }

  const side = getPlacementSide(placement);
  switch (side) {
    case 'bottom':
      return rect.y + rect.height + gap + reserve.height <= windowHeight - POPOVER_EDGE_PAD;
    case 'top':
      return rect.y - gap - reserve.height >= POPOVER_STATUS_PAD;
    case 'left':
      return rect.x - gap - reserve.width >= POPOVER_EDGE_PAD;
    case 'right':
      return rect.x + rect.width + gap + reserve.width <= windowWidth - POPOVER_EDGE_PAD;
    default:
      return true;
  }
};

/**
 * Bias scroll so preferred placement keeps clearance for the popover (mirrors web
 * scrollIntoView({block:'center'}) plus room for the floating card).
 */
const getPlacementBiasedScrollTarget = (
  contentY: number,
  contentX: number,
  rect: Rect,
  boundsHeight: number,
  boundsWidth: number,
  placement: string | undefined,
): { targetX: number; targetY: number } => {
  const side = getPlacementSide(placement);
  let targetY: number, targetX: number;

  switch (side) {
    case 'bottom':
      // Leave lower viewport for the popover — park target in the upper third
      targetY = contentY - boundsHeight * 0.22;
      targetX = contentX + rect.width / 2 - boundsWidth / 2;
      break;
    case 'top':
      // Leave upper viewport for the popover — park target in the lower third
      targetY = contentY + rect.height - boundsHeight * 0.78;
      targetX = contentX + rect.width / 2 - boundsWidth / 2;
      break;
    case 'left':
      targetY = contentY + rect.height / 2 - boundsHeight / 2;
      targetX = contentX + rect.width - boundsWidth * 0.78;
      break;
    case 'right':
      targetY = contentY + rect.height / 2 - boundsHeight / 2;
      targetX = contentX - boundsWidth * 0.22;
      break;
    default:
      targetY = contentY + rect.height / 2 - boundsHeight / 2;
      targetX = contentX + rect.width / 2 - boundsWidth / 2;
  }

  return {
    targetX: Math.max(0, targetX),
    targetY: Math.max(0, targetY),
  };
};

const SCROLLABLE_DISPLAY_NAMES = new Set([
  'ScrollView',
  'FlatList',
  'SectionList',
  'VirtualizedList',
  'KeyboardAwareScrollView',
]);

/** Native host / Fabric names that survive minification where displayName does not */
const SCROLLABLE_HOST_NAMES = new Set([
  'RCTScrollView',
  'AndroidHorizontalScrollView',
  'AndroidScrollView',
  'RNGestureHandlerScrollView',
]);

const isScrollableComponentName = (name: string | null): boolean => {
  if (!name) {
    return false;
  }
  if (SCROLLABLE_DISPLAY_NAMES.has(name) || SCROLLABLE_HOST_NAMES.has(name)) {
    return true;
  }
  // Production builds / Storybook hosts often expose scrambled or nested names
  return /ScrollView|FlatList|SectionList|VirtualizedList/i.test(name);
};

const getFiberFromHostInstance = (hostInstance: unknown): any => {
  if (!hostInstance || typeof hostInstance !== 'object') {
    return null;
  }

  const record = hostInstance as Record<string, unknown>;
  if (record._internalFiberInstanceHandleDEV) {
    return record._internalFiberInstanceHandleDEV;
  }

  const fiberKey = Object.keys(record).find(
    (key) =>
      key.startsWith('__reactFiber$') ||
      key.startsWith('__reactInternalInstance$') ||
      key.startsWith('__reactContainer$'),
  );

  return fiberKey ? record[fiberKey] : null;
};

const getComponentName = (fiber: any): string | null => {
  const type = fiber?.type ?? fiber?.elementType;
  if (!type) {
    return null;
  }
  if (typeof type === 'string') {
    return type;
  }
  // Reading a third-party React fiber's displayName for component-name hints (not defining it)
  // eslint-disable-next-line no-restricted-properties
  return type.displayName || type.name || null;
};

const getHostNameHints = (fiber: any, stateNode: any): string[] => {
  const hints: string[] = [];
  const name = getComponentName(fiber);
  if (name) {
    hints.push(name);
  }

  const viewConfigName =
    stateNode?.viewConfig?.uiViewClassName ??
    stateNode?.viewConfig?.NativeComponent ??
    fiber?.stateNode?.viewConfig?.uiViewClassName;
  if (typeof viewConfigName === 'string') {
    hints.push(viewConfigName);
  }

  const constructorName = stateNode?.constructor?.name;
  if (typeof constructorName === 'string') {
    hints.push(constructorName);
  }

  return hints;
};

const findScrollableAncestor = (nativeHostComponent: unknown): ScrollableInstance | null => {
  let fiber = getFiberFromHostInstance(nativeHostComponent);

  while (fiber) {
    const stateNode = fiber.stateNode as ScrollableInstance | null;
    const nameHints = getHostNameHints(fiber, stateNode);

    if (nameHints.some(isScrollableComponentName) && stateNode) {
      return stateNode;
    }

    if (
      stateNode &&
      (typeof stateNode.scrollTo === 'function' || typeof stateNode.scrollToOffset === 'function')
    ) {
      return stateNode;
    }

    fiber = fiber.return;
  }

  return null;
};

const waitUntilPositionStable = (ref: StepRef): Promise<void> => {
  return new Promise((resolve) => {
    let same = 0;
    let lastY: number | null = null;
    let lastX: number | null = null;
    let frames = 0;
    // ~750ms ceiling — enough for ScrollView animated settle without feeling stuck
    const maxFrames = 45;
    // Require several identical frames so mid-deceleration pauses don't finalize early
    const stableFramesNeeded = 5;

    const check = (): void => {
      frames += 1;
      if (frames > maxFrames) {
        resolve();
        return;
      }

      const node = ref.current as (TourMeasurable & ScrollableInstance) | null;
      if (!node || typeof node.measureInWindow !== 'function') {
        resolve();
        return;
      }

      node.measureInWindow((x, y) => {
        if (y === lastY && x === lastX) {
          same += 1;
          if (same >= stableFramesNeeded) {
            resolve();
            return;
          }
        } else {
          same = 0;
          lastY = y;
          lastX = x;
        }

        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(check);
        } else {
          setTimeout(check, 16);
        }
      });
    };

    // Let the animated scroll actually start before polling (avoids "stable" at origin)
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => requestAnimationFrame(check));
    } else {
      setTimeout(check, 32);
    }
  });
};

type ScrollStepIntoViewOptions = {
  /** Preferred step placement — biases scroll so popover has clearance */
  placement?: string;
  /** Gap between target and popover (theme spacing + arrow) */
  gap?: number;
  /**
   * When true (default), scroll even if ≥50% visible when preferred side
   * lacks room for the popover (prevents clamp-over-cutout).
   */
  ensurePlacementRoom?: boolean;
};

const scrollStepIntoView = async (
  stepRef: StepRef,
  registeredScrollParent?: ScrollableInstance | null,
  options: ScrollStepIntoViewOptions = {},
): Promise<ScrollableInstance | null> => {
  const { placement, gap = 28, ensurePlacementRoom = true } = options;
  const rect = await measureStepRect(stepRef);
  if (!rect) {
    return registeredScrollParent ?? null;
  }

  const isVisible = isRectVisibleInWindow(rect, 0.5);
  const hasRoom = !ensurePlacementRoom || hasRoomForPopoverPlacement(rect, placement, gap);
  if (isVisible && hasRoom) {
    return registeredScrollParent ?? findScrollableAncestor(stepRef.current);
  }

  const scrollable = registeredScrollParent ?? findScrollableAncestor(stepRef.current) ?? null;

  if (!scrollable) {
    // Re-check using screen metrics — window can be 0×0 in some Storybook hosts
    const screen = Dimensions.get('screen');
    const isMostlyOnScreen = isRectVisibleInBounds(rect, screen.width, screen.height, 0.5);

    if (!isMostlyOnScreen && __DEV__) {
      logger({
        moduleName: 'SpotlightPopoverTour',
        type: 'warn',
        message:
          'Could not find a ScrollView/FlatList ancestor to scroll the active step into view. Keep the target on-screen or register a scroll parent.',
      });
    }

    // Resolve successfully so callers clear isScrolling and continue measuring
    return registeredScrollParent ?? null;
  }

  const window = Dimensions.get('window');
  const fallbackHeight = window.height || Dimensions.get('screen').height;
  const fallbackWidth = window.width || Dimensions.get('screen').width;

  // Prefer the scroll parent's viewport when measurable (Storybook chrome ≠ full window)
  const scrollParentRect = await measureStepRect({ current: scrollable });
  const boundsHeight = scrollParentRect?.height ? scrollParentRect.height : fallbackHeight;
  const boundsWidth = scrollParentRect?.width ? scrollParentRect.width : fallbackWidth;
  const boundsOriginY = scrollParentRect?.y ?? 0;
  const boundsOriginX = scrollParentRect?.x ?? 0;

  // Prefer story/onScroll-tracked offset, then internal ScrollView metrics.
  // Fabric often omits `state.contentOffset`, which would leave currentY stuck at 0.
  const contentOffset = (scrollable as any)?.__bladeTourContentOffset ??
    (scrollable as any)?.state?.contentOffset ??
    (scrollable as any)?._scrollMetrics?.contentOffset ?? { x: 0, y: 0 };
  const currentY = typeof contentOffset?.y === 'number' ? contentOffset.y : 0;
  const currentX = typeof contentOffset?.x === 'number' ? contentOffset.x : 0;

  // Window coords → content coords, then bias toward preferred placement clearance
  const contentY = rect.y - boundsOriginY + currentY;
  const contentX = rect.x - boundsOriginX + currentX;
  const { targetX, targetY } = getPlacementBiasedScrollTarget(
    contentY,
    contentX,
    rect,
    boundsHeight,
    boundsWidth,
    placement,
  );

  // Tour scroll-lock sets scrollEnabled=false; programmatic scrollTo still needs it enabled on some hosts.
  const wasLocked = (scrollable as any).__bladeTourScrollLocked === true;
  if (wasLocked) {
    scrollable.setNativeProps?.({ scrollEnabled: true });
    (scrollable as any).scrollEnabled = true;
  }

  try {
    if (typeof scrollable.scrollTo === 'function') {
      scrollable.scrollTo({ x: targetX, y: targetY, animated: true });
    } else if (typeof scrollable.scrollToOffset === 'function') {
      scrollable.scrollToOffset({ offset: targetY, animated: true });
    }

    await waitUntilPositionStable(stepRef);

    // Keep tracked offset in sync when native metrics aren't readable
    (scrollable as any).__bladeTourContentOffset = { x: targetX, y: targetY };
  } finally {
    if (wasLocked) {
      scrollable.setNativeProps?.({ scrollEnabled: false });
      (scrollable as any).scrollEnabled = false;
    }
  }

  return scrollable;
};

const useTourScrollLock = (
  isOpen: boolean,
  scrollableRef: React.MutableRefObject<ScrollableInstance | null>,
  /**
   * Optional epoch bumped when scroll parent is (re)registered so the lock
   * reapplies after late ScrollView registration (e.g. stories).
   */
  scrollParentEpoch = 0,
): void => {
  React.useEffect(() => {
    const scrollable = scrollableRef.current;
    if (!scrollable || !isOpen) {
      return undefined;
    }

    scrollable.setNativeProps?.({ scrollEnabled: false });
    // Also stamp a mutable flag that tests can assert when setNativeProps is mocked
    const originalScrollEnabled = (scrollable as any).scrollEnabled;
    (scrollable as any).__bladeTourScrollLocked = true;
    (scrollable as any).scrollEnabled = false;

    return () => {
      scrollable.setNativeProps?.({ scrollEnabled: originalScrollEnabled ?? true });
      (scrollable as any).__bladeTourScrollLocked = false;
      (scrollable as any).scrollEnabled = originalScrollEnabled ?? true;
    };
  }, [isOpen, scrollableRef, scrollParentEpoch]);
};

// Re-export shared delayed/transition hooks so `./utils` imports resolve under native moduleSuffixes
export { useDelayedState, useIsTransitioningBetweenSteps } from './tourHooks';
export type { Rect, ScrollableInstance };
export {
  measureStepRect,
  isRectVisibleInWindow,
  hasRoomForPopoverPlacement,
  findScrollableAncestor,
  scrollStepIntoView,
  useTourScrollLock,
  waitUntilPositionStable,
  POPOVER_RESERVE,
};
