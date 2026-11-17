/**
 * RazorSense 2.0's engines start one at a time, and only once their box is on screen (or nearly). Each start makes a GPU context
 * and compiles its shaders, and where the browser can't compile them in the background (Firefox, Chrome on many Android phones,
 * some Windows GPUs) that holds the page up. Started together (a page with several of them, a docs page with every story) they
 * stacked: 3.6 s of freezes on a mid-range Android phone's first load. One at a time, the next starts once the one before has
 * drawn its first frame, given up or stopped running (or MAX_WAIT_MS has passed): a GPU still compiling the one before isn't
 * given another to compile on the page's own thread, and the browser's shader cache makes each later one quicker. Where the one
 * before only waits on its GPU (Direct3D: its main pass's copy compiling in the background, with its own work for its first frame
 * done) the next starts then: compiles in the background overlap without holding the page up (a GTX 1650 laptop compiled 9
 * together in 0.74 s, the page at 138 fps), while two engines' first frames of work don't land in the same frames (started
 * together, they made 50-130 ms tasks there). Each starts
 * once the page is idle (the browser's idle callback, or a moment later where there's none), so it doesn't land in the middle of
 * the page's own work. Its engine is made first, a step at a time (`prepare`), each step in an idle moment of its own: made in
 * one go it was one task of 190-330 ms on a mid-range Android phone (about 1 s on the first visit after the engine changed);
 * where steps are quick (a laptop) several run in the same idle moment. Off screen, nothing starts (it would only be paused there).
 */
const MAX_WAIT_MS = 46000;
/** how close to the screen a box has to be to start (its first frame ready as it scrolls in) */
const NEAR = '200px';
/** how long a start may wait for the page to go idle (ms) */
const IDLE_WAIT_MS = 500;
/** how long each next step of making an engine may wait for the page to go idle (ms) */
const STEP_WAIT_MS = 120;
/** the idle time a moment must still have left for another step in it (ms): a step on a slow phone takes about 30-80 */
const STEP_ROOM_MS = 12;

/**
 * `run` once the page is idle (at most `wait` ms on), or a moment later where the browser has no idle callback (then no
 * deadline: one step a moment)
 */
const whenIdle = (run: (deadline?: IdleDeadline) => void, wait = IDLE_WAIT_MS): void => {
  if (typeof window.requestIdleCallback === 'function')
    window.requestIdleCallback(run, { timeout: wait });
  else window.setTimeout(run, 16);
};

const hasRoom = (deadline?: IdleDeadline): boolean =>
  Boolean(deadline && !deadline.didTimeout && deadline.timeRemaining() > STEP_ROOM_MS);

type Turn = {
  box: Element;
  /** one step of making its engine ahead: true once there's nothing more to make (then `go`) */
  prepare?: () => boolean;
  /** starts it: a check of whether it has drawn yet, or null when it didn't start */
  go: () => (() => boolean) | null;
  isOnScreen: boolean;
};

const waiting: Turn[] = [];
const byBox = new Map<Element, Turn>();
let starting: Turn | null = null;
let startedAt = 0;
let frame = 0;
let hasDrawn: (() => boolean) | null = null;
let observer: IntersectionObserver | null = null;

const pump = (): void => {
  if (starting) return;
  const next = waiting.find((turn) => turn.isOnScreen);
  if (!next) return;
  waiting.splice(waiting.indexOf(next), 1);
  observer?.unobserve(next.box);
  byBox.delete(next.box);
  starting = next;
  const start = (): void => {
    // (taken out of the queue meanwhile: its component went)
    if (starting !== next) return;
    startedAt = performance.now();
    hasDrawn = next.go();
    frame = requestAnimationFrame(check);
  };
  // another step in the same idle moment only when the last was quick (a laptop), with room for three more like it: on a slow
  // phone each step is a moment of its own
  const hasRoomAfter = (deadline: IdleDeadline | undefined, took: number): boolean =>
    hasRoom(deadline) && Boolean(deadline) && deadline!.timeRemaining() > 3 * took;
  const step = (deadline?: IdleDeadline): void => {
    if (starting !== next) return;
    let isMade = false;
    let took = 0;
    for (;;) {
      const t = performance.now();
      isMade = !next.prepare || next.prepare();
      took = performance.now() - t;
      if (isMade || !hasRoomAfter(deadline, took)) break;
    }
    if (!isMade) whenIdle(step, STEP_WAIT_MS);
    // (made: started in this idle moment if it has room left, else the next)
    else if (hasRoomAfter(deadline, took)) start();
    else whenIdle(start, STEP_WAIT_MS);
  };
  whenIdle(step);
};

// the one starting has drawn (or taken long enough, or gone): the next may start
function check(): void {
  frame = 0;
  if (!starting) return;
  if (!hasDrawn || hasDrawn() || performance.now() - startedAt > MAX_WAIT_MS) {
    starting = null;
    hasDrawn = null;
    pump();
    return;
  }
  frame = requestAnimationFrame(check);
}

const onIntersect = (entries: IntersectionObserverEntry[]): void => {
  entries.forEach((entry) => {
    const turn = byBox.get(entry.target);
    if (turn) turn.isOnScreen = entry.isIntersecting;
  });
  pump();
};

/**
 * Starts `go` for this box once it's on screen and it's its turn, after `prepare` (if given) has made its engine a step at a time.
 * Returns a function that takes it out of the queue (its component going before it started, or its effect running again);
 * called after it started, it lets the next one go if this one hadn't drawn yet.
 */
const waitForTurn = (box: Element, go: Turn['go'], prepare?: Turn['prepare']): (() => void) => {
  const turn: Turn = { box, go, prepare, isOnScreen: typeof IntersectionObserver === 'undefined' };
  waiting.push(turn);
  if (!turn.isOnScreen) {
    observer ??= new IntersectionObserver(onIntersect, { rootMargin: NEAR });
    byBox.set(box, turn);
    observer.observe(box);
  }
  pump();
  return () => {
    const i = waiting.indexOf(turn);
    if (i >= 0) waiting.splice(i, 1);
    if (byBox.get(box) === turn) {
      byBox.delete(box);
      observer?.unobserve(box);
    }
    if (starting === turn) {
      cancelAnimationFrame(frame);
      frame = 0;
      starting = null;
      hasDrawn = null;
      pump();
    }
  };
};

export { waitForTurn };
