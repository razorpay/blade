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
import { parkFilm, takeFilm } from './filmPool';
import { RayPlayer, SWAP_MS, WATCH_BACK_MS, WATCH_SETTLED_MS } from './RayPlayer';
import { paceFor } from './rayPace';
import { RayEntrance } from './RayEntrance';
import type { Cycle } from './rayIdles';
import { idleAllowed, idleByClock, idleOfThisLoad } from './rayIdles';
import type { FilmMessage, FilmModule, RayCoreApi } from './engineTypes';
import type { RayIdle, RayOutcome, RayState } from './types';

const RC: RayCoreApi = RayCore; // (typed: an export that no longer matches fails the type check)

type ActiveState = Exclude<RayState, 'idle'>;
type Idle = Exclude<RayIdle, 'rotate' | 'time-of-day'>;

// an answer's states, in the order they usually come (the next one's film is loaded ahead). The new ones (2026-11-24) go first, so
// the shipped states' preloads are as they were (searching -> calling -> writing -> working)
const ANSWER_ORDER: ActiveState[] = [
  'reading',
  'thinking',
  'searching',
  'calling',
  'writing',
  'working',
];
const ANSWER_FILMS: Record<ActiveState, string> = {
  searching: 'search',
  thinking: 'search', // (the magnifying glass too: an app can pass its steps' names as they are)
  reading: 'readbox', // (the box with the papers coming out: Reading box, also an idle)
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
// the states a film of their own plays on his seat (Ray Studio's droop.html and mic.html): offline (droop's malfunction), error (droop's
// sad, `outcome="error"`) and the mic (`isListening`). The cue tells the film which, before its start
type StateName = 'offline' | 'error' | 'mic';
const STATE_FILMS: Record<StateName, { film: string; cue?: FilmMessage }> = {
  offline: { film: 'droop', cue: { ray: 'droop', mode: 'mal' } },
  error: { film: 'droop', cue: { ray: 'droop', mode: 'sad' } },
  mic: { film: 'mic' },
};
const IDLE_WAIT_MS = 400; // back with nothing to do: his idle starts after this
const TYPING_EXIT = 4; // an idle film's exit when he's needed to watch what's typed (the user: the typing look must start fast)
const HOP_EXIT = 1.6; // ... and when he hops off the surface, goes offline, takes the mic out or plays an outcome (flow 9's P.f5LapQuick)
// the hops, as each Ray's own entry and exit, timed as flow 10.5 has them (measured there, 2026-11-23: its hide 465 ms to out of sight,
// its show 581 ms to landed; canon hide's are 467 and 583 at 1x). The chat box's Ray drops off at 1x as the question goes, and comes
// back up at 1.2x (HOP_BACK; 493 ms to landed), ending as he lands when an outcome is waiting, which starts there (flow 10.5's Success
// on his seat). The answer row's Ray jumps quicker both ways (ROW_HOP, the user, 2026-11-24: "the answer jumps should be faster, go
// with 1.7x if 10.5 is using 2x"; flow 10.5's rowHop plays at HS.spd 2): up out of his row with canon hide's second half (rowHop's
// window), his first film settling from that pose over 320 ms (its 'start' from); and down as soon as his film has put its prop away
// (its exit cut EXIT_CUT_MS after it; flow 10.5: 600 ms into the laptop's exit)
const HOP_BACK = 1.2;
const ROW_HOP = 1.7;
const ROW_RISE = { window: [1600, 2250] as [number, number], speed: ROW_HOP };
const TO_LANDED: [number, number] = [1600, 2190]; // canon hide: up out of the surface, landed at 2183
const EXIT_CUT_MS = 20;
const STILL_TICKS = 4; // reduced motion: a state's film is ticked this many frames for its still (its messages come a task later)
const STILL_SHOWN_TICK = 2; // ... and shown from this one, once it has drawn it

/** Run `fn` in the page's idle time (or soon, where there's no idle callback). */
const whenIdle = (fn: () => void, timeout: number): void => {
  if (typeof requestIdleCallback === 'function') requestIdleCallback(fn, { timeout });
  else setTimeout(fn, 0);
};
const HANDOFF_WAIT_MS = 160; // the next answer film starts anyway if the old one hasn't said where it left him
const FILM_SHOW_TICKS = 3; // a film shows once it has run this many frames since its start (fresh, never a stale canvas)
const UNDER_MS = 34; // his own canvas stays this long under a film that has just shown
const EXIT_WAIT_MS = 5000; // a film that never says it's done is let go
const START_WAIT_MS = 8000; // a film that never says it's ready (its chunk didn't load, its script threw) is given up on: he rests, and it's tried again
const ONE_SHOT_WAIT_MS = 12000; // a one-shot state's film (error) that never says it's done is let go
const ERROR_STILL_MS = 3000; // reduced motion: how long the error's still stays (about as long as it plays)
const REST_BLEND_MS = SWAP_MS; // his blend to rest, as his own Ray blends between moves (one number, in RayPlayer: the PR review)
const NUDGE_AFTER_MS = 10000; // text in the box and nobody typing this long: the nudge (again this long after each one)
const CLOCK_CHECK_MS = 30000; // idle="time-of-day": how often a Ray that's up checks the clock again
const PACE_EVERY_MS = 2000; // how often the pace the Rays draw at is looked at again (rayPace)
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
// 0.49 to the left (leaning to the caret), 1.03 above (a coin), 0.15 right, 0.16 below; this is about twice that. Success (canon, with
// its confetti; 2026-11-23) reaches 0.88 to the left, 1.13 above and 0.75 right (inside the room's ROOM_RIGHT)
const PLAYER_LEFT = 1.5;
const PLAYER_ABOVE = 2;
const PLAYER_RIGHT = 1;
const PLAYER_BELOW = 0.75;
// each film's canvases: the part of the stage it ever draws on, in his widths past his box to the left and above (razorpay/blade#4116).
// Measured over each film's loop, coin flips (spam too), the hover look, typing, the hop, handoffs and the nightcap (2026-11-16): to the
// left calling 0.04, writing 0.47, searching 0.60, laptop 1.26, coffee 0.72, cash 1.18, reading box 2.41; above 0.03 for the answer films
// (0.13 with the nightcap) and 1.03 for the idle films (a coin). These are about 1.5 times that; to the right and below they go to the
// room's edges (ROOM_RIGHT, ROOM_BELOW), past which nothing shows anyway
// (droop and mic, 2026-11-23, over every state, each glitch effect and eye frame, the jump back, the error and the mic out and in, with
// the nightcap: to the left droop 0.17, mic 0.46; above droop 0.27, mic 0.11; to the right 0.28 and below 0.05 at most)
const FILM_CROP: Record<string, [left: number, above: number]> = {
  calling: [0.5, 0.5],
  writing: [1, 0.5],
  search: [1.2, 0.5],
  laptop2: [2, 0.5],
  coffee: [1.4, 1.8],
  cash: [2, 1.8],
  readbox: [3.8, 1.8],
  droop: [0.3, 0.4],
  mic: [0.7, 0.2],
};

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
  /** Reduced motion: the still it was last asked for (its state, light / dark, zoom), and the frames since. */
  still: string;
  stillTicks: number;
};

type Holder =
  | {
      by: 'player';
      act:
        | 'entrance'
        | 'rest'
        | 'idle'
        | 'watch'
        | 'back'
        | 'hiding'
        | 'gone'
        | 'showing'
        | 'outcome';
      since: number;
    }
  | {
      by: 'film';
      id: string;
      kind: 'idle' | 'answer' | 'state';
      /** A state's film: which state it plays (droop plays two). */
      state?: StateName;
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
  | { kind: 'state'; state: StateName }
  | { kind: 'success' }
  | { kind: 'watch' }
  | { kind: 'idle'; idle: Idle };
// (the new states' wants, made once: want() runs every frame, for as long as he's offline or listening)
const WANT_OFFLINE: Want = { kind: 'state', state: 'offline' };
const WANT_ERROR: Want = { kind: 'state', state: 'error' };
const WANT_MIC: Want = { kind: 'state', state: 'mic' };
const WANT_SUCCESS: Want = { kind: 'success' };

type RayMountOptions = {
  entrance: 'none' | 'dash';
  state: RayState;
  idle: RayIdle;
  size: keyof typeof WIDTHS;
  isHidden: boolean;
  shouldReactToPointer: boolean;
  colorScheme: 'light' | 'dark';
  isOffline: boolean;
  isListening: boolean;
  outcome?: RayOutcome;
  /** every look in his films this many px of his box lower (− = higher): set in a film's script as it starts (Ray's _lookY) */
  lookY?: number;
  /** how much bigger than his box he's shown (Ray's _scale): his canvases drawn that much finer */
  scale?: number;
  /**
   * a state whose film stays loaded while he's idle (Ray's _preloadState): it starts at once when asked. He's only ever asked for
   * that one, so the answer's next film isn't loaded ahead of it
   */
  preload?: RayState;
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
  // `outcome`: from when it's set till it has played once (or been cut short by something that wins over it)
  private outcome: RayOutcome | null = null;
  // each time `outcome` is set (again, or to the other one), counted: one that ends is over only if it wasn't set again while it
  // played, so "Play again" or success -> error mid-play plays the next one after it (the fresh-eyes review)
  private outcomeSets = 0;
  private outcomeSetPlaying = -1; // the set that's playing
  /** Called when the outcome has had its turn (played, or cut short): Ray's next director doesn't play it again. */
  onOutcomeOver: (() => void) | null = null;
  private afterAnswer = false; // an answer's film has had him since he came up: he's the answer row's, his hop down at ROW_HOP
  private restReadyAt = 0; // his blend to rest (toRest) is over at this time
  private voiceStream: MediaStream | null = null;
  private stillTimer: ReturnType<typeof setTimeout> | null = null; // reduced motion: when the outcome's still has had its time
  // the voice's level, read once a frame while the mic film has him: one analyser, one buffer, no allocations
  private voice: {
    source: MediaStreamAudioSourceNode;
    analyser: AnalyserNode;
    buf: Float32Array;
    sent: number;
  } | null = null;
  private voiceFailed = false; // its stream couldn't be read (no audio track, no Web Audio): not tried again till a new stream

  constructor(root: HTMLElement, options: RayMountOptions) {
    this.root = root;
    this.options = options;
    this.player.eyeY = this.lookYWorld();
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
    // out of sight while hidden; and a Ray that appears in an answer's state (its row's) comes up out of the row first: his entry.
    // Not a Ray with a film kept loaded ahead (a button's, _preloadState): he's already in place, and his state can be asked for
    // before his code is in (a quick hover, or Tab, on a cold page), so he'd rise out of the button's edge before the glass
    this.holder = {
      by: 'player',
      act: options.isHidden || (options.state !== 'idle' && !options.preload) ? 'gone' : 'rest',
      since: now - IDLE_WAIT_MS,
    };
    this.player.mode = options.colorScheme;
    this.outcome = options.outcome ?? null;
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
    if (options.shouldReactToPointer) this.player.prepareFlip(); // (a Ray that can't be clicked never flips)
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
    this.loadStateFilms(); // (offline, the mic, an error: also for reduced motion, where their film draws their still)
    if (this.outcome === 'success') this.prepareSuccess();
    if (this.reducedMotion) {
      // (no answer or idle film: with reduced motion he plays none)
    } else if (options.state !== 'idle') this.preloadAnswer();
    else {
      // a state kept loaded ahead (_preloadState) too: as he mounts, not as it's first asked for (a button's first hover)
      if (options.preload) this.preloadAnswer();
      const first = IDLE_FILMS[firstIdle];
      if (first) this.film(first);
    }
    if (__DEV__) (root as any).__ray = this; // for checking him in a browser: el.__ray.debug
  }

  /** Development only: what the director and his own Ray are doing. */
  get debug(): Record<string, unknown> {
    return {
      holder: this.holder,
      want: this.want(),
      flip: this.player.flipState,
      geo: this.geo,
      pace: RayMount.pace,
    };
  }

  update(options: Partial<RayMountOptions>): void {
    const sizeChanged =
      (options.size !== undefined && options.size !== this.options.size) ||
      (options.scale !== undefined && options.scale !== this.options.scale);
    const outcomeChanged = 'outcome' in options && options.outcome !== this.options.outcome;
    const schemeChanged =
      options.colorScheme !== undefined && options.colorScheme !== this.options.colorScheme;
    if (options.idle !== undefined && options.idle !== this.options.idle) this.clockIdle = null; // (asked for again: picked again)
    if (
      (options.idle !== undefined && options.idle !== this.options.idle) ||
      (options.state !== undefined && options.state !== this.options.state) ||
      (options.isOffline !== undefined && options.isOffline !== this.options.isOffline) ||
      (options.isListening !== undefined && options.isListening !== this.options.isListening) ||
      outcomeChanged
    )
      this.failed.clear(); // asked for something else: a film that couldn't start may be tried again
    if (outcomeChanged) {
      // set: it plays once, when he can (set while one plays: after it); cleared before it has started: it doesn't (once it's
      // playing it plays out)
      if (options.outcome) {
        this.outcome = options.outcome;
        this.outcomeSets += 1;
        if (options.outcome === 'success') this.prepareSuccess();
      } else if (!this.outcomePlaying) this.outcome = null;
    }
    this.options = { ...this.options, ...options };
    this.player.eyeY = this.lookYWorld();
    if (!this.options.isListening) this.unlisten();
    this.loadStateFilms();
    if (this.options.shouldReactToPointer) this.player.prepareFlip();
    // (idle, only a film kept loaded ahead: _preloadState)
    if ((this.options.state !== 'idle' || this.options.preload) && !this.reducedMotion)
      this.preloadAnswer();
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

  /**
   * The page's voice (its own mic's stream), for the mic film's level while he listens. He never opens a mic himself. The audio is
   * set up in the page's idle time as it's handed over, so the page's first audio context (124 ms with a CPU 4x slower) isn't made
   * in the frame the mic comes out in.
   */
  setVoiceStream(stream: MediaStream | null): void {
    if (stream === this.voiceStream) return;
    this.unlisten();
    this.voiceStream = stream;
    this.voiceFailed = false;
    if (!stream || this.reducedMotion) return;
    whenIdle(() => {
      if (this.disposed) return;
      // made ahead, but resting (suspended) till a Ray listens: a running context keeps the page's audio going for nothing (the
      // fresh-eyes review); listen() resumes it
      const ctx = RayMount.audioContext();
      if (ctx && ![...RayMount.up].some((m) => m.voice)) ctx.suspend().catch(() => undefined);
    }, 500);
  }

  private get input(): HTMLInputElement | HTMLTextAreaElement | null {
    const el = this.inputRef?.current;
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el : null; // (only a text field has a caret)
  }

  /** A click on him: the coin flip where his idle allows it. */
  click(): void {
    if (!this.clickable) return;
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

  /** Whether a click flips a coin now: he reacts to the pointer, on his surface, with nothing else to show (an answer, offline, the mic). */
  private get clickable(): boolean {
    const o = this.options;
    return (
      o.shouldReactToPointer && o.state === 'idle' && !o.isHidden && !o.isOffline && !o.isListening
    );
  }

  /** A new director for a Ray whose `outcome` has already had its turn (his box back, reduced motion changed): it isn't played again. */
  skipOutcome(): void {
    this.outcome = null;
  }

  /** The outcome starts playing (his Success, the error's film, or a still for either). */
  private outcomeStarted(): void {
    this.outcomeSetPlaying = this.outcomeSets;
  }

  /**
   * The outcome that was playing has had its turn (played, or cut short by what wins over it): over, unless `outcome` was set again
   * meanwhile, which then plays next.
   */
  private outcomeOver(): void {
    if (this.outcomeSets !== this.outcomeSetPlaying) return;
    this.outcome = null;
    this.onOutcomeOver?.();
  }

  /** The outcome is under way (so clearing `outcome` doesn't stop it): his Success, the error's film started, or a still for it. */
  private get outcomePlaying(): boolean {
    const h = this.holder;
    return (
      (h.by === 'player' && h.act === 'outcome') ||
      (h.by === 'film' && h.state === 'error' && h.started) ||
      this.stillTimer !== null
    );
  }

  dispose(): void {
    this.disposed = true;
    RayMount.leave(this);
    this.observer?.disconnect();
    this.root.removeEventListener('click', this.onClick);
    this.listened?.removeEventListener('input', this.onInput);
    this.entrance?.dispose();
    this.unlisten();
    if (this.stillTimer) clearTimeout(this.stillTimer);
    // (parked for the next Ray a moment, rather than disposed: filmPool)
    Object.values(this.films).forEach((f) => this.letGo(f));
    this.room.remove();
    freeCanvas(this.player.canvas); // his memory now, not at the next garbage collection (the PR review)
  }

  // ---- what he should be doing ----

  /**
   * One thing at a time: hidden; offline (it wins over everything else); an answer's state; the outcome once the answer's states
   * are over; the mic; watching what's typed; his idle. A state whose film couldn't start is skipped (he's at rest instead).
   */
  private want(): Want {
    const o = this.options;
    if (o.isHidden) return { kind: 'hidden' };
    if (o.isOffline && !this.failed.has(STATE_FILMS.offline.film)) return WANT_OFFLINE;
    if (o.state !== 'idle') {
      const film = ANSWER_FILMS[o.state];
      if (!this.failed.has(film)) return { kind: 'answer', film };
      return { kind: 'idle', idle: 'rest' }; // (its film couldn't start: at rest instead)
    }
    if (this.outcome === 'success') return WANT_SUCCESS;
    if (this.outcome === 'error' && !this.failed.has(STATE_FILMS.error.film)) return WANT_ERROR;
    if (o.isListening && !this.failed.has(STATE_FILMS.mic.film)) return WANT_MIC;
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
      const stays =
        (want.kind === 'answer' && want.film === h.id) ||
        (want.kind === 'idle' && h.kind === 'idle' && IDLE_FILMS[want.idle] === h.id) ||
        (want.kind === 'state' && h.kind === 'state' && want.state === h.state);
      if (!h.started) {
        if (!stays) this.dropPending(h, want, now);
        else if (now - h.since > START_WAIT_MS) this.giveUpOn(h.id, now);
        return;
      }
      if (h.leaving === 'handoff' && now - h.since > HANDOFF_WAIT_MS)
        this.handOn(film, h.next!, null);
      if (h.leaving === 'exit' && now - h.since > EXIT_WAIT_MS) this.filmDone(film);
      if (h.state === 'error' && !h.leaving && now - h.since > ONE_SHOT_WAIT_MS) {
        this.outcomeOver();
        this.filmDone(film);
        return;
      }
      if (h.leaving === 'exit' && h.kind === 'state' && stays) {
        // asked back mid-way (offline again as he jumps back online, the mic again as it goes in): the film goes back from where he is
        this.holder = { ...h, leaving: false, since: now };
        this.cue(film, h.state);
        film.host.send({ ray: 'start' });
        return;
      }
      // the answer row's Ray hopping off after his answer: his film's exit is cut once its prop is put away, and he goes down from there
      if (h.kind === 'answer' && h.leaving === 'exit' && want.kind === 'hidden') {
        this.cutExit(film, now);
        return;
      }
      if (h.leaving) return;
      if (stays) return;
      if (h.kind === 'answer' && want.kind === 'answer') {
        // a handoff mid-move: the old film says where it left him and plays its exit over the next one
        this.holder = { ...h, leaving: 'handoff', next: want.film, since: now };
        film.host.send({ ray: 'leave', handoff: true });
        return;
      }
      this.holder = { ...h, leaving: 'exit', since: now };
      if (h.kind === 'idle') {
        // typing: quickest; the hop off, offline, the mic and an outcome: a send's quick hand-over (flow 10.5's mal9 / mic9 / end9:
        // "his idle eases to rest (a send's quick hand-over)"); another idle: at its own pace
        const quick = want.kind === 'hidden' || want.kind === 'state' || want.kind === 'success';
        const pace = want.kind === 'watch' ? TYPING_EXIT : quick ? HOP_EXIT : 1;
        film.host.send({ ray: 'pace', v: pace });
        film.host.send({ ray: 'leave' });
      } else if (h.kind === 'state') {
        if (h.state === 'error') this.outcomeOver(); // (played, or cut short by what wins over it: either way it's had its turn)
        // offline wins over the mic: it goes at once (flow 10.5), his own Ray at rest and offline starting from there
        if (h.state === 'mic' && want.kind === 'state' && want.state === 'offline')
          this.filmDone(film);
        else film.host.send({ ray: 'leave' });
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
    if (h.act === 'outcome' && want.kind !== 'success') {
      // his Success cut short by what wins over it (offline, the hop, a new answer, the error set meanwhile): it's had its turn
      this.outcomeOver();
      this.toRest(now);
      return;
    }
    const sinceMs = now - h.since;
    switch (want.kind) {
      case 'hidden':
        if (h.act !== 'hiding' && h.act !== 'gone') {
          this.holder = { by: 'player', act: 'hiding', since: now };
          this.player.hop('out', () => this.gone(), { speed: this.afterAnswer ? ROW_HOP : 1 });
        }
        return;
      case 'answer':
        if (h.act === 'hiding' || h.act === 'showing') return;
        if (h.act === 'gone') {
          // a fresh answer row: he comes up out of it, and the first film takes him from there
          this.rise(now);
          return;
        }
        if (h.act !== 'rest') {
          this.toRest(now);
          return;
        }
        if (sinceMs >= REST_BLEND_MS) this.startFilm(want.film, 'answer', null);
        return;
      case 'success':
      case 'state':
        // on his seat first (up out of the surface, back from watching, at rest), then the outcome or the state's film
        if (h.act === 'gone') {
          this.show(now);
          return;
        }
        if (h.act === 'hiding' || h.act === 'showing' || h.act === 'outcome') return;
        if (h.act === 'watch') {
          this.holder = { by: 'player', act: 'back', since: now };
          this.player.unwatch();
          return;
        }
        if (h.act === 'back' && sinceMs < WATCH_BACK_MS) return;
        if (h.act !== 'rest') {
          this.toRest(now);
          return;
        }
        if (now < this.restReadyAt) return;
        if (want.kind === 'success') {
          this.playSuccess(now);
          return;
        }
        this.startFilm(STATE_FILMS[want.state].film, 'state', null, want.state);
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
          if (sinceMs >= WATCH_BACK_MS) this.holder = { by: 'player', act: 'rest', since: now }; // his move back is over
          return;
        }
        const film = IDLE_FILMS[want.idle];
        if (h.act === 'idle') {
          // his own idle gives way at rest to another: a film's, or Look around <-> the sleep cycle
          if (film || want.idle !== this.playerIdle) this.toRest(now);
          return;
        }
        if (sinceMs < IDLE_WAIT_MS) return;
        // the nightcap is the sleep idle's: he wears it in it (asleep, dozing, through an answer's films), and any other idle
        // starts without it (Coffee at 6am, an app's new `idle`; the user, 2026-11-18)
        if (want.idle !== 'sleep') this.player.capOff();
        if (want.idle === 'rest') return; // 'rest': he stays at rest (an answer's row between its states)
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
    this.restReadyAt = now + REST_BLEND_MS;
    this.player.rest(REST_BLEND_MS);
  }

  /** Back up out of the surface and landing at rest: the way back, at its pace (HOP_BACK); with an outcome waiting, to his landing. */
  private show(now: number): void {
    this.holder = { by: 'player', act: 'showing', since: now };
    this.player.hop(
      'in',
      () => {
        this.holder = { by: 'player', act: 'rest', since: performance.now() };
      },
      { speed: HOP_BACK, window: this.outcome ? TO_LANDED : undefined },
    );
  }

  /** Hopped off: out of sight. */
  private gone(): void {
    this.holder = { by: 'player', act: 'gone', since: performance.now() };
    this.afterAnswer = false;
  }

  /**
   * An answer row's Ray comes up out of the row (canon hide's second half, flow 10.3's rowHop, at ROW_HOP) and the answer's film takes him from
   * that pose (its start settles from it). Its film loads meanwhile; he holds the pose till it's ready (START_WAIT_MS at most).
   */
  private rise(now: number): void {
    this.holder = { by: 'player', act: 'showing', since: now };
    this.preloadAnswer();
    this.player.hop(
      'in',
      () => {
        const want = this.want();
        if (want.kind === 'answer') this.startFilm(want.film, 'answer', this.player.last);
        else this.holder = { by: 'player', act: 'rest', since: performance.now() };
      },
      ROW_RISE,
    );
  }

  /** `outcome="success"`: canon Success on his seat, once, then his rest. */
  private playSuccess(now: number): void {
    this.holder = { by: 'player', act: 'outcome', since: now };
    this.outcomeStarted();
    this.player.success(() => {
      this.outcomeOver(); // (set again while it played: it plays again, from his rest)
      this.holder = { by: 'player', act: 'rest', since: performance.now() };
    });
  }

  /**
   * His answer film's exit, cut once its prop is put away (its L.back), or else once he's at rest (its exit's last key), EXIT_CUT_MS
   * after, and his hop down from the pose he's in then, at the answer row's pace (ROW_HOP): flow 10.5, where the gap between putting the laptop
   * away and the jump down had been 0.5 s. Read off the film's own handle, as flow 10.5 reads it; a film without one plays its whole
   * exit, and he hops off at rest (its 'done').
   */
  private cutExit(film: Film, now: number): void {
    const F = film.host.handle;
    if (!F?.sim) return;
    const at = F.F?.L?.back ? F.F.L.back[1] : F.sim.dur; // (its prop put away; else its exit's last key)
    if (!(at > 0) || F.t < at + EXIT_CUT_MS) return;
    const from = RC.frameAt(F.sim, F.t);
    this.filmDone(film); // (it stays up as it last drew him till his own Ray has drawn: one frame, no gap)
    this.holder = { by: 'player', act: 'hiding', since: now };
    this.player.hop('out', () => this.gone(), { speed: ROW_HOP, from });
  }

  /** What a state's film needs to know before its start (droop: malfunction or sad). */
  private cue(film: Film, state: StateName | undefined): void {
    const cue = state ? STATE_FILMS[state].cue : undefined;
    if (cue) film.host.send(cue);
  }

  /** The states' films, loading as soon as they're asked for (each only when it's first needed). */
  private loadStateFilms(): void {
    this.wantedStateFilms().forEach((id) => this.film(id));
  }

  private wantedStateFilms(): string[] {
    const o = this.options;
    const wanted: string[] = [];
    if (o.isOffline) wanted.push(STATE_FILMS.offline.film);
    if (this.outcome === 'error') wanted.push(STATE_FILMS.error.film);
    if (o.isListening) wanted.push(STATE_FILMS.mic.film);
    return wanted;
  }

  /** Success, worked out in the page's idle time as it's asked for (usually while he's still away or coming back up). */
  private prepareSuccess(): void {
    whenIdle(() => {
      if (!this.disposed) this.player.prepareSuccess();
    }, 300);
  }

  // ---- the voice (isListening, voiceStream): its level for the mic film, as the film's own mic would read it ----

  private listen(): NonNullable<RayMount['voice']> | null {
    if (this.voice || this.voiceFailed) return this.voice;
    const stream = this.voiceStream;
    const ctx = stream?.getAudioTracks().length ? RayMount.audioContext() : null;
    if (!stream || !ctx) {
      this.voiceFailed = Boolean(stream);
      return null;
    }
    try {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser); // (to the analyser only: nothing is played or recorded)
      ctx.resume().catch(() => undefined);
      this.voice = { source, analyser, buf: new Float32Array(analyser.fftSize), sent: -1 };
    } catch {
      this.voiceFailed = true;
      return null;
    }
    return this.voice;
  }

  private unlisten(): void {
    if (!this.voice) return;
    this.voice.source.disconnect();
    this.voice = null;
    // (no Ray listening: the audio rests till one is again; listen() resumes it)
    if (![...RayMount.up].some((m) => m.voice)) RayMount.audio?.suspend().catch(() => undefined);
  }

  /** The voice's level (0..1: its loudness x 4, as the film's own mic has it), sent to the mic film when it changes. */
  private feedVoice(film: Film): void {
    const v = this.listen();
    if (!v) return;
    RayMount.wakeAudio(); // (suspended, its analyser reads silence: the level would stay 0)
    v.analyser.getFloatTimeDomainData(v.buf);
    let sum = 0;
    for (let i = 0; i < v.buf.length; i++) sum += v.buf[i] * v.buf[i];
    const level = Math.round(Math.min(1, Math.sqrt(sum / v.buf.length) * 4) * 100) / 100;
    if (level === v.sent) return;
    v.sent = level;
    film.host.send({ ray: 'mic', level });
  }

  // ---- films ----

  /** A film, if it's loaded; else its load starts (once) and it's null till then: it says 'ready' when it can start. */
  private film(id: string): Film | null {
    const existing = this.films[id];
    if (existing) return existing;
    // (one another Ray let go of a moment ago: his at once, ready, with no download, no first pass and no new WebGL context)
    const pooled = takeFilm(id);
    if (pooled) return this.adoptFilm(id, pooled);
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
    if (id === STATE_FILMS.error.film && this.outcome === 'error') this.outcome = null;
    this.films[id]?.host.dispose();
    Reflect.deleteProperty(this.films, id);
    Reflect.deleteProperty(this.loading, id);
    this.holder = { by: 'player', act: 'rest', since: now };
    this.player.rest(REST_BLEND_MS);
  }

  /**
   * A film still loading that's no longer what's asked of him (he's hidden, typing's begun, the answer or his idle moved on) isn't
   * waited for: he's given back as he was before it was asked for (his own Ray at rest, or gone for a fresh answer row), so the hop
   * off or the next film starts at once (the PR review: it waited up to START_WAIT_MS). The next answer film takes him from the same
   * place. Not marked failed: it's loaded again if it's wanted again (from the cache), and it's freed if it isn't.
   */
  private dropPending(h: Extract<Holder, { by: 'film' }>, want: Want, now: number): void {
    if (h.kind === 'answer' && want.kind === 'answer') {
      const next = this.film(want.film);
      this.holder = { ...h, id: want.film, since: now };
      if (next?.ready) this.begin(next, this.pendingFrom);
    } else if (h.underneath) {
      this.holder = { by: 'player', act: 'rest', since: now };
      if (this.pendingFrom) this.player.rest(REST_BLEND_MS); // (from the pose the last film left him in)
      this.pendingFrom = null;
    } else {
      this.holder = { by: 'player', act: 'gone', since: now };
      this.pendingFrom = null;
    }
    this.releaseFilms();
  }

  private mountFilm(id: string, module: FilmModule): void {
    if (this.films[id]) return; // (a load that was given up on and asked for again: the first one in stays)
    const film: Film = this.placeFilm(
      id,
      new FilmHost({
        film: module,
        tunes: TUNES as Record<string, unknown>,
        shared: module.shared,
        onMessage: (m) => this.onFilmMessage(film, m),
      }),
    );
    film.host.start();
  }

  /**
   * A film another Ray let go of a moment ago (filmPool): his now, and ready at once (its script, its first pass and its WebGL lens
   * kept), sized for him. It starts as any of his films does: begin() tells it his light or dark, zoom, cue and nightcap.
   */
  private adoptFilm(id: string, host: FilmHost): Film {
    const film = this.placeFilm(id, host);
    host.adopt((m) => this.onFilmMessage(film, m));
    host.send({ ray: 'pace', v: 1 }); // (the last Ray's quick hand-over pace isn't carried over)
    this.onFilmMessage(film, { ray: 'ready' } as FilmMessage);
    return film;
  }

  /** A film's record, its layer hidden on his stage, cut to its crop and sized. */
  private placeFilm(id: string, host: FilmHost): Film {
    const film: Film = {
      id,
      ready: false,
      startTick: Infinity,
      shownAt: Infinity,
      going: false,
      goingSince: 0,
      front: false,
      lastCursor: '',
      still: '',
      stillTicks: 0,
      host,
    };
    host.layer.style.visibility = 'hidden';
    this.films[id] = film;
    this.stage.append(host.layer);
    host.setCrop(this.filmCrop(id)); // (before its first size: its canvases are only ever this big)
    host.resize(this.geo.width, this.geo.height, this.dpr);
    return film;
  }

  /** A film he's done with: parked for the next Ray a moment if it's ready (filmPool), else disposed. */
  private letGo(film: Film): void {
    if (film.ready) parkFilm(film.id, film.host);
    else film.host.dispose();
  }

  private startFilm(
    id: string,
    kind: 'idle' | 'answer' | 'state',
    from: unknown,
    state?: StateName,
  ): void {
    const now = performance.now();
    if (this.failed.has(id)) {
      // (a handoff to a film that couldn't start: at rest from where the last one left him)
      this.holder = { by: 'player', act: 'rest', since: now };
      this.player.rest(REST_BLEND_MS);
      return;
    }
    const film = this.film(id);
    const underneath = (this.holder.by === 'player' && this.holder.act !== 'gone') || Boolean(from);
    this.holder = {
      by: 'film',
      id,
      kind,
      state,
      leaving: false,
      since: now,
      started: false,
      underneath,
    };
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
    const { state, preload } = this.options;
    if (state === 'idle') return preload && preload !== 'idle' ? [ANSWER_FILMS[preload]] : [];
    // (with a preload, he only ever plays that state: no next film)
    const next = preload ? undefined : ANSWER_ORDER[ANSWER_ORDER.indexOf(state) + 1];
    const wanted = next ? [ANSWER_FILMS[state], ANSWER_FILMS[next]] : [ANSWER_FILMS[state]];
    return wanted.filter((id) => !this.failed.has(id));
  }

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
    this.wantedStateFilms().forEach((id) => keep.add(id));
    return keep;
  }

  /**
   * A film that isn't playing, leaving, the answer's now or next, or his idle's (he goes back to it after typing, a flip or an
   * answer) is let go: its canvases freed, loaded again if it's needed (its chunk is cached). An idle he's moved on from goes
   * too (time-of-day's clock, a new `idle`; the PR review).
   */
  private releaseFilms(): void {
    const keep = this.wantedFilms();
    Object.values(this.films).forEach((film) => {
      if (keep.has(film.id) || film.going) return;
      this.letGo(film);
      Reflect.deleteProperty(this.films, film.id);
      Reflect.deleteProperty(this.loading, film.id);
    });
  }

  /** options.lookY (his box px) in his world's units */
  private lookYWorld(): number {
    return ((this.options.lookY ?? 0) * RC.BASE[2][0]) / WIDTHS[this.options.size];
  }

  /**
   * His looks moved by options.lookY: every pose of the film's script (looks are his Figma px), once (its start simulates
   * the script again), as flow 9's inv8.js moves his eyes and the glass in its film; his own Ray's eyes move with them
   * (RayPlayer's eyeY), so a film takes him from rest with his eyes where they were.
   */
  private shiftLooks(film: Film): void {
    type Pose = { look?: [number, number] };
    type Script = { keys?: { pose?: Pose }[]; lookY?: number };
    const script = (film.host.env.window as { FILM?: { SCRIPT?: Script } }).FILM?.SCRIPT;
    if (!script?.keys) return;
    const want = this.lookYWorld() / RC.FIG;
    const d = want - (script.lookY ?? 0);
    if (!d) return;
    const seen = new Set<Pose>();
    for (const key of script.keys) {
      key.pose ??= {};
      const { pose } = key;
      if (seen.has(pose)) continue;
      seen.add(pose);
      const look = pose.look ?? [0, 0];
      pose.look = [look[0], look[1] + d];
    }
    script.lookY = want;
  }

  /** A film told his light / dark and his size. */
  private dress(film: Film): void {
    film.host.send({ ray: 'mode', mode: this.options.colorScheme });
    film.host.send({ ray: 'zoom', z: this.geo.zoom });
  }

  private begin(film: Film, from: unknown): void {
    const h = this.holder;
    if (h.by !== 'film' || h.id !== film.id) return;
    film.going = false;
    // (a film started again before the frame that settles it, as droop is when he goes offline as its error ends, or plays the error
    // as he's back online: it isn't put to sleep under him, which left him unseen; the fresh-eyes review)
    this.settling = this.settling.filter((f) => f !== film);
    if (h.kind === 'state' && h.state === 'error') this.outcomeStarted();
    this.dress(film);
    if (h.kind === 'idle') film.host.send({ ray: 'pace', v: 1 });
    this.shiftLooks(film);
    if (h.kind === 'answer') this.afterAnswer = true;
    this.cue(film, h.state);
    film.host.send(this.player.capAsk); // his nightcap, while his idle is the sleep cycle: the films wear it too (as flow 9's do)
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
        this.dress(film);
        if (this.reducedMotion) this.start();
        // (its still, next frame)
        else if (mine && h.by === 'film' && !h.started) this.begin(film, this.pendingFrom);
        else if (!mine) film.host.send({ ray: 'rehearse' }); // loaded ahead: one frame unseen, then asleep (FilmHost)
        break;
      }
      case 'left':
        if (mine && h.by === 'film' && h.leaving === 'handoff') this.handOn(film, h.next!, m.f);
        break;
      case 'front':
        film.front = Boolean(m.v);
        break;
      case 'done':
        // (a one-shot state's film, error, says it's done of its own accord, back at rest)
        if (
          mine &&
          h.by === 'film' &&
          (h.leaving === 'exit' || (h.kind === 'state' && !h.leaving))
        ) {
          if (h.state === 'error') this.outcomeOver();
          this.filmDone(film);
        } else if (film.going) this.goneUnder(film);
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
    if (this.pixelRatio() !== this.dpr) this.layout();

    if (this.reducedMotion) {
      this.stillFrame(now);
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

  /**
   * Reduced motion: one still frame, none while he's hidden (no hop: he's simply there or not; update() draws it again). At rest; a
   * state's own still (offline, error, the mic: its film draws it, loaded for it); Success's. The outcome's still stays about as long
   * as it would play, then it's had its turn.
   */
  private stillFrame(now: number): void {
    const shown = !this.options.isHidden;
    const want = shown ? this.want() : null;
    const isOutcome =
      want?.kind === 'success' || (want?.kind === 'state' && want.state === 'error');
    if (isOutcome && this.outcome && !this.stillTimer) {
      const ms = want?.kind === 'success' ? this.player.successMs : ERROR_STILL_MS;
      this.outcomeStarted();
      this.stillTimer = setTimeout(() => {
        this.stillTimer = null;
        this.outcomeOver();
        this.start();
      }, ms);
    }
    const state = want?.kind === 'state' ? want.state : null;
    const film = state ? this.film(STATE_FILMS[state].film) : null;
    let filmDrawn = false;
    if (film?.ready && state) {
      const key = `${state}|${this.options.colorScheme}|${this.geo.zoom}`;
      if (film.still !== key) {
        film.still = key;
        film.stillTicks = 0;
        this.dress(film);
        this.cue(film, state);
        film.host.send({ ray: 'still' });
      }
      film.host.tick(now);
      film.stillTicks += 1;
      if (film.stillTicks < STILL_TICKS) this.start();
      filmDrawn = film.stillTicks >= STILL_SHOWN_TICK;
    }
    Object.values(this.films).forEach((f) => {
      f.host.layer.style.visibility = f === film && filmDrawn ? '' : 'hidden';
    });
    const playerShown = shown && !filmDrawn;
    this.player.canvas.style.visibility = playerShown ? '' : 'hidden';
    if (!shown) {
      this.player.clear();
      this.onAway?.();
      return;
    }
    if (!playerShown) return;
    if (want?.kind === 'success') this.player.successStill();
    else this.player.rest(0);
    this.player.tick(now, 0, { pointer: null, gaze: null, hover: false });
  }

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
    const cursor = this.clickable ? 'pointer' : '';
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
        hover: this.options.shouldReactToPointer && idleish,
        // (asleep, a pointer near him wakes him: where it really is, not brought in)
        near:
          raw && this.options.shouldReactToPointer
            ? this.player.toWorld(raw[0], raw[1], this.dpr)
            : null,
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
      if (film === current && h.by === 'film' && h.state === 'mic' && h.started && !h.leaving)
        this.feedVoice(film);
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
    const near = this.options.shouldReactToPointer && local;
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

  /** his canvases' pixels per CSS px: the device's (at most 2), finer by how much bigger he's shown */
  private pixelRatio(): number {
    return Math.min(2, window.devicePixelRatio || 1) * Math.max(1, this.options.scale ?? 1);
  }

  private layout(): void {
    const w = WIDTHS[this.options.size];
    this.dpr = this.pixelRatio();
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
      f.host.setCrop(this.filmCrop(f.id));
      f.host.resize(g.width, g.height, this.dpr);
      f.host.send({ ray: 'zoom', z: g.zoom });
    });
  }

  /** The part of the stage a film draws on (the stage's CSS px): FILM_CROP past his box, the room's edges right and below. */
  private filmCrop(
    id: string,
  ): { left: number; top: number; right: number; bottom: number } | null {
    const crop = FILM_CROP[id];
    if (!crop) return null;
    const g = this.geo;
    const w = WIDTHS[this.options.size];
    const top = g.floor - g.boxHeight; // his box's top on the stage
    return {
      left: Math.max(0, g.left - w * crop[0]),
      top: Math.max(0, top - w * crop[1]),
      right: Math.min(g.width, g.left + w * (1 + ROOM_RIGHT)),
      bottom: Math.min(g.height, g.floor + w * ROOM_BELOW),
    };
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
  private static audio: AudioContext | null = null; // one for every Ray on the page, while one has a voice; closed as the last one goes

  private static audioContext(): AudioContext | null {
    if (RayMount.audio) return RayMount.audio;
    const Context: typeof AudioContext | undefined =
      typeof window === 'undefined'
        ? undefined
        : window.AudioContext ?? (window as any).webkitAudioContext;
    if (!Context) return null;
    try {
      RayMount.audio = new Context();
    } catch {
      return null;
    }
    // a browser that starts audio only after a user gesture (its autoplay policy) makes it suspended: it's resumed on the next one
    document.addEventListener('pointerdown', RayMount.wakeAudio, { capture: true, passive: true });
    document.addEventListener('keydown', RayMount.wakeAudio, { capture: true, passive: true });
    return RayMount.audio;
  }

  private static audioWokenAt = 0;

  /** The shared audio running again while a Ray listens (it rests, suspended, while none does): tried at most once a second. */
  private static readonly wakeAudio = (): void => {
    const ctx = RayMount.audio;
    if (!ctx || ctx.state !== 'suspended' || ![...RayMount.up].some((m) => m.voice)) return;
    const now = performance.now();
    if (now - RayMount.audioWokenAt < 1000) return;
    RayMount.audioWokenAt = now;
    ctx.resume().catch(() => undefined);
  };

  // the pace they draw at (rayPace): every `pace`-th animation frame, from how long a drawn frame's work takes
  private static frames = 0;
  private static pace = 1;
  private static interval = 1000 / 60; // ms between animation frames, smoothed
  private static cost = 0; // ms a drawn frame's work takes (every Ray's), smoothed
  private static lastAt = 0;
  private static pacedAt = 0;

  private static readonly onFrame = (now: number): void => {
    RayMount.raf = 0;
    const gap = now - RayMount.lastAt;
    RayMount.lastAt = now;
    if (gap > 0 && gap < 100) RayMount.interval += (gap - RayMount.interval) * 0.05;
    RayMount.frames += 1;
    if (RayMount.frames % RayMount.pace !== 0) {
      // a frame they sit out: still booked, for the next
      if (RayMount.booked.size) RayMount.raf = requestAnimationFrame(RayMount.onFrame);
      return;
    }
    const due = [...RayMount.booked];
    RayMount.booked.clear();
    const started = performance.now();
    due.forEach((m) => RayMount.guard(() => m.readLayout(now)));
    due.forEach((m) => RayMount.guard(() => m.frame(now)));
    RayMount.cost += (performance.now() - started - RayMount.cost) * 0.1;
    if (now - RayMount.pacedAt >= PACE_EVERY_MS) {
      RayMount.pacedAt = now;
      RayMount.pace = paceFor(RayMount.cost, RayMount.interval, RayMount.pace);
    }
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

  /**
   * The film for `state` fetched ahead (its code only: nothing is made, no canvases, no GPU), so a Ray that appears later, a
   * button's as the pointer nears it, gets going at once instead of downloading first (the device test, GTX 1650: on a page's
   * first Investigate button the film was still loading as the hover began, and its first pass, 71 ms, landed in it). See loadRay.
   */
  static prefetch(state?: RayState): Promise<void> {
    const id = state && state !== 'idle' ? ANSWER_FILMS[state] : undefined;
    return id
      ? (FILMS as Record<string, () => Promise<unknown>>)[id]().then(() => undefined)
      : Promise.resolve();
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
    RayMount.audio?.close().catch(() => undefined);
    RayMount.audio = null;
    document.removeEventListener('pointerdown', RayMount.wakeAudio, { capture: true });
    document.removeEventListener('keydown', RayMount.wakeAudio, { capture: true });
  }
}

/** His box on the page (his rest footprint, CSS px): the layout never changes with what he does. */
const rayBoxSize = (size: keyof typeof WIDTHS): { width: number; height: number } => {
  const w = WIDTHS[size];
  return { width: w, height: Number(geometry(w).boxHeight.toFixed(2)) };
};

export { RayMount, rayBoxSize };
export type { RayMountOptions };
