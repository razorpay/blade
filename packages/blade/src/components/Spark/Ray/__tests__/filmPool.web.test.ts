/* eslint-disable @typescript-eslint/no-explicit-any */
// Ray's films handed from Ray to Ray (filmPool), and a film's messages going only to the Ray that has it (FilmHost's turns)
import { parkFilm, takeFilm, parkedFilms, emptyFilmPool, FILM_LINGER_MS } from '../filmPool';
import { FilmHost, isSoftwareRenderer, rendererCheck, resetRendererCheck } from '../FilmHost';
import type { FilmModule } from '../engineTypes';

const fakeHost = (canPark = true): any => ({
  canPark,
  park: jest.fn(),
  dispose: jest.fn(),
});

describe('filmPool', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('hands a film let go of to the next Ray that wants it, and lets it go after a moment if none does', () => {
    const search = fakeHost();
    parkFilm('search', search);
    expect(search.park).toHaveBeenCalledTimes(1);
    expect(search.dispose).not.toHaveBeenCalled();
    expect(takeFilm('calling')).toBe(null); // (only the same film)
    expect(takeFilm('search')).toBe(search);
    expect(takeFilm('search')).toBe(null); // (once)

    const lingering = fakeHost();
    parkFilm('search', lingering);
    jest.advanceTimersByTime(FILM_LINGER_MS - 10);
    expect(lingering.dispose).not.toHaveBeenCalled();
    jest.advanceTimersByTime(20);
    expect(lingering.dispose).toHaveBeenCalledTimes(1);
    expect(parkedFilms()).toBe(0);
  });

  it('parks one of each film and two in all, and never one that failed', () => {
    const first = fakeHost();
    const again = fakeHost();
    parkFilm('search', first);
    parkFilm('search', again); // (one of each: the second is let go)
    expect(again.dispose).toHaveBeenCalledTimes(1);
    const calling = fakeHost();
    const writing = fakeHost();
    parkFilm('calling', calling);
    parkFilm('writing', writing); // (two in all: the oldest goes)
    expect(first.dispose).toHaveBeenCalledTimes(1);
    expect(parkedFilms()).toBe(2);
    const broken = fakeHost(false);
    parkFilm('laptop2', broken);
    expect(broken.park).not.toHaveBeenCalled();
    expect(broken.dispose).toHaveBeenCalledTimes(1);
    takeFilm('calling');
    takeFilm('writing');
  });

  it("doesn't park a film with a WebGL lens while the page holds more than three", () => {
    const lensed = { ...fakeHost(), hasLens: true };
    FilmHost.lenses = 4; // (this one and three others)
    parkFilm('search', lensed);
    expect(lensed.park).not.toHaveBeenCalled();
    expect(lensed.dispose).toHaveBeenCalledTimes(1);
    FilmHost.lenses = 3;
    const fits = { ...fakeHost(), hasLens: true };
    parkFilm('search', fits);
    expect(fits.park).toHaveBeenCalledTimes(1);
    expect(takeFilm('search')).toBe(fits);
    FilmHost.lenses = 0;
  });
});

describe('FilmHost turns', () => {
  // (jsdom has no MessageChannel: one that delivers a task later, as the browser's does)
  class Port {
    other: Port | null = null;
    onmessage: ((event: { data: unknown }) => void) | null = null;
    postMessage(data: unknown): void {
      const to = this.other;
      setTimeout(() => to?.onmessage?.({ data }), 0);
    }

    close(): void {
      this.onmessage = null;
    }
  }
  class Channel {
    port1 = new Port();
    port2 = new Port();
    constructor() {
      this.port1.other = this.port2;
      this.port2.other = this.port1;
    }
  }
  const real = (global as any).MessageChannel;
  beforeAll(() => {
    (global as any).MessageChannel = Channel;
  });
  afterAll(() => {
    (global as any).MessageChannel = real;
  });
  // a film that says something each time it's told to start (as a film says 'ready', 'left' or 'done')
  const film: FilmModule = ({
    canvases: [],
    ui: '',
    shared: {},
    mount: ($h: any) => {
      $h.env.addEventListener('message', (e: any) => {
        if (e.data?.ray === 'start') $h.env.parent.postMessage({ ray: 'done', film: 'fake' });
      });
    },
  } as unknown) as FilmModule;
  const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

  it("gives a parked film's messages only to the Ray that adopts it, never what it said for the last one", async () => {
    const first = jest.fn();
    const host = new FilmHost({ film, tunes: {}, shared: {}, onMessage: first });
    host.start();
    host.send({ ray: 'start' });
    await tick();
    await tick();
    expect(first).toHaveBeenCalledWith({ ray: 'done', film: 'fake' });
    first.mockClear();

    host.send({ ray: 'start' }); // (its answer is on its way as it's parked)
    host.park();
    const next = jest.fn();
    host.adopt(next);
    await tick();
    await tick();
    expect(first).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled(); // (it was for the last Ray)

    host.send({ ray: 'start' });
    await tick();
    await tick();
    expect(next).toHaveBeenCalledWith({ ray: 'done', film: 'fake' });
    host.dispose();
  });
});

describe('isSoftwareRenderer', () => {
  it("names the renderers that draw on the CPU (RazorSense's list), and not a GPU", () => {
    [
      'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (LLVM 10.0.0) (0x0000C0DE)), SwiftShader driver)',
      'Google SwiftShader',
      'llvmpipe (LLVM 15.0.7, 256 bits)',
      'Microsoft Basic Render Driver',
      'virgl',
    ].forEach((name) => expect(isSoftwareRenderer(name)).toBe(true));
    [
      'ANGLE (Apple, ANGLE Metal Renderer: Apple M5 Pro, Unspecified Version)',
      'ANGLE (Intel, Intel(R) UHD Graphics (0x00009A49) Direct3D11 vs_5_0 ps_5_0, D3D11)',
      'ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11 vs_5_0 ps_5_0, D3D11)',
    ].forEach((name) => expect(isSoftwareRenderer(name)).toBe(false));
  });
});

describe('the pool when the page hides', () => {
  it('lets go of every parked film as the tab is hidden (its timers would be throttled)', () => {
    const host = fakeHost();
    parkFilm('search', host);
    const was = Object.getOwnPropertyDescriptor(document, 'visibilityState');
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(host.dispose).toHaveBeenCalledTimes(1);
    expect(parkedFilms()).toBe(0);
    if (was) Object.defineProperty(document, 'visibilityState', was);
    else Reflect.deleteProperty(document, 'visibilityState');
  });
});

describe('FilmHost lenses', () => {
  // (jsdom has neither a MessageChannel nor WebGL: a channel that delivers a task later, and a WebGL context named as asked)
  class Port {
    other: Port | null = null;
    onmessage: ((event: { data: unknown }) => void) | null = null;
    postMessage(data: unknown): void {
      const to = this.other;
      setTimeout(() => to?.onmessage?.({ data }), 0);
    }

    close(): void {
      this.onmessage = null;
    }
  }
  class Channel {
    port1 = new Port();
    port2 = new Port();
    constructor() {
      this.port1.other = this.port2;
      this.port2.other = this.port1;
    }
  }
  let renderer = 'ANGLE (Apple, ANGLE Metal Renderer: Apple M5 Pro, Unspecified Version)';
  const made: any[] = [];
  const realChannel = (global as any).MessageChannel;
  const realGetContext = HTMLCanvasElement.prototype.getContext;
  beforeAll(() => {
    (global as any).MessageChannel = Channel;
    (HTMLCanvasElement.prototype as any).getContext = function getContext(type: string) {
      if (!type.includes('webgl')) return null;
      let lost = false;
      const gl = {
        RENDERER: 0x1f01,
        getParameter: (p: number) => (p === 0x1f01 ? renderer : null),
        getExtension: (name: string) =>
          name === 'WEBGL_lose_context' ? { loseContext: () => (lost = true) } : null,
        isContextLost: () => lost,
        flush: () => undefined,
      };
      made.push(gl);
      return gl;
    };
  });
  afterAll(() => {
    (global as any).MessageChannel = realChannel;
    HTMLCanvasElement.prototype.getContext = realGetContext;
  });
  beforeEach(() => {
    resetRendererCheck();
    made.length = 0;
    emptyFilmPool();
  });

  // a film with a lens canvas that asks for WebGL as it mounts (as Searching does a moment after it's ready), and again on 'lens'
  const lensFilm: FilmModule = ({
    canvases: ['lens'],
    ui: '',
    shared: {},
    mount: ($h: any) => {
      const lens = $h.env.document.getElementById('lens');
      (window as any).__lensGl = lens.getContext('webgl');
      $h.env.addEventListener('message', (e: any) => {
        if (e.data?.ray === 'lens') (window as any).__lensGl = lens.getContext('webgl');
      });
    },
  } as unknown) as FilmModule;
  const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

  it('counts a film whose lens is made, and stops counting it as it goes', () => {
    const before = FilmHost.lenses;
    const host = new FilmHost({
      film: lensFilm,
      tunes: {},
      shared: {},
      onMessage: () => undefined,
    });
    host.start();
    expect(rendererCheck()).toBe(false);
    expect(host.hasLens).toBe(true);
    expect(FilmHost.lenses).toBe(before + 1);
    host.dispose();
    expect(FilmHost.lenses).toBe(before);
    expect(made[0].isContextLost()).toBe(true);
  });

  it('gives no lens where the renderer draws on the CPU, and counts none', () => {
    renderer = 'Google SwiftShader';
    const before = FilmHost.lenses;
    const host = new FilmHost({
      film: lensFilm,
      tunes: {},
      shared: {},
      onMessage: () => undefined,
    });
    host.start();
    expect(rendererCheck()).toBe(true);
    expect((window as any).__lensGl).toBe(null);
    expect(made[0].isContextLost()).toBe(true); // (the one the check was asked for, let go of)
    expect(host.hasLens).toBe(false);
    expect(FilmHost.lenses).toBe(before);
    host.dispose();
    renderer = 'ANGLE (Apple, ANGLE Metal Renderer: Apple M5 Pro, Unspecified Version)';
  });

  it("makes no lens while it's parked, and makes it once a Ray has it again", async () => {
    // (parked before its lens came: Searching's comes 250 ms after it's ready)
    const parkedHost = new FilmHost({
      film: ({
        canvases: ['lens'],
        ui: '',
        shared: {},
        mount: () => undefined,
      } as unknown) as FilmModule,
      tunes: {},
      shared: {},
      onMessage: () => undefined,
    });
    parkedHost.start();
    parkFilm('lensless', parkedHost);
    const lens = (parkedHost as any).canvases.lens as HTMLCanvasElement;
    expect(lens.getContext('webgl')).toBe(null); // (parked: none)
    expect(parkedHost.hasLens).toBe(false);
    expect(takeFilm('lensless')).toBe(parkedHost);
    parkedHost.adopt(() => undefined);
    expect(lens.getContext('webgl')).not.toBe(null); // (a Ray has it: made now)
    expect(parkedHost.hasLens).toBe(true);
    parkedHost.dispose();
    await tick();
  });

  it("isn't handed on once its lens is lost", () => {
    const host = new FilmHost({
      film: lensFilm,
      tunes: {},
      shared: {},
      onMessage: () => undefined,
    });
    host.start();
    expect(host.canPark).toBe(true);
    made[0].getExtension('WEBGL_lose_context').loseContext(); // (the browser took it back)
    expect(host.canPark).toBe(false);
    host.dispose();
  });
});
