type RazorSenseLifecycleState = 'dormant' | 'warm' | 'active' | 'suspended' | 'cold';

type RazorSenseRendererFamily = 'authored' | 'emotional' | 'legacy';

type RazorSenseRuntimeSnapshot = {
  state: RazorSenseLifecycleState;
  isAdmitted: boolean;
  isPageVisible: boolean;
  intersectionRatio: number;
};

type RazorSenseRuntimeOptions = {
  family: RazorSenseRendererFamily;
  /** Internal admission boost for a renderer preparing an in-place handoff. */
  priority?: number;
  /**
   * @deprecated Consumer pause is a playback concern. It remains accepted so
   * existing registrations stay source-compatible, but it does not affect
   * viewport lifecycle or admission.
   */
  isPaused?: boolean;
  isInteractive: boolean;
  /** Reserves one WebGL slot while this non-WebGL family fades an outgoing WebGL renderer. */
  retainsWebGL?: boolean;
};

type RazorSenseRuntimeRegistration = {
  id: number;
  update(options: RazorSenseRuntimeOptions): void;
  unregister(): void;
};

type RazorSenseRuntimeListener = (snapshot: RazorSenseRuntimeSnapshot) => void;

type RazorSenseRuntimeEntry = {
  id: number;
  element: HTMLElement;
  options: RazorSenseRuntimeOptions;
  listener: RazorSenseRuntimeListener;
  state: RazorSenseLifecycleState;
  isAdmitted: boolean;
  isWithinWarmMargin: boolean;
  isPointerActive: boolean;
  hasBeenActive: boolean;
  hasWarnedAboutAdmission: boolean;
  intersectionRatio: number;
  visibleArea: number;
  coldTimerId: ReturnType<typeof setTimeout> | undefined;
  lastSnapshot: RazorSenseRuntimeSnapshot | undefined;
  isRegistered: boolean;
  isListeningForPointer: boolean;
  handlePointerEnter: () => void;
  handlePointerLeave: () => void;
};

type ViewportMetrics = {
  intersectionRatio: number;
  visibleArea: number;
};

const COLD_TIMEOUT_MS = 10_000;
const MAX_ADMITTED_INSTANCES = 4;
const MAX_ADMITTED_WEBGL_INSTANCES = 2;
const WARM_MARGIN_PX = 240;
const INTERSECTION_THRESHOLDS = [0, 0.01, 0.25, 0.5, 1];
const DOCUMENT_POSITION_DISCONNECTED = 1;
const DOCUMENT_POSITION_PRECEDING = 2;
const DOCUMENT_POSITION_FOLLOWING = 4;

let nextRegistrationId = 1;

const runtimesByDocument = new WeakMap<Document, RazorSenseRuntime>();

const isWebGLFamily = (family: RazorSenseRendererFamily): boolean =>
  family === 'emotional' || family === 'legacy';

const snapshotsAreEqual = (
  first: RazorSenseRuntimeSnapshot,
  second: RazorSenseRuntimeSnapshot,
): boolean =>
  first.state === second.state &&
  first.isAdmitted === second.isAdmitted &&
  first.isPageVisible === second.isPageVisible &&
  first.intersectionRatio === second.intersectionRatio;

class RazorSenseRuntime {
  private readonly document: Document;

  private readonly defaultView: Window | null;

  private readonly entriesByElement = new Map<HTMLElement, RazorSenseRuntimeEntry>();

  private readonly entriesById = new Map<number, RazorSenseRuntimeEntry>();

  private readonly observer: IntersectionObserver | undefined;

  private isPageVisible: boolean;

  private isRecomputingAdmission = false;

  private isAdmissionDirty = false;

  public constructor(document: Document) {
    this.document = document;
    this.defaultView = document.defaultView;
    this.isPageVisible = this.getIsPageVisible();

    const IntersectionObserverConstructor = document.defaultView?.IntersectionObserver;
    this.observer = IntersectionObserverConstructor
      ? new IntersectionObserverConstructor(this.handleIntersections, {
          rootMargin: `${WARM_MARGIN_PX}px 0px`,
          threshold: INTERSECTION_THRESHOLDS,
        })
      : undefined;

    if (!this.observer) {
      this.defaultView?.addEventListener('scroll', this.handleFallbackViewportChange, {
        capture: true,
        passive: true,
      });
      this.defaultView?.addEventListener('resize', this.handleFallbackViewportChange, {
        passive: true,
      });
    }

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  public register(
    element: HTMLElement,
    options: RazorSenseRuntimeOptions,
    listener: RazorSenseRuntimeListener,
  ): RazorSenseRuntimeRegistration {
    const id = nextRegistrationId++;
    const rect = element.getBoundingClientRect();
    const metrics = this.getElementViewportMetrics(element, rect);
    const isWithinWarmMargin = metrics.visibleArea > 0 || this.isRectWithinWarmMargin(rect);
    const isActiveCandidate = metrics.visibleArea > 0 && this.isPageVisible;

    const entry: RazorSenseRuntimeEntry = {
      id,
      element,
      options,
      listener,
      state: isActiveCandidate ? 'active' : isWithinWarmMargin ? 'warm' : 'dormant',
      isAdmitted: false,
      isWithinWarmMargin,
      isPointerActive: false,
      hasBeenActive: isActiveCandidate,
      hasWarnedAboutAdmission: false,
      intersectionRatio: metrics.intersectionRatio,
      visibleArea: metrics.visibleArea,
      coldTimerId: undefined,
      lastSnapshot: undefined,
      isRegistered: true,
      isListeningForPointer: false,
      handlePointerEnter: () => {
        if (!entry.isRegistered || entry.isPointerActive) return;
        entry.isPointerActive = true;
        this.recomputeAdmissionAndNotify();
      },
      handlePointerLeave: () => {
        if (!entry.isRegistered || !entry.isPointerActive) return;
        entry.isPointerActive = false;
        this.recomputeAdmissionAndNotify();
      },
    };

    this.entriesById.set(id, entry);
    this.entriesByElement.set(element, entry);
    this.updatePointerListeners(entry);
    this.observer?.observe(element);
    this.recomputeAdmissionAndNotify();

    return {
      id,
      update: (nextOptions) => this.updateEntry(id, nextOptions),
      unregister: () => this.unregisterEntry(id),
    };
  }

  private readonly handleIntersections: IntersectionObserverCallback = (observerEntries) => {
    observerEntries.forEach((observerEntry) => {
      const entry = this.entriesByElement.get(observerEntry.target as HTMLElement);
      if (!entry) return;

      const wasWithinWarmMargin = entry.isWithinWarmMargin;
      const metrics = this.getViewportMetrics(observerEntry.intersectionRect);
      const elementArea =
        Math.max(0, observerEntry.boundingClientRect.width) *
        Math.max(0, observerEntry.boundingClientRect.height);
      entry.visibleArea = metrics.visibleArea;
      entry.intersectionRatio =
        elementArea > 0 ? Math.min(1, metrics.visibleArea / elementArea) : 0;
      entry.isWithinWarmMargin = observerEntry.isIntersecting || metrics.visibleArea > 0;
      this.recomputeLifecycle(entry, {
        canResumeWarm: !wasWithinWarmMargin && entry.isWithinWarmMargin,
      });
    });

    this.recomputeAdmissionAndNotify();
  };

  private readonly handleVisibilityChange = (): void => {
    const wasPageVisible = this.isPageVisible;
    this.isPageVisible = this.getIsPageVisible();

    this.entriesById.forEach((entry) => {
      const rect = entry.element.getBoundingClientRect();
      const metrics = this.getElementViewportMetrics(entry.element, rect);
      entry.visibleArea = metrics.visibleArea;
      entry.intersectionRatio = metrics.intersectionRatio;
      entry.isWithinWarmMargin = metrics.visibleArea > 0 || this.isRectWithinWarmMargin(rect);
      this.recomputeLifecycle(entry, {
        canResumeWarm: !wasPageVisible && this.isPageVisible,
      });
    });

    this.recomputeAdmissionAndNotify();
  };

  private readonly handleFallbackViewportChange = (): void => {
    this.entriesById.forEach((entry) => {
      const wasWithinWarmMargin = entry.isWithinWarmMargin;
      const rect = entry.element.getBoundingClientRect();
      const metrics = this.getElementViewportMetrics(entry.element, rect);
      entry.visibleArea = metrics.visibleArea;
      entry.intersectionRatio = metrics.intersectionRatio;
      entry.isWithinWarmMargin = metrics.visibleArea > 0 || this.isRectWithinWarmMargin(rect);
      this.recomputeLifecycle(entry, {
        canResumeWarm: !wasWithinWarmMargin && entry.isWithinWarmMargin,
      });
    });

    this.recomputeAdmissionAndNotify();
  };

  private updateEntry(id: number, nextOptions: RazorSenseRuntimeOptions): void {
    const entry = this.entriesById.get(id);
    if (!entry) return;

    const previousOptions = entry.options;
    const runtimeOptionsAreEqual =
      previousOptions.family === nextOptions.family &&
      previousOptions.priority === nextOptions.priority &&
      previousOptions.isInteractive === nextOptions.isInteractive &&
      previousOptions.retainsWebGL === nextOptions.retainsWebGL;

    entry.options = nextOptions;
    if (runtimeOptionsAreEqual) return;

    if (previousOptions.isInteractive !== nextOptions.isInteractive) {
      this.updatePointerListeners(entry);
    }

    this.recomputeLifecycle(entry, { canResumeWarm: false });
    this.recomputeAdmissionAndNotify();
  }

  private unregisterEntry(id: number): void {
    const entry = this.entriesById.get(id);
    if (!entry) return;

    entry.isRegistered = false;
    this.observer?.unobserve(entry.element);
    this.removePointerListeners(entry);
    this.clearColdTimer(entry);
    this.entriesById.delete(id);
    this.entriesByElement.delete(entry.element);

    if (this.entriesById.size > 0) {
      this.recomputeAdmissionAndNotify();
      return;
    }

    this.observer?.disconnect();
    if (!this.observer) {
      this.defaultView?.removeEventListener('scroll', this.handleFallbackViewportChange, true);
      this.defaultView?.removeEventListener('resize', this.handleFallbackViewportChange);
    }
    this.document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    runtimesByDocument.delete(this.document);
  }

  private recomputeLifecycle(
    entry: RazorSenseRuntimeEntry,
    { canResumeWarm }: { canResumeWarm: boolean },
  ): void {
    const isActiveCandidate = entry.visibleArea > 0 && this.isPageVisible;

    if (isActiveCandidate) {
      entry.hasBeenActive = true;
      entry.state = 'active';
      this.clearColdTimer(entry);
      return;
    }

    if (!entry.hasBeenActive) {
      entry.state = entry.isWithinWarmMargin ? 'warm' : 'dormant';
      return;
    }

    if (canResumeWarm && entry.isWithinWarmMargin && this.isPageVisible) {
      entry.state = 'warm';
      this.clearColdTimer(entry);
      return;
    }

    if (
      entry.state === 'active' ||
      (entry.state === 'warm' && (!entry.isWithinWarmMargin || !this.isPageVisible))
    ) {
      entry.state = 'suspended';
      this.startColdTimer(entry);
      return;
    }

    if (entry.state === 'suspended') {
      this.startColdTimer(entry);
    }
  }

  private recomputeAdmissionAndNotify(): void {
    this.isAdmissionDirty = true;
    if (this.isRecomputingAdmission) return;

    this.isRecomputingAdmission = true;
    try {
      while (this.isAdmissionDirty) {
        this.isAdmissionDirty = false;
        const entries = Array.from(this.entriesById.values());
        const activeCandidates = entries
          .filter((entry) => entry.state === 'active')
          .sort(this.compareAdmissionPriority);
        const admittedIds = new Set<number>();
        let admittedWebGLCount = 0;

        for (const entry of activeCandidates) {
          if (admittedIds.size >= MAX_ADMITTED_INSTANCES) break;
          const consumesWebGL =
            isWebGLFamily(entry.options.family) || Boolean(entry.options.retainsWebGL);
          if (consumesWebGL && admittedWebGLCount >= MAX_ADMITTED_WEBGL_INSTANCES) continue;

          admittedIds.add(entry.id);
          if (consumesWebGL) admittedWebGLCount += 1;
        }

        const notifications: Array<{
          entry: RazorSenseRuntimeEntry;
          snapshot: RazorSenseRuntimeSnapshot;
        }> = [];
        for (const entry of entries) {
          if (!entry.isRegistered || this.entriesById.get(entry.id) !== entry) continue;

          entry.isAdmitted = admittedIds.has(entry.id);
          if (
            __DEV__ &&
            entry.state === 'active' &&
            !entry.isAdmitted &&
            !entry.hasWarnedAboutAdmission
          ) {
            entry.hasWarnedAboutAdmission = true;
            console.warn(
              `[Blade: RazorSense]: Active instance ${entry.id} is waiting for shared runtime admission.`,
            );
          }

          const snapshot: RazorSenseRuntimeSnapshot = {
            state: entry.state,
            isAdmitted: entry.isAdmitted,
            isPageVisible: this.isPageVisible,
            intersectionRatio: entry.intersectionRatio,
          };
          if (!entry.lastSnapshot || !snapshotsAreEqual(entry.lastSnapshot, snapshot)) {
            notifications.push({ entry, snapshot });
          }
        }

        for (const { entry, snapshot } of notifications) {
          if (this.isAdmissionDirty) break;
          if (!entry.isRegistered || this.entriesById.get(entry.id) !== entry) continue;

          entry.lastSnapshot = snapshot;
          entry.listener(snapshot);
        }
      }
    } finally {
      this.isRecomputingAdmission = false;
    }
  }

  private readonly compareAdmissionPriority = (
    first: RazorSenseRuntimeEntry,
    second: RazorSenseRuntimeEntry,
  ): number => {
    const firstPriority = first.options.priority ?? 0;
    const secondPriority = second.options.priority ?? 0;
    if (firstPriority !== secondPriority) return secondPriority - firstPriority;
    if (first.isPointerActive !== second.isPointerActive) {
      return first.isPointerActive ? -1 : 1;
    }
    if (first.visibleArea !== second.visibleArea) {
      return second.visibleArea - first.visibleArea;
    }

    const position = first.element.compareDocumentPosition(second.element);
    // compareDocumentPosition returns a bitmask by design.
    // eslint-disable-next-line no-bitwise
    if (position & DOCUMENT_POSITION_DISCONNECTED) return first.id - second.id;
    // eslint-disable-next-line no-bitwise
    if (position & DOCUMENT_POSITION_FOLLOWING) return -1;
    // eslint-disable-next-line no-bitwise
    if (position & DOCUMENT_POSITION_PRECEDING) return 1;
    return first.id - second.id;
  };

  private updatePointerListeners(entry: RazorSenseRuntimeEntry): void {
    if (entry.options.isInteractive) {
      if (entry.isListeningForPointer) return;
      entry.element.addEventListener('pointerenter', entry.handlePointerEnter);
      entry.element.addEventListener('pointerleave', entry.handlePointerLeave);
      entry.isListeningForPointer = true;
      return;
    }

    this.removePointerListeners(entry);
  }

  private removePointerListeners(entry: RazorSenseRuntimeEntry): void {
    if (!entry.isListeningForPointer) return;
    entry.element.removeEventListener('pointerenter', entry.handlePointerEnter);
    entry.element.removeEventListener('pointerleave', entry.handlePointerLeave);
    entry.isListeningForPointer = false;
    entry.isPointerActive = false;
  }

  private startColdTimer(entry: RazorSenseRuntimeEntry): void {
    if (entry.coldTimerId !== undefined) return;
    entry.coldTimerId = setTimeout(() => {
      entry.coldTimerId = undefined;
      if (!entry.isRegistered || entry.state !== 'suspended') return;
      entry.state = 'cold';
      this.recomputeAdmissionAndNotify();
    }, COLD_TIMEOUT_MS);
  }

  private clearColdTimer(entry: RazorSenseRuntimeEntry): void {
    if (entry.coldTimerId === undefined) return;
    clearTimeout(entry.coldTimerId);
    entry.coldTimerId = undefined;
  }

  private getViewportMetrics(rect: DOMRectReadOnly): ViewportMetrics {
    const viewportWidth = this.document.documentElement.clientWidth;
    const viewportHeight = this.document.documentElement.clientHeight;
    const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0),
    );
    const visibleArea = visibleWidth * visibleHeight;
    const elementArea = Math.max(0, rect.width) * Math.max(0, rect.height);

    return {
      visibleArea,
      intersectionRatio: elementArea > 0 ? Math.min(1, visibleArea / elementArea) : 0,
    };
  }

  private getElementViewportMetrics(element: HTMLElement, rect: DOMRectReadOnly): ViewportMetrics {
    const metrics = this.getViewportMetrics(rect);
    if (
      this.observer ||
      this.document.documentElement.clientWidth > 0 ||
      this.document.documentElement.clientHeight > 0 ||
      !element.isConnected
    ) {
      return metrics;
    }

    // Layout-less environments cannot distinguish a connected visible host from
    // a zero-sized rect. Keep the existing eager behavior when no observer or
    // measurable viewport is available.
    return { visibleArea: 1, intersectionRatio: 1 };
  }

  private isRectWithinWarmMargin(rect: DOMRectReadOnly): boolean {
    const viewportWidth = this.document.documentElement.clientWidth;
    const viewportHeight = this.document.documentElement.clientHeight;
    return (
      rect.right > 0 &&
      rect.left < viewportWidth &&
      rect.bottom > -WARM_MARGIN_PX &&
      rect.top < viewportHeight + WARM_MARGIN_PX
    );
  }

  private getIsPageVisible(): boolean {
    return (
      !this.document.hidden &&
      (this.document.visibilityState === undefined || this.document.visibilityState === 'visible')
    );
  }
}

const registerRazorSenseRuntime = (
  element: HTMLElement,
  options: RazorSenseRuntimeOptions,
  listener: RazorSenseRuntimeListener,
): RazorSenseRuntimeRegistration => {
  const document = element.ownerDocument;
  let runtime = runtimesByDocument.get(document);
  if (!runtime) {
    runtime = new RazorSenseRuntime(document);
    runtimesByDocument.set(document, runtime);
  }
  return runtime.register(element, options, listener);
};

export { registerRazorSenseRuntime };
export type {
  RazorSenseLifecycleState,
  RazorSenseRendererFamily,
  RazorSenseRuntimeListener,
  RazorSenseRuntimeOptions,
  RazorSenseRuntimeRegistration,
  RazorSenseRuntimeSnapshot,
};
