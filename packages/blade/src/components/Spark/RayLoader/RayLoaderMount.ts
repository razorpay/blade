/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * RayLoaderMount
 *
 * The Ray loader's director: Ray Studio's Dash film (films/dash.html, "Blast") on a stage that is the loader's whole box, run by the
 * same film host and engine as Ray's own films (FilmHost). It isn't Ray on his seat: there's no rest to hand him over at and no Ray of
 * the component's own, only the film's path across the box.
 * - It loads only when a loader mounts (its film is a chunk of its own), and its first frame is drawn unseen (FilmHost's rehearse)
 *   before he starts, so that frame's one-off work isn't in a frame anyone sees.
 * - Started, he charges and dashes, and holds the dash while loading; `finish()` plays the slide, the turn, the jump and the drop
 *   through the floor, and calls `onDone` once he's gone.
 * - Reduced motion: one still frame of the dash while loading, and done as soon as the page is ready.
 * - Off-screen, it doesn't draw; its stage follows the box's size.
 */
import { FilmHost } from '../Ray/FilmHost';
import type { FilmMessage, FilmModule } from '../Ray/engineTypes';

const WIDTHS = { small: 38, medium: 48 } as const;
const START_WAIT_MS = 8000; // a film that never says it's ready is given up on: the loader is done when the page is
const STILL_TICKS = 4; // reduced motion: frames ticked for the still (its messages come a task later, then it draws)
const SHOW_TICKS = 3; // it shows once it has run this many frames since its start (never the canvas it was asleep on)

type RayLoaderMountOptions = {
  size: keyof typeof WIDTHS;
  colorScheme: 'light' | 'dark';
};

class RayLoaderMount {
  private readonly root: HTMLElement;
  private options: RayLoaderMountOptions;
  private readonly onDone: () => void;
  private readonly reducedMotion: boolean;
  private host: FilmHost | null = null;
  private isReady = false;
  private hasStarted = false;
  private isFinishing = false;
  private isDone = false;
  private isDisposed = false;
  private isVisible = true;
  private raf = 0;
  private stillTicks = 0;
  private startTick = 0;
  private readonly startedAt = performance.now();
  private readonly observer: IntersectionObserver | null = null;
  private readonly resizeObserver: ResizeObserver | null = null;

  constructor(root: HTMLElement, options: RayLoaderMountOptions, onDone: () => void) {
    this.root = root;
    this.options = options;
    this.onDone = onDone;
    this.reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof IntersectionObserver === 'function') {
      this.observer = new IntersectionObserver((entries) => {
        this.isVisible = entries.some((e) => e.isIntersecting);
        if (this.isVisible) this.book();
      });
      this.observer.observe(root);
    }
    if (typeof ResizeObserver === 'function') {
      this.resizeObserver = new ResizeObserver(() => this.layout());
      this.resizeObserver.observe(root);
    }
    if (__DEV__) (root as any).__rayLoader = this; // for checking it in a browser: el.__rayLoader.debug
    import('../Ray/engine')
      .then(({ FILMS, TUNES }) =>
        (FILMS as Record<string, () => Promise<FilmModule>>).dash().then((film) => {
          if (this.isDisposed) return;
          this.host = new FilmHost({
            film,
            tunes: TUNES as Record<string, unknown>,
            shared: film.shared,
            onMessage: (m) => this.onFilmMessage(m),
          });
          this.root.append(this.host.layer);
          this.host.layer.style.visibility = 'hidden'; // (shown once it has drawn him)
          this.layout();
          this.host.start();
          this.book();
        }),
      )
      .catch((error: unknown) => {
        if (__DEV__) console.error('[RayLoader] his Dash film failed to load', error);
        this.finishNow();
      });
  }

  /** Development only: what it's doing. */
  get debug(): Record<string, unknown> {
    return {
      ready: this.isReady,
      started: this.hasStarted,
      finishing: this.isFinishing,
      done: this.isDone,
      shown: this.host?.layer.style.visibility === '',
    };
  }

  update(options: Partial<RayLoaderMountOptions>): void {
    const sizeChanged = options.size !== undefined && options.size !== this.options.size;
    const schemeChanged =
      options.colorScheme !== undefined && options.colorScheme !== this.options.colorScheme;
    this.options = { ...this.options, ...options };
    if (!this.host || !this.isReady) return;
    if (schemeChanged) this.host.send({ ray: 'mode', mode: this.options.colorScheme });
    if (sizeChanged) this.host.send({ ray: 'dash', px: WIDTHS[this.options.size] });
    if (this.reducedMotion && (schemeChanged || sizeChanged)) this.still();
  }

  /** The page is ready: the finish, then onDone (at once if he hasn't started, or with reduced motion). */
  finish(): void {
    if (this.isDone || this.isFinishing) return;
    if (!this.hasStarted || this.reducedMotion || !this.host) {
      this.finishNow();
      return;
    }
    this.isFinishing = true;
    this.host.send({ ray: 'leave' });
    this.book();
  }

  dispose(): void {
    this.isDisposed = true;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    this.host?.dispose();
    this.host = null;
  }

  private finishNow(): void {
    if (this.isDone) return;
    this.isDone = true;
    if (this.host) {
      this.host.layer.style.visibility = 'hidden';
      this.host.send({ ray: 'sleep' });
    }
    this.onDone();
  }

  private onFilmMessage(m: FilmMessage): void {
    if (this.isDisposed || !this.host) return;
    if (m.ray === 'ready') {
      this.isReady = true;
      this.host.send({ ray: 'mode', mode: this.options.colorScheme });
      this.host.send({ ray: 'dash', px: WIDTHS[this.options.size] });
      if (this.reducedMotion) this.still();
      else this.host.send({ ray: 'rehearse' }); // one frame unseen (its first draw's one-off work), then asleep: the start wakes it
      this.book();
      return;
    }
    if (m.ray === 'done' && this.isFinishing) this.finishNow();
  }

  /** Reduced motion: his still, drawn over the next few frames. */
  private still(): void {
    this.stillTicks = 0;
    this.host?.send({ ray: 'still' });
    this.book();
  }

  private layout(): void {
    if (!this.host) return;
    const r = this.root.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.host.resize(Math.max(1, Math.round(r.width)), Math.max(1, Math.round(r.height)), dpr);
  }

  private book(): void {
    if (this.raf || this.isDisposed || this.isDone || !this.isVisible) return;
    this.raf = requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number): void => {
    this.raf = 0;
    const host = this.host;
    if (this.isDisposed || this.isDone) return;
    if (!host || !this.isReady) {
      if (now - this.startedAt > START_WAIT_MS) this.finishNow();
      else this.book();
      return;
    }
    if (this.reducedMotion) {
      host.tick(now);
      this.stillTicks += 1;
      if (this.stillTicks >= 2) host.layer.style.visibility = '';
      if (this.stillTicks < STILL_TICKS) this.book();
      return;
    }
    if (!this.hasStarted) {
      // (the frame after its unseen one: he starts)
      if (host.rehearsed) {
        this.hasStarted = true;
        this.startTick = host.ticks;
        host.send({ ray: 'start' });
      }
    } else if (host.ticks >= this.startTick + SHOW_TICKS) host.layer.style.visibility = '';
    host.tick(now);
    this.book();
  };
}

export { RayLoaderMount, WIDTHS as RAY_LOADER_WIDTHS };
export type { RayLoaderMountOptions };
