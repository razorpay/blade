import { describe, it, expect } from 'vitest';
import { createSheetDrag } from './sheet-drag';

describe('createSheetDrag', () => {
  it('follows the finger down and never above its resting place', () => {
    const drag = createSheetDrag();
    drag.start(100, 0);
    expect(drag.isDragging()).toBe(true);
    expect(drag.move(160, 500)).toBe(60);
    expect(drag.move(80, 900)).toBe(0);
  });

  it('dismisses past half its height, settles short of it', () => {
    const drag = createSheetDrag();
    drag.start(100, 0);
    drag.move(310, 2000);
    expect(drag.end(400)).toBe('dismiss');
    expect(drag.isDragging()).toBe(false);

    drag.start(100, 0);
    drag.move(250, 2000);
    expect(drag.end(400)).toBe('settle');
    expect(drag.offset()).toBe(0);
  });

  it('dismisses on a downward fling, however short', () => {
    const drag = createSheetDrag();
    drag.start(100, 0);
    drag.move(105, 1000);
    drag.move(165, 1040); // 60px in 40ms
    expect(drag.end(400)).toBe('dismiss');
  });

  it('a slow drag that ends with an upward flick settles', () => {
    const drag = createSheetDrag();
    drag.start(100, 0);
    drag.move(180, 1000);
    drag.move(150, 1030);
    expect(drag.end(400)).toBe('settle');
  });

  it('resists when it may not close; a fling still asks', () => {
    const drag = createSheetDrag({ dismissible: () => false });
    drag.start(100, 0);
    expect(drag.move(500, 50)).toBe(100);
    expect(drag.end(400)).toBe('dismiss');
    // Pulled slowly, the resisted offset never passes half the sheet.
    drag.start(100, 0);
    drag.move(500, 2000);
    expect(drag.end(400)).toBe('settle');
  });

  it('a release without a drag, or after a cancel, is a settle', () => {
    const drag = createSheetDrag();
    expect(drag.end(400)).toBe('settle');
    drag.start(100, 0);
    drag.move(400, 10);
    drag.cancel();
    expect(drag.end(400)).toBe('settle');
  });
});
