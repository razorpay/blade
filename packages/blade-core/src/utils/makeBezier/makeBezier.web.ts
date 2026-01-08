export const makeBezier = <
  X1 extends number,
  Y1 extends number,
  X2 extends number,
  Y2 extends number
>(
  x1: X1,
  y1: Y1,
  x2: X2,
  y2: Y2,
): `cubic-bezier(${X1}, ${Y1}, ${X2}, ${Y2})` => {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
};
