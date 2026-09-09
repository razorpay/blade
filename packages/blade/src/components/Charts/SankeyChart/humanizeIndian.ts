// Truncates (never rounds up) to avoid overstating values.
// Examples: 2550→2.5k, 17100→17.1k, 124500→1.24L, 1000000→10L, 15000000→1.5Cr
export const humanizeIndian = (value: number): string => {
  if (value >= 1_00_00_000) {
    const v = Math.floor((value / 1_00_00_000) * 100) / 100;
    return `${parseFloat(v.toFixed(2))}Cr`;
  }
  if (value >= 1_00_000) {
    const v = Math.floor((value / 1_00_000) * 100) / 100;
    return `${parseFloat(v.toFixed(2))}L`;
  }
  if (value >= 1_000) {
    const v = Math.floor((value / 1_000) * 10) / 10;
    return `${parseFloat(v.toFixed(1))}k`;
  }
  return String(value);
};
