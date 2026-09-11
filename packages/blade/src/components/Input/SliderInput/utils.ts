import {
  SLIDER_MARKER_DOT,
  SLIDER_MARKER_RADIUS,
  SLIDER_MARKER_RING,
  SLIDER_MIN_MARKER_PITCH,
  SLIDER_SCALE_CHAR_WIDTH,
  SLIDER_SCALE_LABEL_GAP,
} from './sliderInputTokens';

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Number of decimals in `step`, used to undo floating point drift after arithmetic.
 * `0.1 + 0.2` must render as `0.3`, not `0.30000000000000004`.
 */
const getStepPrecision = (step: number): number => {
  const asString = String(step);
  if (asString.includes('e-')) return 20;
  const decimalIndex = asString.indexOf('.');
  return decimalIndex === -1 ? 0 : asString.length - decimalIndex - 1;
};

const roundToStep = (value: number, step: number): number =>
  Number(value.toFixed(Math.min(getStepPrecision(step), 20)));

type ValueRange = {
  min: number;
  max: number;
  step: number;
};

/**
 * Rounds a value to the nearest step and clamps it into range.
 *
 * `max` is always reachable even when the range is not a whole number of steps: a slider
 * from 0 to 100 with `step={30}` has stops at 0, 30, 60, 90 and 100.
 */
const snapValue = (value: number, { min, max, step }: ValueRange): number => {
  if (!Number.isFinite(value)) return min;
  if (step <= 0) return clamp(value, min, max);

  const snapped = min + Math.round((value - min) / step) * step;
  if (snapped >= max) return max;

  // The final step can land closer to `max` than to its own stop, in which case `max` wins.
  const lastWholeStep = min + Math.floor((max - min) / step) * step;
  if (snapped >= lastWholeStep && max - value < value - lastWholeStep) return max;

  return clamp(roundToStep(snapped, step), min, max);
};

/**
 * Every value that gets a marker: one per step, plus `max` when it is not already a stop.
 */
const getMarkerValues = ({ min, max, step }: ValueRange): number[] => {
  if (step <= 0 || max <= min) return [min, max];

  const wholeSteps = Math.floor((max - min) / step);
  const values: number[] = [];
  for (let index = 0; index <= wholeSteps; index++) {
    values.push(roundToStep(min + index * step, step));
  }
  if (values[values.length - 1] !== max) values.push(max);
  return values;
};

/** Position of a value along the track, as a 0-1 fraction. */
const getValueRatio = (value: number, { min, max }: Pick<ValueRange, 'min' | 'max'>): number => {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
};

/**
 * Offset of a ratio from the track's inline start, as a CSS length.
 *
 * The usable span is inset by the marker radius at both ends so that the end dots sit fully
 * on the rail. Expressing it as a `calc` keeps positioning resolution-independent: nothing
 * here needs the measured track width, so it renders identically during SSR.
 */
const getOffsetExpression = (ratio: number): string =>
  `calc(${SLIDER_MARKER_RADIUS}px + ${ratio} * (100% - ${SLIDER_MARKER_DOT}px))`;

/**
 * Width of the filled span.
 *
 * The fill runs to the far edge of the marker it reaches, not its centre, or the reached dot
 * renders half filled. At `max` this resolves to exactly 100%.
 */
const getFillWidthExpression = (ratio: number): string =>
  `calc(${SLIDER_MARKER_DOT}px + ${ratio} * (100% - ${SLIDER_MARKER_DOT}px))`;

/**
 * One radial gradient per marker, each opaque everywhere except a transparent ring around
 * its dot. Intersecting them punches every ring into a single mask.
 *
 * The dot itself stays in the mask, so it takes the colour of whatever layer it sits on:
 * fill colour once reached, rail colour before. That is what keeps markers from hardcoding
 * an assumption about the surface behind them.
 */
const getMarkerMaskImage = (ratios: number[]): string =>
  ratios
    .map((ratio) => {
      const position = getOffsetExpression(ratio);
      return `radial-gradient(circle ${
        SLIDER_MARKER_RING / 2
      }px at ${position} 50%, #000 0 ${SLIDER_MARKER_RADIUS}px, transparent ${SLIDER_MARKER_RADIUS}px ${
        SLIDER_MARKER_RING / 2
      }px, #000 ${SLIDER_MARKER_RING / 2}px)`;
    })
    .join(', ');

/**
 * Centres an element on the offset given by `inset-inline-start`.
 *
 * Under RTL that property resolves to `right`, so the shift has to flip with it or every
 * centred element lands half its width off the point it is anchored to.
 */
const getCenteringTransform = (isRTL: boolean): string =>
  isRTL ? 'translateX(50%)' : 'translateX(-50%)';

/** Predicted width of the widest label, without measuring, so SSR and client agree. */
const getWidestLabelWidth = (values: number[], formatValue?: (value: number) => string): number => {
  const longest = values.reduce((widest, value) => {
    const length = (formatValue ? formatValue(value) : String(value)).length;
    return Math.max(widest, length);
  }, 0);
  return longest * SLIDER_SCALE_CHAR_WIDTH;
};

/** Centre-to-centre distance between adjacent markers at a given track width. */
const getPitch = (trackWidth: number, markerCount: number): number => {
  if (markerCount <= 1) return trackWidth;
  return (trackWidth - SLIDER_MARKER_DOT) / (markerCount - 1);
};

/**
 * Markers and labels crowd at different widths, so they are suppressed independently.
 *
 * `trackWidth` of 0 means unmeasured, which is the SSR and first-paint case. Both render
 * then, and a too-narrow track corrects itself on the first resize observation.
 */
const getVisibility = ({
  trackWidth,
  markerCount,
  widestLabelWidth,
}: {
  trackWidth: number;
  markerCount: number;
  widestLabelWidth: number;
}): { canShowMarkers: boolean; canShowScale: boolean } => {
  if (trackWidth <= 0) return { canShowMarkers: true, canShowScale: true };
  const pitch = getPitch(trackWidth, markerCount);
  return {
    canShowMarkers: pitch >= SLIDER_MIN_MARKER_PITCH,
    canShowScale: pitch >= widestLabelWidth + SLIDER_SCALE_LABEL_GAP,
  };
};

/**
 * Drops scale labels that would collide with the one kept before them.
 *
 * The pitch floor above assumes markers are evenly spaced, which stops being true when the
 * range is not a whole number of steps: the trailing partial step leaves the last whole step
 * a sliver away from `max`, and the two labels print on top of each other. Both are real
 * stops, so the fix is to stop drawing one of them rather than to stop offering it.
 *
 * `min` and `max` are always kept, since they are the bounds the scale exists to communicate.
 * A label colliding with `max` is dropped in favour of `max` rather than the other way round.
 */
const getSpacedScaleValues = ({
  values,
  trackWidth,
  widestLabelWidth,
  range,
}: {
  values: number[];
  trackWidth: number;
  widestLabelWidth: number;
  range: ValueRange;
}): number[] => {
  // Unmeasured, which is the SSR and first-paint case: show everything and let the first
  // resize observation correct it, matching how marker suppression behaves.
  if (trackWidth <= 0 || values.length <= 2) return values;

  const usable = trackWidth - SLIDER_MARKER_DOT;
  if (usable <= 0) return values;

  const minGap = widestLabelWidth + SLIDER_SCALE_LABEL_GAP;
  const positionOf = (target: number): number => getValueRatio(target, range) * usable;
  const lastKept = (kept: number[]): number => positionOf(kept[kept.length - 1]);

  const kept = [values[0]];
  for (let index = 1; index < values.length - 1; index++) {
    if (positionOf(values[index]) - lastKept(kept) >= minGap) kept.push(values[index]);
  }

  const last = values[values.length - 1];
  while (kept.length > 1 && positionOf(last) - lastKept(kept) < minGap) kept.pop();
  kept.push(last);

  return kept;
};

/** Narrowest track that can show every marker and label without collision. */
const getMinTrackWidth = (markerCount: number, widestLabelWidth: number): number => {
  if (markerCount <= 1) return SLIDER_MARKER_DOT;
  const pitch = Math.max(SLIDER_MIN_MARKER_PITCH, widestLabelWidth + SLIDER_SCALE_LABEL_GAP);
  return Math.ceil(pitch * (markerCount - 1) + SLIDER_MARKER_DOT);
};

/**
 * Value under a pointer.
 *
 * Reads direction off the track so that the maths agrees with the logical properties used
 * for layout. Blade has no RTL support today, but the two must not disagree if it gains it.
 */
const getValueFromPointer = ({
  clientX,
  trackRect,
  isRTL,
  range,
}: {
  clientX: number;
  trackRect: { left: number; width: number };
  isRTL: boolean;
  range: ValueRange;
}): number => {
  const usable = trackRect.width - SLIDER_MARKER_DOT;
  if (usable <= 0) return range.min;

  const fromStart = clientX - trackRect.left - SLIDER_MARKER_RADIUS;
  const rawRatio = clamp(fromStart / usable, 0, 1);
  const ratio = isRTL ? 1 - rawRatio : rawRatio;

  return snapValue(range.min + ratio * (range.max - range.min), range);
};

export {
  clamp,
  snapValue,
  roundToStep,
  getMarkerValues,
  getValueRatio,
  getOffsetExpression,
  getFillWidthExpression,
  getCenteringTransform,
  getMarkerMaskImage,
  getWidestLabelWidth,
  getPitch,
  getVisibility,
  getSpacedScaleValues,
  getMinTrackWidth,
  getValueFromPointer,
};
export type { ValueRange };
