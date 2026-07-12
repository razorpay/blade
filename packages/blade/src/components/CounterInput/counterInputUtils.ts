/**
 * Calculates the number of character slots needed to display a counter value,
 * including a minimum of 2 digits and an extra slot for a negative sign.
 *
 * When `value` is `undefined` (uncontrolled component with no defaultValue),
 * the displayed value is an empty string, so we fall back to `0` — yielding
 * the minimum digit count of 2 rather than deriving from `min`, which could
 * be a large negative number and cause the field to start wider than necessary.
 *
 * @param value - The current numeric value (or undefined when uncontrolled)
 * @returns The number of character slots (min 2, +1 for negative sign)
 */
const getCounterValueDigitCount = (value: number | undefined): number => {
  const rawCounterValue = value ?? 0;
  return Math.max(2, String(Math.abs(rawCounterValue)).length) + (rawCounterValue < 0 ? 1 : 0);
};

export { getCounterValueDigitCount };
