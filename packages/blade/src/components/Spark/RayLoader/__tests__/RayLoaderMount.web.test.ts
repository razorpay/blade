/* eslint-disable @typescript-eslint/no-explicit-any */
// The Ray loader's director, on a made-up film (its engine and film host stand-ins): when it's done, and what it never does after
// it's gone. Each of these failed before the fresh-eyes review's fixes.
import { RayLoaderMount } from '../RayLoaderMount';

type Deferred = { promise: Promise<any>; resolve: (v: any) => void; reject: (e: any) => void };
const deferred = (): Deferred => {
  let resolve!: (v: any) => void, reject!: (e: any) => void;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const mockFilm: { current: Deferred } = { current: deferred() };
const mockHosts: any[] = [];
jest.mock('../../Ray/engine', () => ({
  FILMS: { dash: () => mockFilm.current.promise },
  TUNES: {},
}));
jest.mock('../../Ray/FilmHost', () => ({
  FilmHost: class {
    layer = globalThis.document.createElement('div');
    ticks = 0;
    rehearsed = false;
    onMessage: (m: any) => void;
    send = jest.fn();
    start = jest.fn();
    resize = jest.fn();
    dispose = jest.fn();
    tick = jest.fn(() => {
      this.ticks += 1;
    });

    constructor(options: any) {
      this.onMessage = options.onMessage;
      mockHosts.push(this);
    }
  },
}));

const flush = async (): Promise<void> => {
  for (let i = 0; i < 5; i++) await Promise.resolve(); // eslint-disable-line no-await-in-loop
};

const observers: { intersection: ((e: any[]) => void) | null; resize: (() => void) | null } = {
  intersection: null,
  resize: null,
};
const realMatchMedia = window.matchMedia;

beforeEach(() => {
  mockFilm.current = deferred();
  mockHosts.length = 0;
  observers.intersection = null;
  observers.resize = null;
  (window as any).IntersectionObserver = class {
    constructor(cb: (e: any[]) => void) {
      observers.intersection = cb;
    }

    observe = jest.fn();
    disconnect = jest.fn();
  };
  (window as any).ResizeObserver = class {
    constructor(cb: () => void) {
      observers.resize = cb;
    }

    observe = jest.fn();
    disconnect = jest.fn();
  };
  jest.useFakeTimers();
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  window.matchMedia = realMatchMedia;
  delete (window as any).IntersectionObserver;
  delete (window as any).ResizeObserver;
});

const OPTIONS = { size: 'medium', colorScheme: 'light' } as const;

/** A director whose film has loaded, said it's ready, drawn its unseen frame and started. */
const started = async (onDone: () => void): Promise<{ mount: RayLoaderMount; host: any }> => {
  const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, onDone);
  mockFilm.current.resolve({});
  await flush();
  const host = mockHosts[0];
  host.onMessage({ ray: 'ready' });
  host.rehearsed = true;
  jest.advanceTimersByTime(50); // (a few frames: it starts)
  expect((mount as any).debug.started).toBe(true);
  return { mount, host };
};

describe('RayLoaderMount', () => {
  it("doesn't mount a film that arrives after it gave up on it", async () => {
    const onDone = jest.fn();
    const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, onDone);
    (mount as any).finishNow(); // (as START_WAIT_MS gives up on a film that's slow to load)
    expect(onDone).toHaveBeenCalledTimes(1);
    mockFilm.current.resolve({});
    await flush();
    expect(mockHosts).toHaveLength(0);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('says nothing once it has gone, even if its film then fails to load', async () => {
    const onDone = jest.fn();
    const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, onDone);
    mount.dispose();
    mockFilm.current.reject(new Error('chunk failed'));
    await flush();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("lets a finish go that never says it's done", async () => {
    const onDone = jest.fn();
    const { mount, host } = await started(onDone);
    mount.finish();
    expect(host.send).toHaveBeenCalledWith({ ray: 'leave' });
    jest.advanceTimersByTime(4900);
    expect(onDone).not.toHaveBeenCalled(); // (a finish takes about 3 s at most)
    jest.advanceTimersByTime(200);
    expect(onDone).toHaveBeenCalledTimes(1);
    mount.dispose();
  });

  it('is done at once when it finishes out of sight, and when it goes out of sight mid-finish', async () => {
    const hidden = jest.fn();
    const first = await started(hidden);
    observers.intersection!([{ isIntersecting: false }]);
    first.mount.finish();
    expect(hidden).toHaveBeenCalledTimes(1);

    mockFilm.current = deferred();
    mockHosts.length = 0;
    const scrolledAway = jest.fn();
    const second = await started(scrolledAway);
    second.mount.finish();
    expect(scrolledAway).not.toHaveBeenCalled();
    observers.intersection!([{ isIntersecting: false }]);
    expect(scrolledAway).toHaveBeenCalledTimes(1);
  });

  it('draws its reduced-motion still again when its box changes size', async () => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
    })) as any;
    const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, jest.fn());
    mockFilm.current.resolve({});
    await flush();
    const host = mockHosts[0];
    host.onMessage({ ray: 'ready' });
    expect(host.send).toHaveBeenCalledWith({ ray: 'still' });
    host.send.mockClear();
    observers.resize!(); // (a new size empties his canvases)
    expect(host.send).toHaveBeenCalledWith({ ray: 'still' });
    mount.dispose();
  });
});
