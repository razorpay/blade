/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * FilmHost
 *
 * The stand-in page a Ray Studio film runs against. Each film was written as a page of its own (in the prototype it was
 * embedded as a see-through iframe); here it runs inside the component, and the host gives it what its page gave it:
 * - its canvases, stacked in one layer
 * - a message channel in place of `parent.postMessage` / `addEventListener('message')`
 * - its saved tune in place of `localStorage` (no network: `fetch` answers "not found")
 * - the stage's size in place of `innerWidth` / `innerHeight` / `devicePixelRatio`
 * - animation frames driven by the component's one loop, and timers that stop when it is disposed
 * The film's own markup (panel, buttons) is parsed off-screen so its code finds the elements it expects.
 */
import type { FilmMessage, FilmModule, SharedFactory } from './engineTypes';

type Listener = (event: any) => void;

type FilmHostOptions = {
  film: FilmModule;
  tunes: Record<string, unknown>;
  shared: Record<string, SharedFactory>;
  onMessage: (message: FilmMessage) => void;
};

/**
 * Frees a canvas's memory now rather than at the next garbage collection (Safari caps the canvas memory a page may hold), with the
 * layers the engine keeps on it (\`_rayDots\`, \`_rayLook\`, …: its offscreen canvases, as big as it).
 */
const freeCanvas = (canvas: HTMLCanvasElement): void => {
  for (const key of Object.keys(canvas)) {
    const layer = (canvas as any)[key];
    if (key.startsWith('_ray') && layer instanceof HTMLCanvasElement) {
      freeCanvas(layer);
      Reflect.deleteProperty(canvas, key);
    }
  }
  canvas.width = 0;
  canvas.height = 0;
};

const NOT_FOUND = (): Promise<any> =>
  Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve(null),
    text: () => Promise.resolve(''),
    headers: { get: () => null },
  });

class FilmHost {
  readonly layer: HTMLDivElement;
  readonly env: Record<string, unknown>;
  innerWidth = 1;
  innerHeight = 1;
  devicePixelRatio = 1;
  /** How many of its frames have run: a film is shown once it has drawn a few since its start. */
  ticks = 0;

  private readonly listeners: Record<string, Set<Listener>> = {};
  private frames = new Map<number, FrameRequestCallback>();
  private nextFrame = 1;
  private readonly timeouts = new Set<ReturnType<typeof setTimeout>>();
  private readonly intervals = new Set<ReturnType<typeof setInterval>>();
  private readonly store = new Map<string, string>();
  private readonly modules: Record<string, unknown> = {};
  private readonly canvases: Record<string, HTMLCanvasElement> = {};
  private readonly made: HTMLCanvasElement[] = []; // every canvas the film draws on: its page's and the ones its script makes
  private readonly gls: WebGLRenderingContext[] = []; // its WebGL contexts (Searching's lens), let go of on dispose
  private readonly stubs: Record<string, HTMLElement> = {};
  private readonly ui: DocumentFragment;
  private readonly channel = new MessageChannel();
  private disposed = false;
  private failed = false;
  private readonly options: FilmHostOptions;

  constructor(options: FilmHostOptions) {
    this.options = options;
    const { film, tunes } = options;

    this.layer = document.createElement('div');
    this.layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    for (const id of film.canvases) {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
      this.canvases[id] = this.track(canvas);
      this.layer.append(canvas);
    }

    const template = document.createElement('template');
    template.innerHTML = film.ui;
    this.ui = template.content;

    for (const [key, record] of Object.entries(tunes)) this.store.set(key, JSON.stringify(record));

    // the film's parent.postMessage -> the component (a task later, as a real postMessage is)
    this.channel.port1.onmessage = (event) => {
      if (!this.disposed && event.data && typeof event.data === 'object')
        options.onMessage(event.data);
    };
    // the component's messages -> the film's 'message' listeners
    this.channel.port2.onmessage = (event) => this.dispatch('message', { data: event.data });

    const stub = (id: string): HTMLElement => (this.stubs[id] ??= document.createElement('div'));
    const root = document.createElement('div');
    const body = document.createElement('div');
    const on = (type: string, fn: Listener): void => {
      (this.listeners[type] ??= new Set()).add(fn);
    };
    const off = (type: string, fn: Listener): void => {
      this.listeners[type]?.delete(fn);
    };
    // live getters (the stage's size, the store's): read on each access, as a page's window would answer
    const live = <T extends object>(target: T, getters: Record<string, () => unknown>): T =>
      Object.defineProperties(
        target,
        Object.fromEntries(
          Object.entries(getters).map(([k, get]) => [k, { get, enumerable: true }]),
        ),
      );

    const fakeDocument = {
      getElementById: (id: string) =>
        this.canvases[id] ?? this.ui.getElementById(id) ?? stub(`#${id}`),
      querySelector: (selector: string) => this.ui.querySelector(selector),
      querySelectorAll: (selector: string) => this.ui.querySelectorAll(selector),
      createElement: (tag: string) => {
        const el = document.createElement(tag);
        return el instanceof HTMLCanvasElement ? this.track(el) : el;
      },
      createElementNS: (ns: string, tag: string) => document.createElementNS(ns, tag),
      documentElement: root,
      body,
      addEventListener: on,
      removeEventListener: off,
    };
    const fakeWindow = live<Record<string, unknown>>(
      { addEventListener: on, removeEventListener: off },
      {
        innerWidth: () => this.innerWidth,
        innerHeight: () => this.innerHeight,
        devicePixelRatio: () => this.devicePixelRatio,
      },
    );

    this.env = {
      document: fakeDocument,
      window: fakeWindow,
      location: { search: '?embed', protocol: 'https:', hostname: '', href: 'ray-film:?embed' },
      parent: { postMessage: (message: unknown) => this.channel.port2.postMessage(message) },
      navigator: {
        clipboard: { writeText: () => Promise.resolve() },
        userAgent: navigator.userAgent,
      },
      localStorage: live(
        {
          getItem: (key: string) => this.store.get(key) ?? null,
          setItem: (key: string, value: string) => this.store.set(key, String(value)),
          removeItem: (key: string) => this.store.delete(key),
          clear: () => this.store.clear(),
          key: (i: number) => [...this.store.keys()][i] ?? null,
        },
        { length: () => this.store.size },
      ),
      fetch: NOT_FOUND,
      addEventListener: on,
      removeEventListener: off,
      requestAnimationFrame: (cb: FrameRequestCallback) => {
        const id = this.nextFrame++;
        this.frames.set(id, cb);
        return id;
      },
      cancelAnimationFrame: (id: number) => this.frames.delete(id),
      setTimeout: (fn: () => void, ms?: number) => {
        const t = setTimeout(() => {
          this.timeouts.delete(t);
          if (!this.disposed) fn();
        }, ms);
        this.timeouts.add(t);
        return t;
      },
      clearTimeout: (t: ReturnType<typeof setTimeout>) => {
        clearTimeout(t);
        this.timeouts.delete(t);
      },
      setInterval: (fn: () => void, ms?: number) => {
        const t = setInterval(() => !this.disposed && fn(), ms);
        this.intervals.add(t);
        return t;
      },
      clearInterval: (t: ReturnType<typeof setInterval>) => {
        clearInterval(t);
        this.intervals.delete(t);
      },
    };
  }

  /** Runs the film's script (its page loading). It says `ready` when it can take messages. */
  start(): void {
    this.options.film.mount(this);
  }

  /** A shared module with state of its own (wardrobe, nightcap, tour, flip): one copy per film, as each page had. */
  mod(name: string): unknown {
    const factory = this.options.shared[name];
    if (!factory) throw new Error(`[Ray] no shared module ${name}`);
    return (this.modules[name] ??= factory(this));
  }

  /** A shared module the film has made already, else nothing (it isn't made just to be looked at). */
  peek(name: string): any {
    return this.modules[name];
  }

  /** The film's window: its stage's size in CSS px, at the page's pixel density. */
  resize(width: number, height: number, dpr: number): void {
    if (width === this.innerWidth && height === this.innerHeight && dpr === this.devicePixelRatio)
      return;
    this.innerWidth = width;
    this.innerHeight = height;
    this.devicePixelRatio = dpr;
    this.dispatch('resize', {});
  }

  /** A message to the film, as `contentWindow.postMessage` was. */
  send(message: FilmMessage): void {
    if (!this.disposed) this.channel.port1.postMessage(message);
  }

  /** One animation frame: runs what the film asked for since the last one. */
  tick(now: number): void {
    if (this.disposed || this.frames.size === 0) return;
    const due = this.frames;
    this.frames = new Map();
    this.ticks++;
    due.forEach((cb) => {
      try {
        cb(now);
      } catch (error: unknown) {
        // one film's fault never stops Ray: its frame is skipped, the rest of him goes on
        if (__DEV__ && !this.failed) console.error('[Ray] a film failed a frame', error);
        this.failed = true;
      }
    });
  }

  dispose(): void {
    this.disposed = true;
    this.frames.clear();
    this.timeouts.forEach((t) => clearTimeout(t));
    this.intervals.forEach((t) => clearInterval(t));
    Object.keys(this.listeners).forEach((type) => this.listeners[type].clear());
    this.channel.port1.close();
    this.channel.port2.close();
    this.layer.remove();
    // its memory, now: a WebGL context is let go of (else contexts pile up till the browser drops its oldest, maybe the app's own
    // chart or map), and every canvas it drew on is emptied (the PR review)
    this.gls.forEach((gl) => gl.getExtension('WEBGL_lose_context')?.loseContext());
    this.gls.length = 0;
    this.made.forEach(freeCanvas);
    this.made.length = 0;
  }

  /** A canvas of the film's: kept to be freed on dispose, and its WebGL context (if it takes one) noted. */
  private track(canvas: HTMLCanvasElement): HTMLCanvasElement {
    const getContext = canvas.getContext.bind(canvas) as (
      type: string,
      attributes?: unknown,
    ) => any;
    (canvas as any).getContext = (type: string, attributes?: unknown) => {
      const context = getContext(type, attributes);
      if (context && type.includes('webgl') && !this.gls.includes(context)) this.gls.push(context);
      return context;
    };
    this.made.push(canvas);
    return canvas;
  }

  private dispatch(type: string, event: Record<string, unknown>): void {
    if (this.disposed) return;
    this.listeners[type]?.forEach((fn) => fn(event));
  }
}

export { FilmHost, freeCanvas };
