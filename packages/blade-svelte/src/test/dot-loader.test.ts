import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { DotLoader, resolveDotLoader } from '../components/dot-loader';
import { expectClass } from './classes';

describe('DotLoader (preset component)', () => {
  it('is hidden from assistive tech unless it is given a label', async () => {
    const { getByTestId, rerender } = render(DotLoader, { props: { testID: 'wait' } });
    const wait = getByTestId('wait');
    expect(wait.getAttribute('aria-hidden')).toBe('true');
    expect(wait.hasAttribute('role')).toBe(false);

    await rerender({ testID: 'wait', accessibilityLabel: 'Loading' });
    expect(wait.getAttribute('role')).toBe('status');
    expect(wait.getAttribute('aria-label')).toBe('Loading');
    expect(wait.hasAttribute('aria-hidden')).toBe(false);
  });

  it('draws three dots rising in turn, 150ms apart', () => {
    const { getByTestId } = render(DotLoader, { props: { testID: 'wait' } });
    const dots = Array.from(getByTestId('wait').children);
    expect(dots).toHaveLength(3);
    for (const dot of dots) expectClass(dot, 'animate-dot');
    expectClass(dots[1], '[animation-delay:150ms]');
    expectClass(dots[2], '[animation-delay:300ms]');
  });

  it('is medium and muted by default, the caller class last', () => {
    const { getByTestId } = render(DotLoader, { props: { testID: 'wait', class: 'mx-2' } });
    const wait = getByTestId('wait');
    expectClass(wait, 'w-6 h-6');
    expectClass(wait, 'icon-surface-gray-muted');
    expect(wait.className.endsWith('mx-2')).toBe(true);
  });

  it.each([
    ['small', 'w-[18px] h-[18px]', 'w-[3px] h-[3px] [--lift:3.75px]'],
    ['medium', 'w-6 h-6', 'w-1 h-1 [--lift:5px]'],
    ['large', 'w-9 h-9', 'w-1.5 h-1.5 [--lift:7.5px]'],
  ] as const)('%s is Blade’s geometry, scaled from medium', (size, box, dot) => {
    const classes = resolveDotLoader({ size });
    expect(classes.root).toContain(box);
    expect(classes.dots[0]).toContain(dot);
  });

  it('inherit takes the host’s colour', () => {
    expect(resolveDotLoader({ color: 'inherit' }).root).toContain('text-inherit');
  });
});
