/**
 * Geometry and motion for the indefinite 3-dot loader, from the `DotLoader`
 * component in Figma.
 *
 * Values are unitless px / ms so both the web (CSS) and native (Reanimated)
 * implementations can read them directly.
 */

/**
 * Per-size geometry. `large` is `medium` scaled by 1.5 so the loader keeps its
 * proportions and motion character at both sizes rather than becoming a visually
 * different loader.
 *
 * The dots are centered in a `boxSize` square at rest and lift by `lift` at the
 * peak — they never dip below the rest line. The lift is a transform, so it does
 * not shift the resting position the dots are laid out at.
 */
const dotLoaderGeometry = {
  medium: {
    boxSize: 24,
    dotSize: 4,
    gap: 2,
    lift: 5,
  },
  large: {
    boxSize: 36,
    dotSize: 6,
    gap: 3,
    lift: 7.5,
  },
} as const;

/** Motion is identical at every size; only the travel distance scales. */
const dotLoaderTokens = {
  durationMs: 1200,
  /** Delay applied between consecutive dots. */
  staggerMs: 150,
  restOpacity: 0.42,
  peakOpacity: 1,
  /**
   * Fraction of the loop at which a dot reaches its peak, and the fraction after
   * which it is held at rest for the remainder. The rest hold is what makes the
   * stagger read as a travelling wave rather than three dots moving in unison.
   */
  peakProgress: 0.3,
  restProgress: 0.6,
} as const;

/** Number of dots rendered. Indexes drive the per-dot stagger. */
const DOT_INDEXES = [0, 1, 2] as const;

/** Index of the dot held at its peak in the static reduced-motion pose. */
const REDUCED_MOTION_LIFTED_DOT_INDEX = 1;

export { dotLoaderTokens, dotLoaderGeometry, DOT_INDEXES, REDUCED_MOTION_LIFTED_DOT_INDEX };
