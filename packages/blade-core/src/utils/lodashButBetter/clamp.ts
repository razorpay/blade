function clamp(number: number, lower: number, upper: number): number {
  return Math.min(Math.max(number, lower), upper);
}

export default clamp;
