/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * RayLoaderMount
 *
 * The Ray loader's director: Ray Studio's Dash film (films/dash.html, "Blast") on a stage that is the loader's whole box, run by the
 * same film host and engine as Ray's own films (FilmHost). It isn't Ray on his seat: there's no rest to hand him over at and no Ray of
 * the component's own, only the film's path across the box.
 * - The box only has the wind on it: Ray is drawn on a canvas of his own around him (2.6 x 2 of his widths), moved with him, so his
 *   look's layers are his size, not the box's (Saurav's round-6 review: 11.5 MB of canvases for a full-width box, 1.4 MB now).
 * - It draws in the page's one frame loop with Ray's (rayFrames), at its pace (rayPace), and its box's size comes from the resize
 *   observer's entry (no layout read).
 * - It loads only when a loader mounts (its film is a chunk of its own), and its first frame is drawn unseen (FilmHost's rehearse)
 *   before he starts, so that frame's one-off work isn't in a frame anyone sees.
 * - Started, he charges and dashes, and holds the dash while loading; `finish()` plays the slide, the turn, the jump and the drop
 *   through the floor, and calls `onDone` once he's gone.
 * - Reduced motion: one still frame of the dash while loading (drawn again when the box changes size), and done as soon as the page
 *   is ready.
 * - Off-screen, it doesn't draw; its stage follows the box's size. Finished off-screen (or a film that never says it's done), it's done
 *   at once (or after FINISH_WAIT_MS), so a page never waits on a finish nobody sees.
 */
import { FilmHost } from '../Ray/FilmHost';
import { RAY_BOX } from '../Ray/rayBox';
import { bookFrame, unbookFrame } from '../Ray/rayFrames';
import type { FrameClient } from '../Ray/rayFrames';
import type { FilmMessage, FilmModule } from '../Ray/engineTypes';

const START_WAIT_MS = 8000; // a film that never says it's ready is given up on: the loader is done when the page is
const FINISH_WAIT_MS = 5000; // a finish that never says it's done (its frames stopped, a film error) is let go: about 3 s at most otherwise
const STILL_TICKS = 4; // reduced motion: frames ticked for the still (its messages come a task later, then it draws)
const SHOW_TICKS = 3; // it shows once it has run this many frames since its start (never the canvas it was asleep on)

type RayLoaderMountOptions = {
  size: keyof typeof RAY_BOX; // (his width: Ray's own sizes)
  colorScheme: 'light' | 'dark';
};

class RayLoaderMount {
  private readonly root: HTMLElement;
  private options: RayLoaderMountOptions;
  private readonly onDone: () => void;
  private readonly onShown: () => void;
  private readonly reducedMotion: boolean;
  private host: FilmHost | null = null;
  private isReady = false;
  private hasStarted = false;
  private isFinishing = false;
  private isDone = false;
  private isDisposed = false;
  private isVisible = true;
  private isShown = false;
  private size: [width: number, height: number] | null = null; // the box's (CSS px), from the resize observer
  private finishTimer: ReturnType<typeof setTimeout> | null = null;
  private stillTicks = 0;
  private startTick = 0;
  private startTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly observer: IntersectionObserver | null = null;
  private readonly resizeObserver: ResizeObserver | null = null;

  /** In the page's one frame loop (rayFrames). */
  private readonly client: FrameClient = { frame: (now) => this.frame(now) };

  constructor(
    root: HTMLElement,
    options: RayLoaderMountOptions,
    onDone: () => void,
    onShown: () => void, // (his film's first frame is up: the component's still can go)
  ) {
    this.root = root;
    this.options = options;
    this.onDone = onDone;
    this.onShown = onShown;
    this.reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof IntersectionObserver === 'function') {
      this.observer = new IntersectionObserver((entries) => {
        this.isVisible = entries.some((e) => e.isIntersecting);
        if (this.isVisible) this.book();
        else if (this.isFinishing) this.finishNow(); // (out of sight mid-finish: nothing draws it, so nothing would end it)
      });
      this.observer.observe(root);
    }
    if (typeof ResizeObserver === 'function') {
      // (the entry has the box's size: no layout read here; the box has no padding or border, so it's the stage's)
      this.resizeObserver = new ResizeObserver((entries) => {
        const box = entries[entries.length - 1].contentRect;
        this.size = [box.width, box.height];
        this.layout();
      });
      this.resizeObserver.observe(root);
    }
    // a film that never says it's ready is given up on (a timer, not a frame loop spinning while it downloads: his still covers the box)
    this.startTimer = setTimeout(() => {
      if (!this.isReady) this.finishNow();
    }, START_WAIT_MS);
    if (__DEV__) (root as any).__rayLoader = this; // for checking it in a browser: el.__rayLoader.debug
    import('../Ray/engine')
      .then(({ FILMS, TUNES }) =>
        (FILMS as Record<string, () => Promise<FilmModule>>).dash().then((film) => {
          if (this.isDisposed || this.isDone) return; // (gone, or given up on: START_WAIT_MS)
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
        if (this.isDisposed) return;
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
      shown: this.isShown,
    };
  }

  update(options: Partial<RayLoaderMountOptions>): void {
    const sizeChanged = options.size !== undefined && options.size !== this.options.size;
    const schemeChanged =
      options.colorScheme !== undefined && options.colorScheme !== this.options.colorScheme;
    this.options = { ...this.options, ...options };
    // (done: his film is asleep and stays so; a theme or size change mustn't message it, nor, with reduced motion, wake it for its still)
    if (!this.host || !this.isReady || this.isDone || this.isDisposed) return;
    if (schemeChanged) this.host.send({ ray: 'mode', mode: this.options.colorScheme });
    if (sizeChanged) this.host.send({ ray: 'dash', px: RAY_BOX[this.options.size].width });
    if (this.reducedMotion && (schemeChanged || sizeChanged)) this.still();
  }

  /**
   * The page is ready: the finish, then onDone (at once if he hasn't started, with reduced motion, or out of sight, where nothing
   * draws it; at the latest FINISH_WAIT_MS on).
   */
  finish(): void {
    if (this.isDone || this.isFinishing || this.isDisposed) return;
    if (!this.hasStarted || this.reducedMotion || !this.host || !this.isVisible) {
      this.finishNow();
      return;
    }
    this.isFinishing = true;
    this.host.send({ ray: 'leave' });
    this.finishTimer = setTimeout(() => this.finishNow(), FINISH_WAIT_MS);
    this.book();
  }

  dispose(): void {
    this.isDisposed = true;
    unbookFrame(this.client);
    this.clearTimers();
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    this.host?.dispose();
    this.host = null;
  }

  private clearTimers(): void {
    if (this.startTimer) clearTimeout(this.startTimer);
    if (this.finishTimer) clearTimeout(this.finishTimer);
    this.startTimer = null;
    this.finishTimer = null;
  }

  private finishNow(): void {
    if (this.isDone || this.isDisposed) return;
    this.isDone = true;
    this.clearTimers();
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
      this.host.send({ ray: 'dash', px: RAY_BOX[this.options.size].width });
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
    // (its film can come in before the observer's first entry: then the box is read once, here)
    const [width, height] = this.size ?? [this.root.clientWidth, this.root.clientHeight];
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.host.resize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)), dpr);
    // reduced motion: a new size empties his canvases, so his still is drawn again (it had stayed blank; the fresh-eyes review)
    if (this.reducedMotion && this.isReady && !this.isDone) this.still();
  }

  private book(): void {
    if (this.isDisposed || this.isDone || !this.isVisible) return;
    bookFrame(this.client); // (booked once however often it's asked)
  }

  /** His film's layer shown, once it has drawn him (and the component told, for its still). */
  private show(host: FilmHost): void {
    if (this.isShown) return;
    this.isShown = true;
    host.layer.style.visibility = '';
    this.onShown();
  }

  private frame(now: number): void {
    const host = this.host;
    if (this.isDisposed || this.isDone) return;
    if (!host || !this.isReady) return; // (booked again as its film comes in and says it's ready)
    if (this.reducedMotion) {
      host.tick(now);
      this.stillTicks += 1;
      if (this.stillTicks >= 2) this.show(host);
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
    } else if (host.ticks >= this.startTick + SHOW_TICKS) this.show(host);
    host.tick(now);
    this.book();
  }
}

export { RayLoaderMount };
export type { RayLoaderMountOptions };
