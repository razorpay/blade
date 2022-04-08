const makeBezier = (x1: number, y1: number, x2: number, y2: number): string => {
  return `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`;
};

export default makeBezier;
