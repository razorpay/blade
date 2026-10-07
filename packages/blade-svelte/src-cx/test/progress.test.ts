import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { Progress } from '../components/progress';

describe('Progress (preset component)', () => {
  it('is hidden from assistive tech unless it is given a label', () => {
    const { getByTestId, rerender } = render(Progress, {
      props: { testID: 'wait' },
    });
    const wait = getByTestId('wait');
    expect(wait.getAttribute('aria-hidden')).toBe('true');
    expect(wait.hasAttribute('role')).toBe(false);

    return rerender({ testID: 'wait', accessibilityLabel: 'Loading' }).then(() => {
      expect(wait.getAttribute('role')).toBe('status');
      expect(wait.getAttribute('aria-label')).toBe('Loading');
      expect(wait.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  it('draws three staggered dots by default', () => {
    const { getByTestId } = render(Progress, { props: { testID: 'wait' } });
    const dots = Array.from(getByTestId('wait').children);
    expect(dots).toHaveLength(3);
    expect(dots[0].className).toContain('animate-bounce');
  });

  it('a bar is a progressbar that scales its fill by the clamped value', () => {
    const { getByTestId, rerender } = render(Progress, {
      props: {
        type: 'bar',
        value: 30,
        max: 120,
        accessibilityLabel: 'Free delivery',
        testID: 'bar',
        class: 'w-40',
      },
    });
    const bar = getByTestId('bar');
    expect(bar.getAttribute('role')).toBe('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('30');
    expect(bar.getAttribute('aria-valuemax')).toBe('120');
    expect(bar.style.getPropertyValue('--progress')).toBe('0.25');
    expect(bar.firstElementChild?.className).toContain('[scale:var(--progress)_1]');
    expect(bar.className.endsWith('w-40')).toBe(true);

    return rerender({ type: 'bar', value: 500, max: 120, testID: 'bar' }).then(() => {
      expect(bar.getAttribute('aria-valuenow')).toBe('120');
      expect(bar.style.getPropertyValue('--progress')).toBe('1');
    });
  });

  it('a ring draws its arc from the same fraction', () => {
    const { getByTestId } = render(Progress, {
      props: { type: 'ring', size: 'large', value: 75, testID: 'ring' },
    });
    const ring = getByTestId('ring');
    const [track, arc] = Array.from(ring.querySelectorAll('circle'));
    expect(ring.className).toContain('w-[72px] h-[72px]');
    expect(ring.style.getPropertyValue('--progress')).toBe('0.75');
    expect(track.getAttribute('class')).toContain('opacity-100');
    expect(arc.getAttribute('pathLength')).toBe('1');
    expect(arc.getAttribute('class')).toContain('stroke-dashoffset');
  });

  it.each([
    ['small', 'w-6 h-6', '15.66', '4.68'],
    ['medium', 'w-12 h-12', '16.2', '3.6'],
    ['large', 'w-[72px] h-[72px]', '16.38', '3.24'],
  ] as const)("a %s ring is Figma's circular size and thickness", (size, box, r, stroke) => {
    const { getByTestId } = render(Progress, { props: { type: 'ring', size, value: 50, testID: 'ring' } });
    const ring = getByTestId('ring');
    expect(ring.className).toContain(box);
    for (const circle of ring.querySelectorAll('circle')) {
      expect(circle.getAttribute('r')).toBe(r);
      expect(circle.getAttribute('stroke-width')).toBe(stroke);
    }
  });

  it.each([
    ['small', 'h-0.5'],
    ['medium', 'h-1'],
    ['large', 'h-1'],
  ] as const)("a %s bar is Figma's linear thickness", (size, height) => {
    const { getByTestId } = render(Progress, { props: { type: 'bar', size, value: 50, testID: 'bar' } });
    expect(getByTestId('bar').className).toContain(height);
  });
});
