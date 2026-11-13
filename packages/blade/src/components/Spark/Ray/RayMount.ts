/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * RayMount
 *
 * Ray's director: the stage he and his films are drawn on, the one animation loop, and who has him. The component says
 * what he should be doing (a state, hidden or not, watching an input); the director gets him there the way the dashboard
 * prototype (flow 9) does:
 * - answer films hand over to each other mid-move (the old one says where it left him, the next starts from there)
 * - a film gives him back at rest, where his own Ray (RayPlayer) draws the same frame, and takes him from rest
 * - an idle film plays its exit first (quicker when typing or the hop needs him), the coin flip always finishes
 * - back on the surface with nothing to do, his idle starts after a short wait
 */
import { FILMS, TUNES, RayCore } from './engine';
import { FilmHost, freeCanvas } from './FilmHost';
import { RayPlayer } from './RayPlayer';
import { RayEntrance } from './RayEntrance';
import type { Cycle } from './rayIdles';
import { idleAllowed, idleByClock, idleOfThisLoad } from './rayIdles';
import type { FilmMessage, FilmModule } from './engineTypes';
import type { RayIdle, RayState } from './types';

const RC = RayCore as any;

type ActiveState = Exclude<RayState, 'idle'>;
type Idle = Exclude<RayIdle, 'rotate' | 'time-of-day'>;

const ANSWER_ORDER: ActiveState[] = ['searching', 'calling', 'writing', 'working']; // an answer's states, in the order they come
const ANSWER_FILMS: Record<ActiveState, string> = {
  searching: 'search',
  calling: 'calling',
  writing: 'writing',
  working: 'laptop2',
};
const IDLE_FILMS: Partial<Record<Idle, string>> = {
  coffee: 'coffee',
  cash: 'cash',
  reading: 'readbox',
};
const FLIPPING_FILMS = new Set(['coffee', 'cash', 'readbox']); // the idle films that play the coin flip themselves
const IDLE_WAIT_MS = 400; // back with nothing to do: his idle starts after this
const TYPING_EXIT = 4; // an idle film's exit when he's needed to watch what's typed (the user: the typing look must start fast)
const HOP_EXIT = 1.6; // ... and when he hops off the surface (flow 9's P.f5LapQuick)
const HANDOFF_WAIT_MS = 160; // the next answer film starts anyway if the old one hasn't said where it left him
const FILM_SHOW_TICKS = 3; // a film shows once it has run this many frames since its start (fresh, never a stale canvas)
const UNDER_MS = 34; // his own canvas stays this long under a film that has just shown
const EXIT_WAIT_MS = 5000; // a film that never says it's done is let go
const START_WAIT_MS = 8000; // a film that never says it's ready (its chunk didn't load, its script threw) is given up on: he rests, and it's tried again
const REST_BLEND_MS = 320;
const NUDGE_AFTER_MS = 10000; // text in the box and nobody typing this long: the nudge (again this long after each one)
const WATCH_SETTLED_MS = 970; // his move out to the caret is over
const CLOCK_CHECK_MS = 30000; // idle="time-of-day": how often a Ray that's up checks the clock again
const STAGE_FRESH_MS = 1000; // with nothing moving the page, where his stage is on screen is measured again at most this often
const WIDTHS = { small: 38, medium: 48 };
// How far past his box the stage keeps (in his widths): what he draws there reaches 0.38 to the right (Calling's headset) and
// 0.27 below (Coffee's mug over the edge; the hop's 0.6 is under the floor cut), measured over every idle, flip, film, the hop
// and the dash (2026-11-10). The rest of the stage's 16 x 8 widths is cut off, so a scrolling parent doesn't scroll on into
// its empty right and bottom (the PR review). Its left and top run on: nothing scrolls there.
const ROOM_RIGHT = 1;
const ROOM_BELOW = 0.75;
// his own Ray's canvas (RayPlayer): the part of the stage he ever draws on, in his widths past his box. Measured over his idles,
// typing (and the nudge), the hover look, the flips (spam too), the hop, the sleep cycle with its cap and the answer's handoffs:
// 0.49 to the left (leaning to the caret), 1.03 above (a coin), 0.15 right, 0.16 below; this is about twice that.
const PLAYER_LEFT = 1;
const PLAYER_ABOVE = 2;
const PLAYER_RIGHT = 1;
const PLAYER_BELOW = 0.75;

/** His rest spot on the films' stage (Ray Studio's fitTravel for the embedded stage, zoomed so he is `w` wide). */
const geometry = (
  w: number,
): {
  width: number;
  height: number;
  zoom: number;
  left: number;
  floor: number;
  boxHeight: number;
} => {
  const FIG = RC.FIG;
  const bw = RC.BASE[2][0];
  const hR = -RC.BASE[2][1];
  const W = 404.5 * FIG;
  const travel = 1144 * FIG;
  const width = Math.round(16 * w);
  const height = Math.round(8 * w);
  const s0 = Math.min(
    (width * 0.3) / bw,
    (width * 0.9) / (bw + travel + 80),
    (height * 0.5) / hR,
    (height * 0.68 * 0.94) / hR,
  );
  const zoom = w / bw / s0;
  const ox = width / 2 - (bw / 2 - W / 2 - 168 * FIG) * s0;
  return {
    width,
    height,
    zoom,
    left: ox - (W / 2) * s0 * zoom,
    floor: height * 0.68,
    boxHeight: (w * hR) / bw,
  };
};

type Film = {
  id: string;
  host: FilmHost;
  ready: boolean;
  startTick: number;
  shownAt: number;
  going: boolean;
  goingSince: number; // when it started leaving under the next film (a handoff): it's let go if it never says it's done
  front: boolean;
  lastCursor: string;
};

type Holder =
  | {
      by: 'player';
      act: 'entrance' | 'rest' | 'idle' | 'watch' | 'back' | 'hiding' | 'gone' | 'showing';
      since: number;
    }
  | {
      by: 'film';
      id: string;
      kind: 'idle' | 'answer';
      leaving: false | 'exit' | 'handoff';
      next?: string;
      since: number;
      started: boolean;
      /** His own Ray keeps drawing him underneath until the film has drawn: it took him from there, or the old film's last pose. */
      underneath: boolean;
    };

type Want =
  | { kind: 'hidden' }
  | { kind: 'answer'; film: string }
  | { kind: 'watch' }
  | { kind: 'idle'; idle: Idle };

type RayMountOptions = {
  entrance: 'none' | 'dash';
  state: RayState;
  idle: RayIdle;
  size: keyof typeof WIDTHS;
  isHidden: boolean;
  isInteractive: boolean;
  colorScheme: 'light' | 'dark';
};

// ---- the caret's x on screen: measured text for an input, a mirror of the field for a textarea ----
let measure: CanvasRenderingContext2D | null = null;
// a textarea's mirror: one for the page, kept while a Ray is up, laid out on its own (contain: strict) so measuring it doesn't lay
// out the page (the PR review)
let mirror: HTMLDivElement | null = null;
const caretX = (
  el: HTMLInputElement | HTMLTextAreaElement,
  cs: CSSStyleDeclaration,
  left: number,
): number => {
  const at = el.selectionStart ?? el.value.length;
  if (el instanceof HTMLInputElement) {
    measure ??= document.createElement('canvas').getContext('2d');
    if (!measure) return left;
    // from the font's longhands, not the `font` shorthand some browsers (older Firefox) leave empty when it's computed (the PR review)
    measure.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    return left + measure.measureText(el.value.slice(0, at)).width - el.scrollLeft;
  }
  if (!mirror) {
    mirror = document.createElement('div');
    mirror.setAttribute('aria-hidden', 'true');
    document.body.append(mirror);
  }
  const s = mirror.style;
  for (const k of [
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'fontVariant',
    'fontStretch',
    'letterSpacing',
    'wordSpacing',
    'lineHeight',
    'textTransform',
    'paddingLeft',
    'paddingRight',
    'borderLeftWidth',
    'borderRightWidth',
    'boxSizing',
  ] as const)
    (s as any)[k] = cs[k];
  s.position = 'absolute';
  s.left = '0';
  s.top = '0';
  s.height = '1px';
  s.overflow = 'hidden';
  s.contain = 'strict';
  s.pointerEvents = 'none';
  s.visibility = 'hidden';
  s.whiteSpace = 'pre-wrap';
  s.overflowWrap = 'break-word';
  s.width = `${el.clientWidth}px`;
  // only the caret's own paragraph: a line break starts the wrapping again, so the text before it can't move the caret along its line
  const before = el.value.slice(0, at);
  mirror.textContent = before.slice(before.lastIndexOf('\n') + 1);
  const mark = document.createElement('span');
  mark.textContent = '​';
  mirror.append(mark);
  return left + mark.offsetLeft - parseFloat(cs.paddingLeft);
};

class RayMount {
  private readonly root: HTMLElement;
  private readonly stage: HTMLDivElement;
  private readonly room: HTMLDivElement; // the stage, cut to what he draws past his box (ROOM_RIGHT, ROOM_BELOW)
  private readonly player = new RayPlayer();
  private readonly films: Record<string, Film> = {};
  private readonly loading: Record<string, Promise<void>> = {};
  private readonly failed = new Set<string>(); // films that didn't start (giveUpOn): not tried again till state or idle changes
  private pendingFrom: unknown = null;
  private listened: HTMLInputElement | HTMLTextAreaElement | null = null;
  private entrance: RayEntrance | null = null;
  private lastTypeAt = 0;
  private caretCache: number | null = null; // the caret's gaze, till the text, the caret, a scroll or a resize moves it
  private options: RayMountOptions;
  private holder: Holder;
  private inputRef: { current: HTMLElement | null } | null = null;
  private playerIdle: Idle | null = null; // which idle his own Ray is playing (Look around, or the sleep cycle)
  private napped = false; // the sleep cycle has had him once (found asleep then; in awake after)
  private geo = geometry(48);
  private dpr = 1;
  private floorCut = ''; // the stage cut at his floor (a clip-path), and whether it's on now
  private cutOn = false;
  private raf = 0; // 1 while he's booked for the next frame
  private lastNow = 0;
  private isVisible = true;
  private stageAt: { left: number; top: number; at: number } | null = null; // see measureStage
  private settling: Film[] = []; // films that gave him back since the last frame: hidden, put to sleep and freed once his own Ray has drawn
  private readonly observer: IntersectionObserver | null = null;
  private readonly reducedMotion: boolean;
  private disposed = false;
  /** Called when he's hidden and out of sight: hopped off with nothing left to play (or hidden while off-screen). Ray's
   * `shouldUnmountWhenHidden` removes his box then. */
  onAway: (() => void) | null = null;
  private clockIdle: { idle: Cycle; checkedAt: number } | null = null; // idle="time-of-day": this Ray's own pick

  constructor(root: HTMLElement, options: RayMountOptions) {
    this.root = root;
    this.options = options;
    this.reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.stage = document.createElement('div');
    this.stage.style.cssText = 'position:absolute;left:0;top:0;pointer-events:none;';
    this.stage.append(this.player.canvas);
    this.room = document.createElement('div');
    this.room.style.cssText = 'position:absolute;overflow:hidden;pointer-events:none;';
    this.room.append(this.stage);
    root.append(this.room);

    const now = performance.now();
    this.holder = {
      by: 'player',
      act: options.isHidden ? 'gone' : 'rest',
      since: now - IDLE_WAIT_MS,
    };
    this.player.mode = options.colorScheme;
    this.layout();
    // the landing dash, once, as he first appears (not hidden, not with reduced motion, and not on a Sleep load: he's found asleep there)
    const firstIdle = this.idleOf(options.idle, now);
    if (
      options.entrance === 'dash' &&
      !options.isHidden &&
      !this.reducedMotion &&
      firstIdle !== 'sleep'
    )
      this.holder = { by: 'player', act: 'entrance', since: now };

    root.addEventListener('click', this.onClick);
    RayMount.join(this);
    if (typeof IntersectionObserver === 'function') {
      this.observer = new IntersectionObserver((entries) => {
        this.isVisible = entries.some((e) => e.isIntersecting);
        if (this.isVisible) this.start();
      });
      this.observer.observe(root);
    }
    this.start();
    // what he'll need first, loading now: the answer's films for a Ray that starts in one, else this load's idle film. With reduced
    // motion he never plays a film (one still frame), so none is loaded (the PR review)
    if (this.reducedMotion) {
      // (nothing to load)
    } else if (options.state !== 'idle') this.preloadAnswer();
    else {
      const first = IDLE_FILMS[firstIdle];
      if (first) this.film(first);
    }
    if (__DEV__) (root as any).__ray = this; // for checking him in a browser: el.__ray.debug
  }

  /** Development only: what the director and his own Ray are doing. */
  get debug(): Record<string, unknown> {
    return { holder: this.holder, want: this.want(), flip: this.player.flipState, geo: this.geo };
  }

  update(options: Partial<RayMountOptions>): void {
    const sizeChanged = options.size !== undefined && options.size !== this.options.size;
    const schemeChanged =
      options.colorScheme !== undefined && options.colorScheme !== this.options.colorScheme;
    if (options.idle !== undefined && options.idle !== this.options.idle) this.clockIdle = null; // (asked for again: picked again)
    if (
      (options.idle !== undefined && options.idle !== this.options.idle) ||
      (options.state !== undefined && options.state !== this.options.state)
    )
      this.failed.clear(); // asked for something else: a film that couldn't start may be tried again
    this.options = { ...this.options, ...options };
    if (this.options.state !== 'idle' && !this.reducedMotion) this.preloadAnswer();
    this.releaseFilms();
    if (sizeChanged) this.layout();
    if (schemeChanged) {
      this.player.mode = this.options.colorScheme;
      if (this.entrance) this.entrance.mode = this.options.colorScheme;
      Object.values(this.films).forEach((f) => {
        f.host.send({ ray: 'mode', mode: this.options.colorScheme });
        f.host.send(this.player.capAsk); // (his nightcap's colours follow too)
      });
    }
    this.start();
    if (this.options.isHidden && !this.isVisible) this.onAway?.(); // hidden while off-screen: nobody sees a hop, he's away now
  }

  /** The text field he watches (read live: it may mount after him). */
  setInputRef(ref: { current: HTMLElement | null } | null): void {
    this.inputRef = ref;
  }

  private get input(): HTMLInputElement | HTMLTextAreaElement | null {
    const el = this.inputRef?.current;
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el : null; // (only a text field has a caret)
  }

  /** A click on him: the coin flip where his idle allows it. */
  click(): void {
    if (!this.options.isInteractive || this.options.state !== 'idle' || this.options.isHidden)
      return;
    const h = this.holder;
    if (h.by === 'player') {
      if (h.act === 'watch' || h.act === 'back') {
        // clicked while he watches what's typed (the click takes the field's focus, so he's leaving it or about to): the flip,
        // from where he is, with his rest under it; his idle follows it, or the watch again if the field still has the focus
        // (the PR review: that first click was dropped)
        if (h.act === 'watch') this.player.unwatch();
        this.holder = { by: 'player', act: 'rest', since: performance.now() };
        this.player.click();
        return;
      }
      if (h.act === 'idle' || h.act === 'rest') this.player.click();
      return;
    }
    if (h.kind !== 'idle' || h.leaving || !h.started) return;
    if (FLIPPING_FILMS.has(h.id)) this.films[h.id].host.send({ ray: 'flip' });
  }

  dispose(): void {
    this.disposed = true;
    RayMount.leave(this);
    this.observer?.disconnect();
    this.root.removeEventListener('click', this.onClick);
    this.listened?.removeEventListener('input', this.onInput);
    this.entrance?.dispose();
    Object.values(this.films).forEach((f) => f.host.dispose());
    this.room.remove();
    freeCanvas(this.player.canvas); // his memory now, not at the next garbage collection (the PR review)
  }

  // ---- what he should be doing ----

  private want(): Want {
    const o = this.options;
    if (o.isHidden) return { kind: 'hidden' };
    if (o.state !== 'idle') {
      const film = ANSWER_FILMS[o.state];
      if (!this.failed.has(film)) return { kind: 'answer', film };
      return { kind: 'idle', idle: 'rest' }; // (its film couldn't start: at rest instead)
    }
    if (this.isTyping()) return { kind: 'watch' };
    const idle = this.idleOf(o.idle, performance.now());
    const film = IDLE_FILMS[idle];
    return { kind: 'idle', idle: film && this.failed.has(film) ? 'rest' : idle };
  }

  /**
   * His idle as asked; `rotate`: this page load's step of the cycle; `time-of-day`: by the clock as this Ray comes, and checked
   * again every half minute while he's up: an idle the hour has since ruled out (Coffee at 9pm, the nightcap at 6am) gives way to
   * another (the film plays its exit first), one it still allows stays.
   */
  private idleOf(idle: RayIdle, now: number): Idle {
    if (idle !== 'time-of-day') return idleOfThisLoad(idle);
    const C = this.clockIdle;
    if (!C) {
      this.clockIdle = { idle: idleByClock(), checkedAt: now };
      return this.clockIdle.idle;
    }
    if (now - C.checkedAt >= CLOCK_CHECK_MS) {
      C.checkedAt = now;
      if (!idleAllowed(C.idle, new Date().getHours())) C.idle = idleByClock(C.idle);
    }
    return C.idle;
  }

  private isTyping(): boolean {
    const el = this.input;
    return Boolean(el && el.value !== '' && document.activeElement === el);
  }

  // ---- getting him there ----

  private reconcile(now: number): void {
    // a film leaving under the next one that never says it's done is let go (else it's drawn, and kept, for good: the PR review)
    Object.values(this.films).forEach((film) => {
      if (film.going && now - film.goingSince > EXIT_WAIT_MS) this.goneUnder(film);
    });
    const want = this.want();
    const h = this.holder;

    if (h.by === 'film') {
      const film = this.films[h.id];
      if (!h.started) {
        if (now - h.since > START_WAIT_MS) this.giveUpOn(h.id, now);
        return;
      }
      if (h.leaving === 'handoff' && now - h.since > HANDOFF_WAIT_MS)
        this.handOn(film, h.next!, null);
      if (h.leaving === 'exit' && now - h.since > EXIT_WAIT_MS) this.filmDone(film);
      if (h.leaving) return;
      const stays =
        (want.kind === 'answer' && want.film === h.id) ||
        (want.kind === 'idle' && h.kind === 'idle' && IDLE_FILMS[want.idle] === h.id);
      if (stays) return;
      if (h.kind === 'answer' && want.kind === 'answer') {
        // a handoff mid-move: the old film says where it left him and plays its exit over the next one
        this.holder = { ...h, leaving: 'handoff', next: want.film, since: now };
        film.host.send({ ray: 'leave', handoff: true });
        return;
      }
      this.holder = { ...h, leaving: 'exit', since: now };
      if (h.kind === 'idle') {
        const pace = want.kind === 'watch' ? TYPING_EXIT : want.kind === 'hidden' ? HOP_EXIT : 1;
        film.host.send({ ray: 'pace', v: pace });
        film.host.send({ ray: 'leave' });
      } else film.host.send({ ray: 'leave', handoff: false });
      return;
    }

    // his own Ray has him; the coin flip always plays out first
    if (this.player.isFlipping) return;
    if (h.act === 'entrance') {
      // the dash plays out, unless typing, the hop or an answer needs him: then at rest at once (as the dashboard cuts it)
      if (want.kind !== 'idle') this.endEntrance(now);
      return;
    }
    const sinceMs = now - h.since;
    switch (want.kind) {
      case 'hidden':
        if (h.act !== 'hiding' && h.act !== 'gone') {
          this.holder = { by: 'player', act: 'hiding', since: now };
          this.player.hop('out', () => {
            this.holder = { by: 'player', act: 'gone', since: performance.now() };
          });
        }
        return;
      case 'answer':
        if (h.act === 'hiding' || h.act === 'showing') return;
        if (h.act === 'gone') {
          // a fresh answer row: the film's own entry brings him in
          this.startFilm(want.film, 'answer', null);
          return;
        }
        if (h.act !== 'rest') {
          this.toRest(now);
          return;
        }
        if (sinceMs >= REST_BLEND_MS) this.startFilm(want.film, 'answer', null);
        return;
      case 'watch':
        if (h.act === 'watch') {
          if (this.shouldNudge(now, h.since)) this.player.nudge(this.caretGaze());
          return;
        }
        if (h.act === 'gone') this.show(now);
        else if (h.act === 'rest' || h.act === 'idle' || h.act === 'back') {
          this.holder = { by: 'player', act: 'watch', since: now };
          this.caretCache = null;
          this.player.watch();
        }
        return;
      case 'idle': {
        if (h.act === 'gone') {
          this.show(now);
          return;
        }
        if (h.act === 'hiding' || h.act === 'showing') return;
        if (h.act === 'watch') {
          this.holder = { by: 'player', act: 'back', since: now };
          this.player.unwatch();
          return;
        }
        if (h.act === 'back') {
          if (sinceMs >= 240) this.holder = { by: 'player', act: 'rest', since: now };
          return;
        }
        const film = IDLE_FILMS[want.idle];
        if (h.act === 'idle') {
          // his own idle gives way at rest to another: a film's, or Look around <-> the sleep cycle
          if (film || want.idle !== this.playerIdle) this.toRest(now);
          return;
        }
        if (want.idle === 'rest' || sinceMs < IDLE_WAIT_MS) return; // 'rest': he stays at rest (an answer's row between its states)
        if (film) this.startFilm(film, 'idle', null);
        else {
          this.holder = { by: 'player', act: 'idle', since: now };
          this.playerIdle = want.idle;
          if (want.idle === 'sleep') {
            this.player.nap(!this.napped); // found asleep the first time; in awake after (and nodding off)
            this.napped = true;
          } else this.player.script('look', { loop: true });
        }
        break;
      }
      default:
    }
  }

  /** The dash is over (or cut short): his own Ray at rest in his place, his idle taking him on from there at once. */
  private endEntrance(now: number): void {
    this.entrance?.dispose();
    this.entrance = null;
    this.holder = { by: 'player', act: 'rest', since: now - IDLE_WAIT_MS };
    this.player.rest(0);
  }

  // the dash's canvas, made on its first frame (the surface's left edge is known by then): from 200 px inside the input's left edge, as
  // the dashboard starts him on the chat bar, or six of his widths along when he isn't given one
  private entranceFrame(now: number): void {
    if (!this.entrance) {
      const w = WIDTHS[this.options.size];
      const box = this.root.getBoundingClientRect();
      const input = this.input?.getBoundingClientRect();
      const distance = input ? box.left - (input.left + 200) : 6 * w;
      this.entrance = new RayEntrance({
        width: w,
        boxHeight: this.geo.boxHeight,
        distance: Math.max(2 * w, distance),
        dpr: this.dpr,
      });
      this.entrance.mode = this.options.colorScheme;
      this.root.append(this.entrance.canvas);
    }
    if (this.entrance.tick(now)) this.endEntrance(now);
  }

  private shouldNudge(now: number, since: number): boolean {
    if (this.player.isNudging || now - since < WATCH_SETTLED_MS || !this.input?.value) return false;
    return now - Math.max(this.lastTypeAt, since, this.player.nudgeEndedAt) >= NUDGE_AFTER_MS;
  }

  // every keystroke (an input event) restarts the nudge's wait, and cancels one that's playing
  private readonly onInput = (): void => {
    this.caretCache = null;
    this.lastTypeAt = performance.now();
    this.player.cancelNudge();
  };

  private listenToInput(): void {
    const el = this.input;
    if (el === this.listened) return;
    this.listened?.removeEventListener('input', this.onInput);
    el?.addEventListener('input', this.onInput);
    this.listened = el;
    this.caretCache = null;
  }

  private toRest(now: number): void {
    this.playerIdle = null;
    this.holder = { by: 'player', act: 'rest', since: now };
    this.player.rest(REST_BLEND_MS);
  }

  private show(now: number): void {
    this.holder = { by: 'player', act: 'showing', since: now };
    this.player.hop('in', () => {
      this.holder = { by: 'player', act: 'rest', since: performance.now() };
    });
  }

  // ---- films ----

  /** A film, if it's loaded; else its load starts (once) and it's null till then: it says 'ready' when it can start. */
  private film(id: string): Film | null {
    const existing = this.films[id];
    if (existing) return existing;
    if (!(id in this.loading)) {
      this.loading[id] = (FILMS as Record<string, () => Promise<FilmModule>>)
        [id]()
        .then((module) => {
          // loaded after it stopped being wanted (the answer moved on, his idle changed, it was given up on): not mounted, and
          // asked for again it loads again (from the cache) (the PR review: a late load mounted a film nothing would free)
          if (this.disposed || this.failed.has(id) || !this.wantedFilms().has(id)) {
            Reflect.deleteProperty(this.loading, id);
            return;
          }
          this.mountFilm(id, module);
        })
        .catch((error: unknown) => {
          if (__DEV__) console.error(`[Ray] the ${id} film failed to load`, error);
        });
    }
    return null;
  }

  /**
   * A film that never got going: let go, his own Ray at rest instead, and not tried again till what's asked of him changes
   * (`state`, `idle`), so a film that can't start isn't loaded again every few seconds (the PR review).
   */
  private giveUpOn(id: string, now: number): void {
    if (__DEV__) console.warn(`[Ray] the ${id} film didn't start; he rests instead`);
    this.failed.add(id);
    this.films[id]?.host.dispose();
    Reflect.deleteProperty(this.films, id);
    Reflect.deleteProperty(this.loading, id);
    this.holder = { by: 'player', act: 'rest', since: now };
    this.player.rest(REST_BLEND_MS);
  }

  private mountFilm(id: string, module: FilmModule): void {
    if (this.films[id]) return; // (a load that was given up on and asked for again: the first one in stays)
    const film: Film = {
      id,
      ready: false,
      startTick: Infinity,
      shownAt: Infinity,
      going: false,
      goingSince: 0,
      front: false,
      lastCursor: '',
      host: new FilmHost({
        film: module,
        tunes: TUNES as Record<string, unknown>,
        shared: module.shared,
        onMessage: (m) => this.onFilmMessage(film, m),
      }),
    };
    film.host.layer.style.visibility = 'hidden';
    this.films[id] = film;
    this.stage.append(film.host.layer);
    film.host.resize(this.geo.width, this.geo.height, this.dpr);
    film.host.start();
  }

  private startFilm(id: string, kind: 'idle' | 'answer', from: unknown): void {
    const now = performance.now();
    if (this.failed.has(id)) {
      // (a handoff to a film that couldn't start: at rest from where the last one left him)
      this.holder = { by: 'player', act: 'rest', since: now };
      this.player.rest(REST_BLEND_MS);
      return;
    }
    const film = this.film(id);
    const underneath = (this.holder.by === 'player' && this.holder.act !== 'gone') || Boolean(from);
    this.holder = { by: 'film', id, kind, leaving: false, since: now, started: false, underneath };
    this.pendingFrom = from; // (his own Ray draws him meanwhile: at rest, or the pose the last film left him in)
    if (film?.ready) this.begin(film, from);
  }

  /**
   * The answer's films: the one for its state now and the next one, loaded ahead so each handover is instant (each film's
   * canvases are the stage's size, a few MB at 2x: not all four at once). The ones it's done with go (releaseFilms).
   */
  private preloadAnswer(): void {
    this.wantedAnswerFilms().forEach((id) => this.film(id));
  }

  private wantedAnswerFilms(): string[] {
    const { state } = this.options;
    if (state === 'idle') return [];
    const next = ANSWER_ORDER[ANSWER_ORDER.indexOf(state) + 1];
    const wanted = next ? [ANSWER_FILMS[state], ANSWER_FILMS[next]] : [ANSWER_FILMS[state]];
    return wanted.filter((id) => !this.failed.has(id));
  }

  /**
   * A film that isn't playing, leaving, the answer's now or next, or his idle's (he goes back to it after typing, a flip or an
   * answer) is let go: its canvases freed, loaded again if it's needed (its chunk is cached). An idle he's moved on from goes
   * too (time-of-day's clock, a new `idle`; the PR review).
   */
  /** The films he needs now: the answer's now and next, the one that has him, and his idle's. */
  private wantedFilms(): Set<string> {
    const h = this.holder;
    const keep = new Set(this.wantedAnswerFilms());
    if (h.by === 'film') keep.add(h.id);
    // his idle as already picked: tidying up doesn't pick for him (time-of-day) or touch storage (the PR review)
    const { idle } = this.options;
    const current = idle === 'time-of-day' ? this.clockIdle?.idle : idleOfThisLoad(idle);
    const idleFilm = current ? IDLE_FILMS[current] : undefined;
    if (idleFilm) keep.add(idleFilm);
    return keep;
  }

  private releaseFilms(): void {
    const keep = this.wantedFilms();
    Object.values(this.films).forEach((film) => {
      if (keep.has(film.id) || film.going) return;
      film.host.dispose();
      Reflect.deleteProperty(this.films, film.id);
      Reflect.deleteProperty(this.loading, film.id);
    });
  }

  private begin(film: Film, from: unknown): void {
    const h = this.holder;
    if (h.by !== 'film' || h.id !== film.id) return;
    film.going = false;
    film.host.send({ ray: 'mode', mode: this.options.colorScheme });
    film.host.send({ ray: 'zoom', z: this.geo.zoom });
    if (h.kind === 'idle') film.host.send({ ray: 'pace', v: 1 });
    film.host.send(this.player.capAsk); // his nightcap, once the sleep cycle has put it on: the films wear it too (as flow 9's do)
    film.host.send(from ? { ray: 'start', from } : { ray: 'start' });
    film.startTick = film.host.ticks;
    film.shownAt = Infinity;
    this.holder = { ...h, started: true, since: performance.now() };
  }

  /** An answer film hands him to the next one, from where it left him. */
  private handOn(old: Film, next: string, from: unknown): void {
    const h = this.holder;
    if (h.by !== 'film' || h.id !== old.id || h.leaving !== 'handoff') return;
    old.going = true;
    old.goingSince = performance.now();
    if (from) this.player.hold(from); // the old film has stopped drawing him: his own Ray holds that pose till the next one draws
    this.startFilm(next, 'answer', from);
  }

  /** A film that played its exit under the next one is done: it sleeps, hidden (and is freed if it isn't wanted). */
  private goneUnder(film: Film): void {
    film.going = false;
    film.shownAt = Infinity;
    film.startTick = Infinity;
    film.host.layer.style.visibility = 'hidden';
    film.host.send({ ray: 'sleep' });
    this.releaseFilms();
  }

  /**
   * A film gave him back at rest: his own Ray takes over there. The film stays up, as it last drew him, till his own Ray has drawn
   * him in the next frame (draw() hides it then, and settle() puts it to sleep and frees it), so the swap is one frame: there's no
   * moment, painted or not, with neither showing him (the PR review saw one between the 'done' message and the next frame).
   */
  private filmDone(film: Film): void {
    film.going = false;
    film.shownAt = Infinity;
    film.startTick = Infinity;
    const h = this.holder;
    if (h.by === 'film' && h.id === film.id) {
      this.holder = { by: 'player', act: 'rest', since: performance.now() };
      this.player.rest(0);
    }
    this.settling.push(film);
  }

  /** After a frame's draw: the films that gave him back sleep, and those not wanted are freed. */
  private settle(): void {
    if (!this.settling.length) return;
    this.settling.forEach((film) => film.host.send({ ray: 'sleep' }));
    this.settling = [];
    this.releaseFilms();
  }

  private onFilmMessage(film: Film, m: FilmMessage): void {
    if (this.disposed) return;
    const h = this.holder;
    const mine = h.by === 'film' && h.id === film.id;
    switch (m.ray) {
      case 'ready': {
        film.ready = true;
        film.host.send({ ray: 'mode', mode: this.options.colorScheme });
        film.host.send({ ray: 'zoom', z: this.geo.zoom });
        if (mine && h.by === 'film' && !h.started) this.begin(film, this.pendingFrom);
        else if (!mine) film.host.send({ ray: 'sleep' });
        break;
      }
      case 'left':
        if (mine && h.by === 'film' && h.leaving === 'handoff') this.handOn(film, h.next!, m.f);
        break;
      case 'front':
        film.front = Boolean(m.v);
        break;
      case 'done':
        if (mine && h.by === 'film' && h.leaving === 'exit') this.filmDone(film);
        else if (film.going) this.goneUnder(film);
        break;
      default:
    }
  }

  // ---- the loop ----

  private start(): void {
    if (this.disposed || this.raf || !this.isVisible) return;
    this.raf = 1;
    RayMount.book(this);
  }

  /** The start of his frame, before any Ray on the page writes: what he needs measured (his stage, the caret) is read now. */
  private readLayout(now: number): void {
    if (this.disposed || this.reducedMotion) return;
    if (RayMount.pointer && (!this.stageAt || now - this.stageAt.at > STAGE_FRESH_MS))
      this.measureStage(now);
    if (this.caretCache === null && this.isTyping()) this.caretGaze();
  }

  private readonly frame = (now: number): void => {
    this.raf = 0;
    if (this.disposed) return;
    if (this.isVisible && !this.reducedMotion) {
      this.raf = 1; // booked first: a bad frame never stops him
      RayMount.book(this);
    }
    const dt = this.lastNow ? Math.min(50, Math.max(0, now - this.lastNow)) : 16;
    this.lastNow = now;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (dpr !== this.dpr) this.layout();

    if (this.reducedMotion) {
      // one still frame: at rest, or none while he's hidden (no hop: he's simply there or not; update() draws it again)
      const shown = !this.options.isHidden;
      this.player.canvas.style.visibility = shown ? '' : 'hidden';
      this.player.rest(0);
      if (shown) this.player.tick(now, 0, { pointer: null, gaze: null, hover: false });
      else {
        this.player.clear();
        this.onAway?.();
      }
      return;
    }

    this.listenToInput();
    this.reconcile(now);
    this.draw(now, dt);
    this.settle();
    if (this.isAway()) {
      RayMount.unbook(this); // hidden and done going: nothing moves till he's asked back (update() starts him again)
      this.raf = 0;
      this.onAway?.();
    }
  };

  /** Hidden, hopped off, no film still leaving and nothing else to play: the loop can stop (the PR review: a hidden Ray drew on at 60fps). */
  private isAway(): boolean {
    const h = this.holder;
    return (
      h.by === 'player' &&
      h.act === 'gone' &&
      Boolean(this.options.isHidden) &&
      !this.entrance &&
      !this.player.isFlipping &&
      !Object.values(this.films).some((f) => f.going)
    );
  }

  private draw(now: number, dt: number): void {
    if (this.holder.by === 'player' && this.holder.act === 'entrance') {
      this.player.clear();
      this.player.canvas.style.visibility = 'hidden';
      this.entranceFrame(now);
      if (this.entrance) return; // (over: his own Ray takes him on this same frame, so there's no frame without him)
    }
    const h = this.holder;
    const current = h.by === 'film' ? this.films[h.id] : null;
    const filmShown = Boolean(
      current &&
        h.by === 'film' &&
        h.started &&
        current.host.ticks >= current.startTick + FILM_SHOW_TICKS,
    );
    if (current && filmShown && current.shownAt === Infinity) current.shownAt = now;
    const clickable =
      this.options.isInteractive && this.options.state === 'idle' && !this.options.isHidden;
    const cursor = clickable ? 'pointer' : '';
    if (this.root.style.cursor !== cursor) this.root.style.cursor = cursor;
    // his own Ray draws until a film has taken him (and a frame after, so there's never a gap)
    const playerOn =
      h.by === 'player'
        ? h.act !== 'gone'
        : h.underneath && (!filmShown || now - current!.shownAt < UNDER_MS);
    // his floor is the top of what he sits on: while he hops down or a coin falls past it, they go behind it; the rest of the time
    // nothing's cut (the mug he holds out over the box's edge, the magnifier's handle below the answer's line stay in front)
    const flipFilm =
      current && h.by === 'film' && FLIPPING_FILMS.has(h.id) ? current.host.peek('rayFlip') : null;
    const cut =
      (h.by === 'player' && (h.act === 'hiding' || h.act === 'gone' || h.act === 'showing')) ||
      Boolean(this.player.flipState.on) ||
      Boolean(flipFilm?.COINFLIP.on);
    if (cut !== this.cutOn) {
      this.cutOn = cut;
      this.stage.style.clipPath = cut ? this.floorCut : '';
    }
    const { pointer } = RayMount;
    const stage = pointer ? this.stageAt : null; // (measured at the start of the frame: readLayout)
    const raw: [number, number] | null =
      pointer && stage ? [pointer[0] - stage.left, pointer[1] - stage.top] : null;
    const local = raw ? this.reach(raw[0], raw[1]) : null;

    if (playerOn) {
      this.player.canvas.style.visibility = '';
      const idleish = h.by === 'player' && (h.act === 'idle' || h.act === 'rest');
      let gaze: number | null = null;
      if (h.by === 'player' && h.act === 'watch' && this.input) gaze = this.caretGaze();
      this.player.tick(now, dt, {
        pointer: local && idleish ? this.player.toWorld(local[0], local[1], this.dpr) : null,
        gaze,
        hover: this.options.isInteractive && idleish,
        // (asleep, a pointer near him wakes him: where it really is, not brought in)
        near:
          raw && this.options.isInteractive ? this.player.toWorld(raw[0], raw[1], this.dpr) : null,
      });
    } else {
      this.player.clear();
      this.player.canvas.style.visibility = 'hidden';
    }

    Object.values(this.films).forEach((film) => {
      const shown = (film === current && filmShown) || film.going;
      film.host.layer.style.visibility = shown ? '' : 'hidden';
      film.host.layer.style.zIndex = film.going ? (film.front ? '4' : '2') : '3';
      if (shown && film === current && h.by === 'film' && h.kind === 'idle')
        this.sendCursor(film, local);
      film.host.tick(now);
    });
  }

  /**
   * The pointer anywhere on the page, brought in along its direction to the edge of his hover range: he looks at it wherever it
   * is (his own Ray's hover look and the films' are Ray Studio's, which only see a pointer near him).
   */
  private reach(x: number, y: number): [number, number] {
    const w = WIDTHS[this.options.size];
    const g = this.geo;
    const cx = g.left + w / 2;
    const cy = g.floor - g.boxHeight / 2;
    const range = ((RC.HOVER.reach * RC.FIG * w) / RC.BASE[2][0]) * 0.98;
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.hypot(dx, dy);
    return d <= range ? [x, y] : [cx + (dx * range) / d, cy + (dy * range) / d];
  }

  private sendCursor(film: Film, local: number[] | null): void {
    const near = this.options.isInteractive && local;
    const key = near ? `${Math.round(local[0])},${Math.round(local[1])}` : 'none';
    if (key === film.lastCursor) return;
    film.lastCursor = key;
    film.host.send(
      near ? { ray: 'cursor', x: local[0], y: local[1] } : { ray: 'cursor', x: null, y: null },
    );
  }

  /**
   * The caret along the input (0..1), and where it is from his middle as his gaze reads it (left of him looks left). Measured
   * (styles, boxes, a textarea's mirror) only once something can have moved it: the text, the caret, a scroll, a resize.
   */
  private caretGaze(): number {
    if (this.caretCache !== null) return this.caretCache;
    const el = this.input!;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const left = r.left + parseFloat(cs.paddingLeft);
    const right = r.right - parseFloat(cs.paddingRight);
    const x = caretX(el, cs, left);
    this.player.setCaret((x - left) / Math.max(1, right - left));
    const box = this.root.getBoundingClientRect();
    const middle = box.left + box.width / 2;
    const span = Math.max(40, middle - r.left);
    this.caretCache = Math.max(-1, Math.min(0.15, ((x - middle) / span) * 1.15));
    return this.caretCache;
  }

  private layout(): void {
    const w = WIDTHS[this.options.size];
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.geo = geometry(w);
    const g = this.geo;
    this.floorCut = `inset(0 0 ${(g.height - g.floor).toFixed(2)}px 0)`;
    Object.assign(this.stage.style, {
      width: `${g.width}px`,
      height: `${g.height}px`,
      clipPath: this.cutOn ? this.floorCut : '',
    });
    Object.assign(this.room.style, {
      width: `${(g.left + w * (1 + ROOM_RIGHT)).toFixed(2)}px`,
      height: `${(g.floor + w * ROOM_BELOW).toFixed(2)}px`,
      left: `${(-g.left).toFixed(2)}px`,
      top: `${(g.boxHeight - g.floor).toFixed(2)}px`,
    });
    const top = g.floor - g.boxHeight; // his box's top on the stage
    const x0 = Math.max(0, g.left - w * PLAYER_LEFT);
    const y0 = Math.max(0, top - w * PLAYER_ABOVE);
    this.player.place(
      {
        x: x0,
        y: y0,
        width: Math.min(g.width, g.left + w * (1 + PLAYER_RIGHT)) - x0,
        height: Math.min(g.height, g.floor + w * PLAYER_BELOW) - y0,
      },
      g.left,
      g.floor,
      w,
      this.dpr,
    );
    this.stageAt = null;
    Object.values(this.films).forEach((f) => {
      f.host.resize(g.width, g.height, this.dpr);
      f.host.send({ ray: 'zoom', z: g.zoom });
    });
  }

  private readonly onClick = (): void => this.click();

  /**
   * Where his stage is on screen, to bring the pointer in. Measured at the start of a frame (readLayout), before any Ray writes,
   * only when a scroll or a resize has dropped it or it's a second old (a layout shift with nothing else moving): not every frame
   * after the frame's style writes, which forced a layout a frame for each Ray (the PR reviews, 2026-11-10 and -13).
   */
  private measureStage(now: number): void {
    const r = this.stage.getBoundingClientRect();
    this.stageAt = { left: r.left, top: r.top, at: now };
  }

  // ---- what every Ray on the page shares (the PR review): one set of page listeners, and one frame loop that first lets every
  // Ray read what it needs measured, then lets every Ray draw, so no Ray's reading comes after another's writes ----

  private static readonly up = new Set<RayMount>(); // every Ray mounted: the page listeners are on while there's one
  private static readonly booked = new Set<RayMount>(); // the Rays that want the next frame
  private static raf = 0;
  private static pointer: [number, number] | null = null; // the pointer on the page (CSS px), or null once it's left it

  private static readonly onFrame = (now: number): void => {
    RayMount.raf = 0;
    const due = [...RayMount.booked];
    RayMount.booked.clear();
    due.forEach((m) => RayMount.guard(() => m.readLayout(now)));
    due.forEach((m) => RayMount.guard(() => m.frame(now)));
  };

  /** One Ray's fault never stops another: it's reported as an uncaught error would be, and the rest draw on. */
  private static guard(run: () => void): void {
    try {
      run();
    } catch (error: unknown) {
      queueMicrotask(() => {
        throw error;
      });
    }
  }

  private static book(m: RayMount): void {
    RayMount.booked.add(m);
    if (!RayMount.raf) RayMount.raf = requestAnimationFrame(RayMount.onFrame);
  }

  private static unbook(m: RayMount): void {
    RayMount.booked.delete(m);
    if (RayMount.booked.size || !RayMount.raf) return;
    cancelAnimationFrame(RayMount.raf);
    RayMount.raf = 0;
  }

  private static readonly onPointerMove = (e: PointerEvent): void => {
    RayMount.pointer = [e.clientX, e.clientY];
  };

  private static readonly onPointerLeave = (): void => {
    RayMount.pointer = null;
  };

  // a scroll (any scroller: capture) or a resize moves his stage and the caret on screen, a selection change the caret: each only
  // marks them to be measured again, at the start of his next frame
  private static readonly onViewMove = (): void =>
    RayMount.up.forEach((m) => {
      m.caretCache = null;
      m.stageAt = null;
    });

  private static readonly onCaretMove = (): void =>
    RayMount.up.forEach((m) => {
      m.caretCache = null;
    });

  private static join(m: RayMount): void {
    if (!RayMount.up.size) {
      window.addEventListener('pointermove', RayMount.onPointerMove, { passive: true });
      document.addEventListener('selectionchange', RayMount.onCaretMove);
      window.addEventListener('scroll', RayMount.onViewMove, { capture: true, passive: true });
      window.addEventListener('resize', RayMount.onViewMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', RayMount.onPointerLeave);
    }
    RayMount.up.add(m);
  }

  private static leave(m: RayMount): void {
    RayMount.unbook(m);
    if (!RayMount.up.delete(m) || RayMount.up.size) return;
    window.removeEventListener('pointermove', RayMount.onPointerMove);
    document.removeEventListener('selectionchange', RayMount.onCaretMove);
    window.removeEventListener('scroll', RayMount.onViewMove, { capture: true });
    window.removeEventListener('resize', RayMount.onViewMove);
    document.documentElement.removeEventListener('pointerleave', RayMount.onPointerLeave);
    RayMount.pointer = null;
    mirror?.remove();
    mirror = null;
  }
}

/** His box on the page (his rest footprint, CSS px): the layout never changes with what he does. */
const rayBoxSize = (size: keyof typeof WIDTHS): { width: number; height: number } => {
  const w = WIDTHS[size];
  return { width: w, height: Number(geometry(w).boxHeight.toFixed(2)) };
};

export { RayMount, rayBoxSize };
export type { RayMountOptions };
