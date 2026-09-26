/** A member's share of its row; shares that add up to 1 form a row. */
export type InputGroupSpan = 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';

/** The group's corners; a member holds the ones its cell sits in. */
export type InputGroupCorner = 'tl' | 'tr' | 'bl' | 'br';

export type InputGroupCorners = Record<InputGroupCorner, boolean>;

// The box is a 12-track grid: a span is a whole number of tracks.
const TRACKS: Record<InputGroupSpan, number> = {
  full: 12,
  '1/2': 6,
  '1/3': 4,
  '2/3': 8,
  '1/4': 3,
  '3/4': 9,
};

/**
 * Which of the group's four corners each member holds, from the members'
 * spans in order. Placement follows the grid's own auto-placement: a member
 * that does not fit the rest of its row starts the next. The first member
 * of the first row holds the top-left corner and the last one the top-right;
 * the last row gives the bottom two — so rows are expected to fill, and a
 * ragged last row leaves the row above it with square corners.
 */
export function placeMembers(
  spans: readonly InputGroupSpan[]
): InputGroupCorners[] {
  const rows: number[][] = [];
  let used = TRACKS.full;
  spans.forEach((span, index) => {
    if (used + TRACKS[span] > TRACKS.full) {
      rows.push([]);
      used = 0;
    }
    rows[rows.length - 1].push(index);
    used += TRACKS[span];
  });
  const corners = spans.map<InputGroupCorners>(() => ({
    tl: false,
    tr: false,
    bl: false,
    br: false,
  }));
  const first = rows[0];
  const last = rows[rows.length - 1];
  if (first && last) {
    corners[first[0]].tl = true;
    corners[first[first.length - 1]].tr = true;
    corners[last[0]].bl = true;
    corners[last[last.length - 1]].br = true;
  }
  return corners;
}
