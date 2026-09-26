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

    return rerender({ testID: 'wait', accessibilityLabel: 'Loading' }).then(
      () => {
        expect(wait.getAttribute('role')).toBe('status');
        expect(wait.getAttribute('aria-label')).toBe('Loading');
        expect(wait.hasAttribute('aria-hidden')).toBe(false);
      }
    );
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
    expect(bar.firstElementChild?.className).toContain(
      '[scale:var(--progress)_1]'
    );
    expect(bar.className.endsWith('w-40')).toBe(true);

    return rerender({ type: 'bar', value: 500, max: 120, testID: 'bar' }).then(
      () => {
        expect(bar.getAttribute('aria-valuenow')).toBe('120');
        expect(bar.style.getPropertyValue('--progress')).toBe('1');
      }
    );
  });

  it('a ring draws its arc from the same fraction', () => {
    const { getByTestId } = render(Progress, {
      props: { type: 'ring', size: 'large', value: 75, testID: 'ring' },
    });
    const ring = getByTestId('ring');
    const [track, arc] = Array.from(ring.querySelectorAll('circle'));
    expect(ring.className).toContain('w-10');
    expect(ring.style.getPropertyValue('--progress')).toBe('0.75');
    expect(track.getAttribute('class')).toContain('opacity-100');
    expect(arc.getAttribute('pathLength')).toBe('1');
    expect(arc.getAttribute('class')).toContain('stroke-dashoffset');
  });
});
