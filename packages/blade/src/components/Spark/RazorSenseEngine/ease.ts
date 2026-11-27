/** a cubic-bezier ease at x (0-1), as the studio's engine eases its keys */
const cubicBezier = (e: readonly number[], x: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const [x1, y1, x2, y2] = e;
  const bez = (a: number, b: number, t: number): number =>
    ((1 - 3 * b + 3 * a) * t + (3 * b - 6 * a)) * t * t + 3 * a * t;
  let lo = 0;
  let hi = 1;
  let t = x;
  for (let i = 0; i < 32; i++) {
    const v = bez(x1, x2, t);
    if (Math.abs(v - x) < 1e-6) break;
    if (v < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return bez(y1, y2, t);
};

export { cubicBezier };
