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
 * the page's own work. Off screen, nothing starts (it would only be paused there).
 */
const MAX_WAIT_MS = 46000;
/** how close to the screen a box has to be to start (its first frame ready as it scrolls in) */
const NEAR = '200px';
/** how long a start may wait for the page to go idle (ms) */
const IDLE_WAIT_MS = 500;

/** `run` once the page is idle (at most IDLE_WAIT_MS on), or a moment later where the browser has no idle callback */
const whenIdle = (run: () => void): void => {
  if (typeof window.requestIdleCallback === 'function')
    window.requestIdleCallback(run, { timeout: IDLE_WAIT_MS });
  else window.setTimeout(run, 16);
};

type Turn = {
  box: Element;
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
  whenIdle(() => {
    // (taken out of the queue meanwhile: its component went)
    if (starting !== next) return;
    startedAt = performance.now();
    hasDrawn = next.go();
    frame = requestAnimationFrame(check);
  });
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
 * Starts `go` for this box once it's on screen and it's its turn. Returns a function that takes it out of the queue (its component
 * going before it started, or its effect running again); called after it started, it lets the next one go if this one hadn't
 * drawn yet.
 */
const waitForTurn = (box: Element, go: Turn['go']): (() => void) => {
  const turn: Turn = { box, go, isOnScreen: typeof IntersectionObserver === 'undefined' };
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
