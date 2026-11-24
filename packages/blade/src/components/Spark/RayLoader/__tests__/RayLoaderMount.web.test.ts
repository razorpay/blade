/* eslint-disable @typescript-eslint/no-explicit-any */
// The Ray loader's director, on a made-up film (its engine and film host stand-ins): when it's done, and what it never does after
// it's gone (each of these failed before the fresh-eyes review's fixes); and from Saurav's round-6 review, that it draws in the page's
// one frame loop and takes its box's size from the resize observer's entry.
import { RayLoaderMount } from '../RayLoaderMount';
import { bookFrame, unbookFrame } from '../../Ray/rayFrames';

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

const observers: {
  intersection: ((e: any[]) => void) | null;
  resize: ((e: any[]) => void) | null;
} = {
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
    constructor(cb: (e: any[]) => void) {
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
const started = async (
  onDone: () => void,
  onShown: () => void = jest.fn(),
): Promise<{ mount: RayLoaderMount; host: any }> => {
  const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, onDone, onShown);
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
    const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, onDone, jest.fn());
    (mount as any).finishNow(); // (as START_WAIT_MS gives up on a film that's slow to load)
    expect(onDone).toHaveBeenCalledTimes(1);
    mockFilm.current.resolve({});
    await flush();
    expect(mockHosts).toHaveLength(0);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('says nothing once it has gone, even if its film then fails to load', async () => {
    const onDone = jest.fn();
    const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, onDone, jest.fn());
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
    first.mount.dispose();
    second.mount.dispose();
  });

  it('draws its reduced-motion still again when its box changes size', async () => {
    window.matchMedia = ((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
    })) as any;
    const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, jest.fn(), jest.fn());
    mockFilm.current.resolve({});
    await flush();
    const host = mockHosts[0];
    host.onMessage({ ray: 'ready' });
    expect(host.send).toHaveBeenCalledWith({ ray: 'still' });
    host.send.mockClear();
    observers.resize!([{ contentRect: { width: 300, height: 192 } }]); // (a new size empties his canvases)
    expect(host.send).toHaveBeenCalledWith({ ray: 'still' });
    mount.dispose();
  });

  it("takes its box's size from the resize observer's entry, with no layout read", async () => {
    const root = document.createElement('div');
    const read = jest.spyOn(root, 'getBoundingClientRect');
    const mount = new RayLoaderMount(root, OPTIONS, jest.fn(), jest.fn());
    observers.resize!([{ contentRect: { width: 640, height: 192 } }]); // (its first entry, as the box is observed)
    mockFilm.current.resolve({});
    await flush();
    const host = mockHosts[0];
    expect(host.resize).toHaveBeenLastCalledWith(640, 192, expect.any(Number));
    observers.resize!([{ contentRect: { width: 320.4, height: 150 } }]);
    expect(host.resize).toHaveBeenLastCalledWith(320, 150, expect.any(Number));
    expect(read).not.toHaveBeenCalled();
    mount.dispose();
  });

  it("draws in the page's one frame loop, with the Rays, and none of its own", async () => {
    const { mount, host } = await started(jest.fn());
    const ray: { frame: jest.Mock } = { frame: jest.fn(() => bookFrame(ray)) }; // (a Ray on the page: booked again each frame)
    bookFrame(ray);
    jest.advanceTimersByTime(17); // (into the loop's rhythm)
    const raf = jest.spyOn(window, 'requestAnimationFrame');
    const ticks = host.tick.mock.calls.length;
    const rayFrames = ray.frame.mock.calls.length;
    jest.advanceTimersByTime(17 * 4); // (four animation frames)
    expect(host.tick.mock.calls.length - ticks).toBe(ray.frame.mock.calls.length - rayFrames); // (drawn as often as he is)
    expect(host.tick.mock.calls[ticks][0]).toBe(ray.frame.mock.calls[rayFrames][0]); // (in the same frames)
    expect(raf.mock.calls.length).toBe(ray.frame.mock.calls.length - rayFrames); // (one request a frame: the page's one loop)
    unbookFrame(ray);
    mount.dispose();
    const after = host.tick.mock.calls.length;
    jest.advanceTimersByTime(50);
    expect(host.tick.mock.calls.length).toBe(after); // (gone: out of the loop)
  });

  it("gives up on a film that never says it's ready after 8 s, with no frames spent waiting for it", () => {
    const onDone = jest.fn();
    const mount = new RayLoaderMount(document.createElement('div'), OPTIONS, onDone, jest.fn());
    const raf = jest.spyOn(window, 'requestAnimationFrame');
    observers.intersection!([{ isIntersecting: true }]); // (in sight, his film still downloading: his still covers the box)
    jest.advanceTimersByTime(1000);
    expect(raf.mock.calls.length).toBeLessThanOrEqual(1); // (not a frame a frame)
    jest.advanceTimersByTime(6900);
    expect(onDone).not.toHaveBeenCalled();
    jest.advanceTimersByTime(200);
    expect(onDone).toHaveBeenCalledTimes(1);
    mount.dispose();
  });

  it('says once when his film has first drawn him (the still goes then)', async () => {
    const onShown = jest.fn();
    const { mount } = await started(jest.fn(), onShown);
    jest.advanceTimersByTime(100); // (a few frames since his start)
    expect(onShown).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(200);
    expect(onShown).toHaveBeenCalledTimes(1);
    mount.dispose();
  });
});
