import { baseInputHeight } from '~components/Input/BaseInput/baseInputTokens';

/**
 * Vertical geometry of the slider, verified against Figma node 126408:564.
 *
 * The field box matches a small BaseInput exactly, so a SliderInput and a
 * `<TextInput size="small" />` share a field centre line. Against `medium` it is 2px off.
 */
const SLIDER_BOX_HEIGHT = baseInputHeight.small; // 32
const SLIDER_BOX_PADDING_TOP = 4;
const SLIDER_CONTROL_HEIGHT = 24;

const SLIDER_TRACK_HEIGHT = 3;

/**
 * The track is pinned to whole pixels rather than centred in the control: a 3px track in a
 * 24px control cannot be both. This puts the track centre 0.5px below the thumb centre,
 * which is invisible and is the trade the design makes to keep the rail crisp at 1x.
 */
const SLIDER_TRACK_TOP = SLIDER_BOX_PADDING_TOP + 11; // 15 in the box, 11 in the control

const SLIDER_THUMB_SIZE = 12;

/** The thumb is centred in the control, unlike the track. */
const SLIDER_THUMB_TOP = (SLIDER_CONTROL_HEIGHT - SLIDER_THUMB_SIZE) / 2; // 6

/** Clear space between the top of the thumb and the bottom of the value indicator. */
const SLIDER_INDICATOR_GAP = 4;

/**
 * Distance from the bottom of the control to the bottom of the indicator.
 *
 * The indicator sits fully above the thumb and therefore overflows the field box upwards.
 * That is intended, and is why nothing in the slider sets `overflow: hidden`.
 */
const SLIDER_INDICATOR_BOTTOM = SLIDER_CONTROL_HEIGHT - SLIDER_THUMB_TOP + SLIDER_INDICATOR_GAP; // 22

/**
 * The scale starts inside the box and ends 4px past it. The box must not clip.
 */
const SLIDER_SCALE_TOP = 24;
const SLIDER_SCALE_HEIGHT = 12;

/**
 * Marker geometry is derived from the track height, never hardcoded. The dot equals the
 * track height and the transparent ring around it is twice the track height, so both
 * follow if the track is ever retuned again.
 */
const SLIDER_MARKER_DOT = SLIDER_TRACK_HEIGHT; // 3
const SLIDER_MARKER_RADIUS = SLIDER_MARKER_DOT / 2; // 1.5
const SLIDER_MARKER_RING = SLIDER_TRACK_HEIGHT * 2; // 6

/**
 * Below this centre-to-centre distance the transparent rings merge into each other and the
 * rail stops reading as a rail, so markers are dropped entirely rather than drawn colliding.
 * Leaves 4px of rail between adjacent rings.
 */
const SLIDER_MIN_MARKER_PITCH = SLIDER_MARKER_RING + 4; // 10

/** Minimum clear space between two adjacent scale labels before the scale is dropped. */
const SLIDER_SCALE_LABEL_GAP = 4;

/**
 * Approximate advance width of a digit in the 10px scale font. Used to predict label width
 * without measuring, so suppression and min-width behave identically during SSR.
 */
const SLIDER_SCALE_CHAR_WIDTH = 5.6;

/** WCAG target size for the thumb, applied via a pseudo-element so the visual thumb stays 12px. */
const SLIDER_THUMB_HIT_AREA = 44;

/**
 * How far the pointer must travel before a press counts as a drag rather than a click.
 *
 * A click should glide to where it landed, a drag should track the finger exactly, and the
 * two are only distinguishable after the fact. Without this slop a mouse that jitters a pixel
 * between press and release would cancel the glide and make the click look broken.
 */
const SLIDER_DRAG_SLOP = 3;

const sliderInputColors = {
  rail: 'interactive.background.neutral.faded',
  fill: {
    default: 'interactive.background.neutral.default',
    /** Shared by hover, focus and drag. */
    highlighted: 'interactive.background.neutral.highlighted',
    /**
     * Opaque on purpose. The thumb straddles the fill/rail boundary, so an alpha token
     * would let that seam read straight through the middle of the thumb.
     */
    disabled: 'interactive.background.neutral.disabledSolid',
  },
  scaleLabel: {
    default: 'surface.text.gray.muted',
    disabled: 'surface.text.gray.disabled',
  },
  indicator: {
    background: 'popup.background.gray.intense',
    text: 'interactive.text.staticWhite.normal',
  },
} as const;

/**
 * The thumb, the fill and the indicator all move together, so they share one set of motion
 * tokens rather than each picking its own and drifting out of step.
 *
 * `position` is deliberately the shortest duration Blade offers: a held arrow key steps
 * repeatedly, and anything slower would still be easing the previous step when the next one
 * lands. `standard` is the system's morph easing, which is what a value change is.
 *
 * Nothing here applies while dragging. Under a pointer the thumb has to sit exactly where the
 * finger is, and easing that would read as lag rather than polish.
 */
const sliderInputMotion = {
  /** Value-driven movement of the thumb, the fill and the indicator riding above it. */
  position: { duration: '2xquick', easing: 'standard' },
  /** Fill and thumb shifting between the default, highlighted and disabled colours. */
  color: { duration: 'xquick', easing: 'standard' },
  /** The indicator fading in and out with the highlight, and its small rise on entry. */
  indicator: { duration: 'xquick', enterEasing: 'entrance', exitEasing: 'exit' },
  /**
   * The number rolling over inside the indicator.
   *
   * Deliberately slower than the indicator's own fade, and the one thing here that is not
   * tuned for keeping up. A roll exists to be read, so it needs longer than the movement it
   * accompanies; at the indicator's own duration the change goes by unnoticed.
   */
  valueRoll: { duration: 'moderate' },
} as const;

/** How far the indicator rises as it fades in, in px. */
const SLIDER_INDICATOR_RISE = 2;

export {
  SLIDER_BOX_HEIGHT,
  SLIDER_BOX_PADDING_TOP,
  SLIDER_CONTROL_HEIGHT,
  SLIDER_TRACK_HEIGHT,
  SLIDER_TRACK_TOP,
  SLIDER_THUMB_SIZE,
  SLIDER_THUMB_TOP,
  SLIDER_INDICATOR_GAP,
  SLIDER_INDICATOR_BOTTOM,
  SLIDER_SCALE_TOP,
  SLIDER_SCALE_HEIGHT,
  SLIDER_MARKER_DOT,
  SLIDER_MARKER_RADIUS,
  SLIDER_MARKER_RING,
  SLIDER_MIN_MARKER_PITCH,
  SLIDER_SCALE_LABEL_GAP,
  SLIDER_SCALE_CHAR_WIDTH,
  SLIDER_THUMB_HIT_AREA,
  SLIDER_DRAG_SLOP,
  SLIDER_INDICATOR_RISE,
  sliderInputColors,
  sliderInputMotion,
};
