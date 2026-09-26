/** Whether the user asked for less motion. False where there is no `matchMedia` (Node, native). */
export function prefersReducedMotion(): boolean {
  return (
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * A CSS `cubic-bezier(x1, y1, x2, y2)` as an easing function, for JS-driven
 * transitions that must follow a Blade easing token.
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): (t: number) => number {
  const at = (a: number, b: number, s: number): number =>
    3 * a * s * (1 - s) ** 2 + 3 * b * s ** 2 * (1 - s) + s ** 3;
  return (t) => {
    if (t <= 0 || t >= 1) {
      return t <= 0 ? 0 : 1;
    }
    // x is monotonic in s: bisect for the s whose x is t.
    let low = 0;
    let high = 1;
    let s = t;
    for (let i = 0; i < 20; i += 1) {
      s = (low + high) / 2;
      if (at(x1, x2, s) < t) {
        low = s;
      } else {
        high = s;
      }
    }
    return at(y1, y2, s);
  };
}

/** Blade's `motion.easing.standard`. */
export const easeStandard = cubicBezier(0.3, 0, 0.2, 1);
