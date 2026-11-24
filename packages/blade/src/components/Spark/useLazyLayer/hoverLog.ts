/**
 * The Spark button hovers' own note of what happened to each on the page (the last 60): why one didn't start (its layer's code
 * failed to load, no hover here, reduced motion, no usable GPU, its engine failed to load, a stage error) or that it did. Nothing
 * else stops a hover silently: each of those leaves the button its own hover and says nothing, so this is how a test page (the
 * device test bundles Blade's source) or a browser's console finds out why. Internal; engine-free (useLazyLayer reads it).
 */
type HoverNote = {
  /** ms since the page started */
  at: number;
  /** which hover: 'razorsense' or 'ray' */
  hover: string;
  what: string;
};

const hoverNotes: HoverNote[] = [];

const noteHover = (hover: string, what: string): void => {
  hoverNotes.push({ at: Math.round(performance.now()), hover, what });
  if (hoverNotes.length > 60) hoverNotes.shift();
};

/** how long a hover's code may take to arrive before it's noted as still loading (it's never given up on: it plays once in) */
const SLOW_LOAD_MS = 8000;

/** an error's message, short */
const errorText = (error: unknown): string =>
  String((error as Error)?.message ?? error).slice(0, 160);

export { hoverNotes, noteHover, errorText, SLOW_LOAD_MS };
export type { HoverNote };
