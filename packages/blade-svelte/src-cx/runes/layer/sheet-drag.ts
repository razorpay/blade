export interface SheetDragOptions {
  /**
   * Whether a drag may close the sheet. When not, it resists; a fling still
   * asks, and the sheet settles unless its owner closes it.
   */
  dismissible?: () => boolean;
  /** Downward speed, in px/s, past which a release dismisses. */
  flingVelocity?: number;
}

export interface SheetDragModel {
  start(y: number, time: number): void;
  /** Returns how far the surface is pulled along its way out: never negative. */
  move(y: number, time: number): number;
  /**
   * The finger lifted. `dismiss` when it was flung down or dropped past
   * half the sheet's height — a request: the owner decides whether it
   * closes; otherwise `settle`.
   */
  end(sheetHeight: number): 'dismiss' | 'settle';
  cancel(): void;
  isDragging(): boolean;
  offset(): number;
}

// A sheet that may not close still follows the finger a little, so the
// refusal reads as resistance instead of a dead control.
const RESISTANCE = 0.25;
// Speed is read over the last moments of the gesture, not its whole length.
const VELOCITY_WINDOW = 100;

/**
 * Drag-to-dismiss for a sheet or a drawer, in positions along its way out
 * (the caller flips them for a left drawer): one resting place, pulled out to
 * close. Pure — the anatomy feeds pointer positions and applies the offset.
 */
export function createSheetDrag(
  options: SheetDragOptions = {}
): SheetDragModel {
  const flingVelocity = options.flingVelocity ?? 1000;
  const mayDismiss = (): boolean => options.dismissible?.() ?? true;
  let origin: number | undefined;
  let offset = 0;
  let samples: Array<{ y: number; time: number }> = [];

  function reset(): void {
    origin = undefined;
    offset = 0;
    samples = [];
  }

  function velocity(): number {
    const last = samples[samples.length - 1];
    const first = samples.find(
      (sample) => last && last.time - sample.time <= VELOCITY_WINDOW
    );
    if (!first || !last || last.time === first.time) {
      return 0;
    }
    return ((last.y - first.y) / (last.time - first.time)) * 1000;
  }

  return {
    isDragging: () => origin !== undefined,
    offset: () => offset,
    start(y, time) {
      origin = y;
      offset = 0;
      samples = [{ y, time }];
    },
    move(y, time) {
      if (origin === undefined) {
        return 0;
      }
      samples.push({ y, time });
      const pulled = Math.max(0, y - origin);
      offset = mayDismiss() ? pulled : pulled * RESISTANCE;
      return offset;
    },
    end(sheetHeight) {
      const dismiss =
        origin !== undefined &&
        offset > 0 &&
        (velocity() > flingVelocity || offset > sheetHeight / 2);
      reset();
      return dismiss ? 'dismiss' : 'settle';
    },
    cancel: reset,
  };
}
