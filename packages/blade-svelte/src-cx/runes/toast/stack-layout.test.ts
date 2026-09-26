import { describe, it, expect } from 'vitest';
import { isToastStackExpanded, layoutToastStack } from './stack-layout';

const geometry = { gutter: 12, peek: 12, scaleStep: 0.05, front: 1, peeks: 3 };

describe('isToastStackExpanded', () => {
  it('a short stack is always expanded; a long one only while held', () => {
    expect(isToastStackExpanded(3, false, 3)).toBe(true);
    expect(isToastStackExpanded(4, false, 3)).toBe(false);
    expect(isToastStackExpanded(4, true, 3)).toBe(true);
    expect(isToastStackExpanded(2, false, 1)).toBe(false);
  });
});

describe('layoutToastStack', () => {
  it('expanded: edge to edge with the gutter between, full size', () => {
    expect(layoutToastStack([44, 64, 44], true, geometry)).toEqual([
      { offset: 0, scale: 1, opacity: 1, height: 44 },
      { offset: 56, scale: 1, opacity: 1, height: 64 },
      { offset: 132, scale: 1, opacity: 1, height: 44 },
    ]);
  });

  it('collapsed: each peeks a step behind, smaller, cropped to the front', () => {
    expect(layoutToastStack([44, 64, 44, 44, 44], false, geometry)).toEqual([
      { offset: 0, scale: 1, opacity: 1, height: 44 },
      { offset: 12, scale: 0.95, opacity: 1, height: 44 },
      { offset: 24, scale: 0.9, opacity: 1, height: 44 },
      { offset: 36, scale: 0.85, opacity: 1, height: 44 },
      { offset: 48, scale: 0.8, opacity: 0, height: 44 },
    ]);
  });

  it('never shrinks below 70%', () => {
    const placed = layoutToastStack(new Array(9).fill(44), false, geometry);
    expect(placed[8].scale).toBe(0.7);
  });

  it('an unmeasured toast is neither cropped nor sized', () => {
    expect(layoutToastStack([undefined, 64], false, geometry)).toEqual([
      { offset: 0, scale: 1, opacity: 1, height: undefined },
      { offset: 12, scale: 0.95, opacity: 1, height: 64 },
    ]);
    expect(layoutToastStack([44, undefined], true, geometry)[1].offset).toBe(
      56
    );
  });
});
