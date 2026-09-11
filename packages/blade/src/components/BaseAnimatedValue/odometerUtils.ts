/**
 * A digit in the rendered string, together with the power of ten it represents.
 *
 * The place is what lets one animating number drive every column: the units column reads it
 * directly, the tens column a tenth as fast, and so on, which is what makes a carry roll
 * through instead of snapping.
 */
type DigitSlot = {
  type: 'digit';
  /** Power of ten, so 2 in `123` is place 1 and 3 in `1.23` is place -2. */
  place: number;
};

/** Anything that is not a digit: a sign, a separator, a decimal point, a unit. */
type LiteralSlot = {
  type: 'literal';
  char: string;
};

type Slot = DigitSlot | LiteralSlot;

type ParsedNumber = {
  slots: Slot[];
  /** The smallest place present, which is the only column that rolls continuously. */
  lowestPlace: number;
};

/**
 * Splits a rendered number into the columns that will be animated.
 *
 * Works off the formatted text rather than the raw number so separators, a currency symbol or
 * a trailing unit survive: they simply become literals sitting between the digit columns.
 *
 * Returns `null` when the text holds no digits at all, which is the signal to fall back to
 * swapping the whole value.
 */
const parseNumericText = (text: string): ParsedNumber | null => {
  const digitIndexes: number[] = [];
  for (let index = 0; index < text.length; index++) {
    if (text[index] >= '0' && text[index] <= '9') digitIndexes.push(index);
  }
  if (digitIndexes.length === 0) return null;

  /*
   * The decimal point is whichever dot sits between two digits. Anything else that looks like
   * one is punctuation and is left alone — a trailing full stop, or a thousands separator in
   * locales that use `.` for it, which is why the separator itself is never treated as a point.
   */
  const pointIndex = text.split('').findIndex(
    (char, index) =>
      char === '.' &&
      digitIndexes.includes(index - 1) &&
      digitIndexes.includes(index + 1) &&
      // Groups are three digits, so a dot with more than three digits after it before the
      // next non-digit cannot be a separator.
      !/^\.\d{3}(?!\d)/.test(text.slice(index)),
  );

  const integerDigits = digitIndexes.filter((index) => pointIndex === -1 || index < pointIndex);
  const fractionDigits = digitIndexes.filter((index) => pointIndex !== -1 && index > pointIndex);

  const placeOf = new Map<number, number>();
  integerDigits.forEach((index, position) => {
    placeOf.set(index, integerDigits.length - 1 - position);
  });
  fractionDigits.forEach((index, position) => {
    placeOf.set(index, -(position + 1));
  });

  const slots: Slot[] = text
    .split('')
    .map((char, index) =>
      placeOf.has(index)
        ? { type: 'digit', place: placeOf.get(index)! }
        : { type: 'literal', char },
    );

  return { slots, lowestPlace: Math.min(...Array.from(placeOf.values())) };
};

/**
 * Where a column should sit, in digits, for a given value.
 *
 * The lowest place moves with the whole fractional part, so it rolls smoothly as the value
 * changes. Every place above it holds still until the places below are about to wrap, which is
 * what keeps `12` reading as a crisp `12` rather than a tens column parked a fifth of the way
 * towards `2`.
 *
 * That carry is spread over one step of the smallest place on show, not over the last tenth of
 * the current place. The difference only appears once there are decimals: `99.99` is 99.9% of
 * the way to `100`, so a carry measured against the tens would have the tens column all but
 * rolled over while the value is simply sitting still, printing `00.99`.
 *
 * The result runs `[0, 10)` and is allowed to pass through 10 during a carry, which is why the
 * column repeats its first digit at the end.
 */
const getColumnPosition = (value: number, place: number, lowestPlace: number): number => {
  const magnitude = Math.abs(value);
  const scaled = magnitude / 10 ** place;
  const whole = Math.floor(scaled);
  if (place === lowestPlace) return (whole % 10) + (scaled - whole);

  const step = 10 ** lowestPlace;
  const unit = 10 ** place;
  const below = magnitude % unit;
  const carry = Math.min(Math.max((below - (unit - step)) / step, 0), 1);
  return (whole % 10) + carry;
};

export { parseNumericText, getColumnPosition };
export type { ParsedNumber, Slot, DigitSlot };
