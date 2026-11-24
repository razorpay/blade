/**
 * Where the chat's RazorSense goes for the elements it wraps, and how far it reaches round them (CSS px at scale 1). Measured on
 * flow 9's chat, light and dark: thinking over many loops, the bottom wave through its typing surge.
 */

type Rect = { left: number; top: number; width: number; height: number };

/** flow 9's chat bar: 60 px tall, its bottom 51 px above the window's bottom (the comp's), where the bottom wave fades out */
const BAR_HEIGHT = 60;
/** flow 9's thinking slot (where its Ray sits; thinking plays from it) from its label's top-left: 36 px before it, 8 px down */
const SLOT_FROM_LABEL = { x: -36, y: 8 };

/** How far thinking reaches from its slot, with room to fade: the canvas a RazorSenseThinking draws on by itself. */
const THINKING_REACH = { left: 160, right: 750, up: 120, down: 340 };

/**
 * How far the bottom wave reaches from the chat input's middle across and its bottom (it carries on below the input, as it
 * carried on below flow 9's window): the canvas a RazorSenseBottomWave draws on by itself.
 */
const BOTTOM_WAVE_REACH = { side: 700, up: 150, down: 250 };
/** how far above the input a lone bottom wave's canvas reaches while an outcome plays: as far as its splash goes (CSS px at scale 1) */
const OUTCOME_REACH_UP = 620;
/**
 * the lone bottom wave's canvas pixels at most (the PR review: reaching the window's sides and top for its splash, at up to 1.6 device
 * px per CSS px, it was ~6 Mpx on a 1080p screen at 2x, against 1.4 at rest): as the big piece's budget. At rest it's under it
 */
const WAVE_PIXELS = 2.2e6;
/**
 * how far above its chat input's bottom RazorSenseChat's strip draws at rest, its typing surge at its strongest included (CSS px at
 * scale 1): dark's surge reached 169 px at 2 / 255, the faintest change (1 / 255) ~260. Its canvas at rest starts there
 */
const REST_REACH_UP = 300;
/**
 * RazorSenseChat's stage starting `top` px down its chat (0: the whole chat). Its box is laid with `inset: 0`, so going back to the
 * whole chat sets top to 0px, never clears it: cleared, the shorthand's top went with it and the stage was 0 px tall (the voice look
 * and a new question after a crop drew on nothing)
 */
const placeStage = (box: HTMLElement, top: number): void => {
  box.style.top = `${top}px`;
};
/** the steps RazorSenseChat's stage moves in at rest (CSS px): a whole number of device px at 0.5, 0.75, 1, 1.25, 1.5, 1.6 and 2 */
const REST_STEP = 20;

/** thinking's slot for a thinking label at `r` */
const thinkingSlot = (r: Rect): [number, number] => [
  r.left + SLOT_FROM_LABEL.x,
  r.top + SLOT_FROM_LABEL.y,
];

/** what the driver takes as the chat input for one at `r`: flow 9's bar on the input's bottom (its middle across, its top) */
const inputAnchor = (r: Rect, scale: number): [number, number] => [
  r.left + r.width / 2,
  r.top + r.height - BAR_HEIGHT * scale,
];

/** the top-left of a lone RazorSenseThinking's canvas (and its still) for thinking's slot */
const thinkingFrame = (slot: [number, number], scale: number): [number, number] => [
  slot[0] - THINKING_REACH.left * scale,
  slot[1] - THINKING_REACH.up * scale,
];

/** the top-left of a lone RazorSenseBottomWave's canvas (and its still) for the chat input anchor the driver takes */
const bottomWaveFrame = (input: [number, number], scale: number): [number, number] => [
  input[0] - BOTTOM_WAVE_REACH.side * scale,
  input[1] + (BAR_HEIGHT - BOTTOM_WAVE_REACH.up) * scale,
];

/** `el` in `stage`'s own CSS px (null when it isn't laid out: gone, or display none) */
const rectIn = (el: HTMLElement | null, stage: HTMLElement): Rect | null => {
  if (!el?.isConnected) return null;
  const r = el.getBoundingClientRect();
  if (!r.width && !r.height) return null;
  const b = stage.getBoundingClientRect();
  const k = b.width / Math.max(1, stage.clientWidth) || 1; // (a scaled container: screen px -> the stage's own)
  return {
    left: (r.left - b.left) / k,
    top: (r.top - b.top) / k,
    width: r.width / k,
    height: r.height / k,
  };
};

export {
  BOTTOM_WAVE_REACH,
  SLOT_FROM_LABEL,
  THINKING_REACH,
  bottomWaveFrame,
  inputAnchor,
  rectIn,
  thinkingFrame,
  thinkingSlot,
  OUTCOME_REACH_UP,
  WAVE_PIXELS,
  REST_STEP,
  placeStage,
  REST_REACH_UP,
};
export type { Rect };
