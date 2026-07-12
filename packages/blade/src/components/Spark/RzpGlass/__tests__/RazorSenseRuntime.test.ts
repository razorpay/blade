import type {
  RazorSenseRendererFamily,
  RazorSenseRuntimeOptions,
  RazorSenseRuntimeRegistration,
  RazorSenseRuntimeSnapshot,
} from '../RazorSenseRuntime';
import { registerRazorSenseRuntime } from '../RazorSenseRuntime';

type RectOptions = {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
};

type RuntimeTestEntry = {
  element: HTMLDivElement;
  listener: jest.Mock<undefined, [RazorSenseRuntimeSnapshot]>;
  registration: RazorSenseRuntimeRegistration;
};

const VIEWPORT_WIDTH = 1000;
const VIEWPORT_HEIGHT = 800;

const makeRect = ({ left = 0, top = 0, width = 100, height = 100 }: RectOptions = {}): DOMRect =>
  ({
    x: left,
    y: top,
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({}),
  } as DOMRect);

const getSnapshot = (entry: RuntimeTestEntry): RazorSenseRuntimeSnapshot => {
  const latestCall = entry.listener.mock.calls[entry.listener.mock.calls.length - 1];
  expect(latestCall).toBeDefined();
  return latestCall[0];
};

describe('RazorSenseRuntime', () => {
  let observerCallback: IntersectionObserverCallback,
    observerOptions: IntersectionObserverInit | undefined,
    observer: Pick<IntersectionObserver, 'disconnect' | 'observe' | 'takeRecords' | 'unobserve'>,
    visibilityState: DocumentVisibilityState,
    registrations: RazorSenseRuntimeRegistration[],
    consoleWarn: jest.SpyInstance;

  const setRect = (element: HTMLElement, rect: DOMRect): void => {
    Object.defineProperty(element, 'getBoundingClientRect', {
      configurable: true,
      value: jest.fn(() => rect),
    });
  };

  const emitIntersection = (element: HTMLElement, rect: DOMRect, isIntersecting: boolean): void => {
    setRect(element, rect);
    observerCallback(
      [
        {
          boundingClientRect: rect,
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: rect,
          isIntersecting,
          rootBounds: null,
          target: element,
          time: 0,
        } as IntersectionObserverEntry,
      ],
      observer as IntersectionObserver,
    );
  };

  const register = (
    family: RazorSenseRendererFamily,
    rect: DOMRect,
    options: Partial<Omit<RazorSenseRuntimeOptions, 'family'>> = {},
    listener = jest.fn<undefined, [RazorSenseRuntimeSnapshot]>(),
  ): RuntimeTestEntry => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    setRect(element, rect);
    const registration = registerRazorSenseRuntime(
      element,
      {
        family,
        isInteractive: false,
        isPaused: false,
        ...options,
      },
      listener,
    );
    registrations.push(registration);
    return { element, listener, registration };
  };

  beforeEach(() => {
    jest.useFakeTimers();
    registrations = [];
    visibilityState = 'visible';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibilityState,
    });
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => visibilityState !== 'visible',
    });
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      value: VIEWPORT_WIDTH,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: VIEWPORT_HEIGHT,
    });

    observer = {
      disconnect: jest.fn(),
      observe: jest.fn(),
      takeRecords: jest.fn(() => []),
      unobserve: jest.fn(),
    };
    window.IntersectionObserver = jest.fn((callback, options) => {
      observerCallback = callback;
      observerOptions = options;
      return observer as IntersectionObserver;
    });
    consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    registrations.forEach((registration) => registration.unregister());
    document.body.innerHTML = '';
    consoleWarn.mockRestore();
    jest.useRealTimers();
  });

  it('keeps a never-visible offscreen registration dormant without starting a cold timer', () => {
    const entry = register('authored', makeRect({ top: 1400 }));

    expect(observerOptions).toEqual({
      rootMargin: '240px 0px',
      threshold: [0, 0.01, 0.25, 0.5, 1],
    });
    emitIntersection(entry.element, makeRect({ top: 1400 }), false);

    expect(getSnapshot(entry)).toEqual({
      state: 'dormant',
      isAdmitted: false,
      isPageVisible: true,
      intersectionRatio: 0,
    });
    expect(jest.getTimerCount()).toBe(0);

    jest.advanceTimersByTime(10_000);
    expect(getSnapshot(entry).state).toBe('dormant');
  });

  it('treats the observer margin as warm while reporting actual viewport visibility', () => {
    const entry = register('authored', makeRect({ top: 900 }));

    emitIntersection(entry.element, makeRect({ top: 900 }), true);

    expect(getSnapshot(entry)).toEqual({
      state: 'warm',
      isAdmitted: false,
      isPageVisible: true,
      intersectionRatio: 0,
    });
    const listenerCallCount = entry.listener.mock.calls.length;
    emitIntersection(entry.element, makeRect({ top: 900 }), true);
    expect(entry.listener).toHaveBeenCalledTimes(listenerCallCount);
  });

  it('makes a viewport-visible registration active and admitted', () => {
    const entry = register('authored', makeRect({ top: -50, height: 100 }));

    emitIntersection(entry.element, makeRect({ top: -50, height: 100 }), true);

    expect(getSnapshot(entry)).toEqual({
      state: 'active',
      isAdmitted: true,
      isPageVisible: true,
      intersectionRatio: 0.5,
    });
  });

  it('keeps a visible user-paused registration active and admitted for preparation', () => {
    const entry = register('authored', makeRect(), { isPaused: true });

    emitIntersection(entry.element, makeRect(), true);

    expect(getSnapshot(entry)).toEqual({
      state: 'active',
      isAdmitted: true,
      isPageVisible: true,
      intersectionRatio: 1,
    });
    expect(jest.getTimerCount()).toBe(0);
  });

  it('does not start a cold lifecycle when an active registration is user-paused', () => {
    const entry = register('authored', makeRect());
    emitIntersection(entry.element, makeRect(), true);

    entry.registration.update({
      family: 'authored',
      isInteractive: false,
      isPaused: true,
    });

    expect(getSnapshot(entry)).toEqual({
      state: 'active',
      isAdmitted: true,
      isPageVisible: true,
      intersectionRatio: 1,
    });
    expect(jest.getTimerCount()).toBe(0);

    jest.advanceTimersByTime(10_000);
    expect(getSnapshot(entry).state).toBe('active');
  });

  it('uses the initial viewport rect when IntersectionObserver is unavailable', () => {
    window.IntersectionObserver = undefined as never;
    const entry = register('authored', makeRect({ left: 20, top: 20 }));

    expect(getSnapshot(entry)).toEqual({
      state: 'active',
      isAdmitted: true,
      isPageVisible: true,
      intersectionRatio: 1,
    });
  });

  it('keeps the missing-observer fallback live on scroll and removes shared listeners', () => {
    window.IntersectionObserver = undefined as never;
    const addEventListener = jest.spyOn(window, 'addEventListener');
    const removeEventListener = jest.spyOn(window, 'removeEventListener');
    const entry = register('authored', makeRect());

    expect(addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
      capture: true,
      passive: true,
    });
    expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), {
      passive: true,
    });

    setRect(entry.element, makeRect({ top: 1400 }));
    window.dispatchEvent(new Event('scroll'));
    expect(getSnapshot(entry).state).toBe('suspended');

    entry.registration.unregister();
    expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it.each(['scroll', 'resize'] as const)(
    'activates a dormant fallback registration after a %s geometry change',
    (eventName) => {
      window.IntersectionObserver = undefined as never;
      const entry = register('authored', makeRect({ top: 1400 }));
      expect(getSnapshot(entry).state).toBe('dormant');

      setRect(entry.element, makeRect());
      window.dispatchEvent(new Event(eventName));

      expect(getSnapshot(entry)).toEqual({
        state: 'active',
        isAdmitted: true,
        isPageVisible: true,
        intersectionRatio: 1,
      });
    },
  );

  it('suspends an active registration immediately and makes it cold after ten seconds', () => {
    const entry = register('authored', makeRect());
    emitIntersection(entry.element, makeRect(), true);
    expect(getSnapshot(entry).state).toBe('active');

    emitIntersection(entry.element, makeRect({ top: 900 }), true);
    expect(getSnapshot(entry)).toEqual({
      state: 'suspended',
      isAdmitted: false,
      isPageVisible: true,
      intersectionRatio: 0,
    });

    jest.advanceTimersByTime(9_999);
    expect(getSnapshot(entry).state).toBe('suspended');
    jest.advanceTimersByTime(1);
    expect(getSnapshot(entry).state).toBe('cold');
  });

  it('suspends active registrations while the page is hidden and resumes them when shown', () => {
    const entry = register('authored', makeRect());
    emitIntersection(entry.element, makeRect(), true);
    expect(getSnapshot(entry).state).toBe('active');

    visibilityState = 'hidden';
    document.dispatchEvent(new Event('visibilitychange'));
    expect(getSnapshot(entry)).toEqual({
      state: 'suspended',
      isAdmitted: false,
      isPageVisible: false,
      intersectionRatio: 1,
    });

    visibilityState = 'visible';
    document.dispatchEvent(new Event('visibilitychange'));
    expect(getSnapshot(entry)).toEqual({
      state: 'active',
      isAdmitted: true,
      isPageVisible: true,
      intersectionRatio: 1,
    });
    expect(jest.getTimerCount()).toBe(0);
  });

  it('charges retained WebGL only when the prioritized registration is admitted', () => {
    const retained = register('authored', makeRect({ width: 10, height: 10 }), {
      isInteractive: true,
      retainsWebGL: true,
    });
    const emotional = register('emotional', makeRect({ width: 300, height: 200 }));
    const legacy = register('legacy', makeRect({ width: 250, height: 200 }));
    const authoredA = register('authored', makeRect({ width: 200, height: 150 }));
    const authoredB = register('authored', makeRect({ width: 150, height: 150 }));
    const entries = [retained, emotional, legacy, authoredA, authoredB];
    entries.forEach((entry) =>
      emitIntersection(entry.element, entry.element.getBoundingClientRect(), true),
    );

    expect(window.IntersectionObserver).toHaveBeenCalledTimes(1);
    expect(entries.map((entry) => getSnapshot(entry).isAdmitted)).toEqual([
      false,
      true,
      true,
      true,
      true,
    ]);
    expect(consoleWarn).toHaveBeenCalledTimes(1);

    retained.element.dispatchEvent(new Event('pointerenter'));
    expect(entries.map((entry) => getSnapshot(entry).isAdmitted)).toEqual([
      true,
      true,
      false,
      true,
      true,
    ]);
    expect(consoleWarn).toHaveBeenCalledTimes(2);
  });

  it('recomputes admission without stale notifications when a listener unregisters itself', () => {
    let shouldUnregister = false;
    const firstRegistrationRef: { current?: RazorSenseRuntimeRegistration } = {};
    const firstListener = jest.fn<undefined, [RazorSenseRuntimeSnapshot]>(() => {
      if (shouldUnregister) firstRegistrationRef.current?.unregister();
      return undefined;
    });
    const first = register('authored', makeRect(), {}, firstListener);
    firstRegistrationRef.current = first.registration;
    const remaining = [
      register('authored', makeRect()),
      register('authored', makeRect()),
      register('authored', makeRect()),
      register('authored', makeRect()),
    ];
    expect(remaining.map((entry) => getSnapshot(entry).isAdmitted)).toEqual([
      true,
      true,
      true,
      false,
    ]);
    const waiter = remaining[3];
    const waiterCallCount = waiter.listener.mock.calls.length;

    shouldUnregister = true;
    emitIntersection(first.element, makeRect({ top: -100, height: 200 }), true);

    expect(observer.unobserve).toHaveBeenCalledWith(first.element);
    expect(remaining.map((entry) => getSnapshot(entry).isAdmitted)).toEqual([
      true,
      true,
      true,
      true,
    ]);
    expect(
      waiter.listener.mock.calls.slice(waiterCallCount).map(([snapshot]) => snapshot),
    ).toEqual([expect.objectContaining({ state: 'active', isAdmitted: true })]);
  });

  it('ranks active pointer, visible area, and live DOM order in that order', () => {
    const pointer = register('authored', makeRect({ width: 10, height: 10 }), {
      isInteractive: true,
    });
    const large = register('authored', makeRect({ width: 200, height: 200 }));
    const tiedA = register('authored', makeRect({ width: 100, height: 100 }));
    const tiedB = register('authored', makeRect({ width: 100, height: 100 }));
    const tiedC = register('authored', makeRect({ width: 100, height: 100 }));
    const tiedD = register('authored', makeRect({ width: 100, height: 100 }));
    const entries = [pointer, large, tiedA, tiedB, tiedC, tiedD];
    entries.forEach((entry) =>
      emitIntersection(entry.element, entry.element.getBoundingClientRect(), true),
    );

    pointer.element.dispatchEvent(new Event('pointerenter'));
    expect(entries.map((entry) => getSnapshot(entry).isAdmitted)).toEqual([
      true,
      true,
      true,
      true,
      false,
      false,
    ]);

    pointer.element.dispatchEvent(new Event('pointerleave'));
    expect(entries.map((entry) => getSnapshot(entry).isAdmitted)).toEqual([
      false,
      true,
      true,
      true,
      true,
      false,
    ]);

    document.body.insertBefore(tiedD.element, tiedA.element);
    emitIntersection(tiedD.element, makeRect({ width: 100, height: 100 }), true);
    expect(entries.map((entry) => getSnapshot(entry).isAdmitted)).toEqual([
      false,
      true,
      true,
      true,
      false,
      true,
    ]);
  });

  it('preserves registration identity and a running cold timer across family updates', () => {
    const entry = register('authored', makeRect());
    const registrationId = entry.registration.id;
    emitIntersection(entry.element, makeRect(), true);
    emitIntersection(entry.element, makeRect({ top: 900 }), true);

    jest.advanceTimersByTime(5_000);
    entry.registration.update({ family: 'emotional', isInteractive: false, isPaused: false });

    expect(entry.registration.id).toBe(registrationId);
    expect(getSnapshot(entry).state).toBe('suspended');
    jest.advanceTimersByTime(4_999);
    expect(getSnapshot(entry).state).toBe('suspended');
    jest.advanceTimersByTime(1);
    expect(getSnapshot(entry).state).toBe('cold');
  });

  it('updates interactive pointer listeners and cleans registration resources on unregister', () => {
    const documentAddListener = jest.spyOn(document, 'addEventListener');
    const documentRemoveListener = jest.spyOn(document, 'removeEventListener');
    const first = register('authored', makeRect({ width: 10, height: 10 }));
    const others = [
      register('authored', makeRect()),
      register('authored', makeRect()),
      register('authored', makeRect()),
      register('authored', makeRect()),
    ];
    const addListener = jest.spyOn(first.element, 'addEventListener');
    const removeListener = jest.spyOn(first.element, 'removeEventListener');

    expect(
      documentAddListener.mock.calls.filter(([eventName]) => eventName === 'visibilitychange'),
    ).toHaveLength(1);

    first.registration.update({ family: 'authored', isInteractive: true, isPaused: false });
    expect(addListener).toHaveBeenCalledWith('pointerenter', expect.any(Function));
    expect(addListener).toHaveBeenCalledWith('pointerleave', expect.any(Function));
    first.element.dispatchEvent(new Event('pointerenter'));
    expect(getSnapshot(first).isAdmitted).toBe(true);

    first.registration.update({ family: 'authored', isInteractive: false, isPaused: false });
    expect(removeListener).toHaveBeenCalledWith('pointerenter', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('pointerleave', expect.any(Function));
    expect(getSnapshot(first).isAdmitted).toBe(false);

    first.registration.update({ family: 'authored', isInteractive: true, isPaused: false });
    first.registration.unregister();
    expect(observer.unobserve).toHaveBeenCalledWith(first.element);
    expect(removeListener).toHaveBeenCalledWith('pointerenter', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('pointerleave', expect.any(Function));
    expect(
      documentRemoveListener.mock.calls.filter(([eventName]) => eventName === 'visibilitychange'),
    ).toHaveLength(0);

    others.forEach((entry) => entry.registration.unregister());
    others.forEach((entry) => expect(observer.unobserve).toHaveBeenCalledWith(entry.element));
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
    expect(
      documentRemoveListener.mock.calls.filter(([eventName]) => eventName === 'visibilitychange'),
    ).toHaveLength(1);
  });
});
