/** The rows to render and the padding that stands in for the rest. */
export interface VisibleRange {
  start: number;
  /** Exclusive. */
  end: number;
  padTop: number;
  padBottom: number;
}

export interface VirtualRange extends VisibleRange {
  /** The predicted height of the whole list; exact once every row was seen. */
  total: number;
}

export interface VirtualWindowOptions {
  /** Rows kept mounted beyond each edge of the viewport. */
  overscan?: number;
  /** What a row counts as until the first one is measured. */
  initialEstimate?: number;
}

export interface VirtualWindowModel {
  /** The rows in their current order; sizes already measured are kept. */
  setKeys(keys: readonly string[]): void;
  /** The slice to mount for a scroll position, with the padding around it. */
  range(scrollTop: number, viewport: number): VirtualRange;
  /**
   * Actual row heights as they become known. Returns the scroll correction:
   * how far the first visible row moved because rows above it turned out
   * taller or shorter than predicted. Adding it to `scrollTop` keeps what
   * the user is looking at in place.
   */
  measure(sizes: ReadonlyArray<readonly [key: string, height: number]>): number;
  /** The height an unmeasured row counts as: the mean of the measured ones. */
  estimate(): number;
  /** Where a row is predicted to start: what to scroll to to bring it in. */
  offset(index: number): number;
}

/**
 * A window over rows of unknown, varying height. The total height is a
 * prediction — measured rows count as measured, the rest as the running
 * mean — that corrects itself as rows are seen while scrolling either way.
 * Sizes are keyed by row key, not index, so they survive filtering and
 * re-ordering. Pure: the anatomy measures and scrolls, this only computes.
 */
export function createVirtualWindow(options: VirtualWindowOptions = {}): VirtualWindowModel {
  const overscan = Math.max(0, options.overscan ?? 3);
  const initialEstimate = options.initialEstimate ?? 48;
  const sizes = new Map<string, number>();
  let measuredSum = 0;
  let keys: readonly string[] = [];
  // offsets[i] is where row i starts; offsets[count] is the total.
  let offsets: number[] = [0];
  let stale = true;
  // The first row in view at the last `range` call.
  let anchor = 0;

  const estimate = (): number => (sizes.size ? measuredSum / sizes.size : initialEstimate);

  function layout(): number[] {
    if (stale) {
      const guess = estimate();
      offsets = [0];
      for (let i = 0; i < keys.length; i++) {
        offsets.push((offsets[i] ?? 0) + (sizes.get(keys[i] ?? '') ?? guess));
      }
      stale = false;
    }
    return offsets;
  }

  /** The row whose span contains `position`. */
  function rowAt(position: number): number {
    const at = layout();
    let low = 0;
    let high = Math.max(0, keys.length - 1);
    while (low < high) {
      const mid = Math.floor((low + high + 1) / 2);
      if ((at[mid] ?? 0) <= position) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }
    return low;
  }

  return {
    estimate,
    offset: (index) => layout()[Math.min(Math.max(0, index), keys.length)] ?? 0,
    setKeys(next) {
      keys = next;
      stale = true;
      anchor = Math.min(anchor, Math.max(0, next.length - 1));
    },
    range(scrollTop, viewport) {
      const at = layout();
      const count = keys.length;
      const total = at[count] ?? 0;
      if (!count) {
        anchor = 0;
        return { start: 0, end: 0, padTop: 0, padBottom: 0, total: 0 };
      }
      const top = Math.min(Math.max(0, scrollTop), total);
      anchor = rowAt(top);
      const last = rowAt(top + Math.max(0, viewport));
      const start = Math.max(0, anchor - overscan);
      const end = Math.min(count, last + 1 + overscan);
      return {
        start,
        end,
        padTop: at[start] ?? 0,
        padBottom: total - (at[end] ?? total),
        total,
      };
    },
    measure(entries) {
      const before = layout()[anchor] ?? 0;
      for (const [key, height] of entries) {
        // A row with no layout yet (hidden, not painted) says nothing, and a
        // row a pixel off its last size is the same row: a hairline that
        // depends on its place in the slice would otherwise re-measure with
        // every shift, and the correction would chase itself.
        const known = sizes.get(key);
        if (height > 0 && (known === undefined || Math.abs(known - height) > 1)) {
          measuredSum += height - (sizes.get(key) ?? 0);
          sizes.set(key, height);
          stale = true;
        }
      }
      return (layout()[anchor] ?? 0) - before;
    },
  };
}
