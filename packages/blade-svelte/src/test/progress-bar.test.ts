import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { ProgressBar, resolveProgressBar } from '../components/progress-bar';
import { expectClass, expectNoClass } from './classes';

describe('ProgressBar (preset component)', () => {
  it('a linear progress bar is a progressbar, filled to its floored percentage', async () => {
    const { getByRole, getByText, rerender } = render(ProgressBar, {
      props: { label: 'Uploading', value: 30, max: 120 },
    });
    const bar = getByRole('progressbar', { name: 'Uploading' });
    expect(bar.getAttribute('aria-valuenow')).toBe('25');
    expect(bar.getAttribute('aria-valuetext')).toBe('25%');
    expect(bar.getAttribute('aria-valuemax')).toBe('120');
    expect(bar.style.getPropertyValue('--progress')).toBe('25');
    expectClass(bar.firstElementChild as HTMLElement, '[width:calc(var(--progress)*1%)]');
    // The primary fill by default, pulsing.
    expectClass(bar.firstElementChild as HTMLElement, 'bg-surface-primary-intense');
    expect(bar.querySelector('.animate-progress-pulse')).not.toBeNull();
    expect(getByText('25%')).toBeTruthy();

    await rerender({ label: 'Uploading', value: 500, max: 120 });
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
  });

  it('a meter reports its value, shows no percentage and does not pulse', () => {
    const { getByRole, queryByText } = render(ProgressBar, {
      props: { type: 'meter', label: 'Storage', value: 1, max: 3, color: 'notice' },
    });
    const meter = getByRole('meter', { name: 'Storage' });
    expect(meter.getAttribute('aria-valuenow')).toBe('1');
    expect(meter.getAttribute('aria-valuetext')).toBe('1');
    expectClass(meter.firstElementChild as HTMLElement, 'bg-feedback-notice-intense');
    expect(meter.querySelector('.animate-progress-pulse')).toBeNull();
    expect(queryByText(/%$/)).toBeNull();
  });

  it('an indeterminate bar slides, reporting no value or percentage', () => {
    const { getByRole, queryByText } = render(ProgressBar, {
      props: { accessibilityLabel: 'Loading', value: 40, isIndeterminate: true },
    });
    const bar = getByRole('progressbar', { name: 'Loading' });
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
    expectClass(bar.firstElementChild as HTMLElement, 'animate-progress-slide');
    expect(queryByText('40%')).toBeNull();
  });

  it('showPercentage={false} hides the percentage', () => {
    const { queryByText } = render(ProgressBar, { props: { value: 40, showPercentage: false } });
    expect(queryByText('40%')).toBeNull();
  });

  it('a circular bar dashes its arc and shows the percentage inside above small', () => {
    const { getByRole, getByText, getByTestId } = render(ProgressBar, {
      props: {
        variant: 'circular',
        size: 'medium',
        label: 'Profile',
        value: 60,
        color: 'positive',
        testID: 'ring',
        class: 'mt-4',
      },
    });
    const ring = getByRole('progressbar', { name: 'Profile' });
    expect(ring.tagName.toLowerCase()).toBe('svg');
    expect(ring.getAttribute('width')).toBe('48');
    expect(ring.style.getPropertyValue('--progress')).toBe('60');
    const arc = ring.querySelectorAll('circle')[1];
    expect(arc.getAttribute('class')).toContain('stroke-feedback-positive-intense');
    expect(arc.getAttribute('class')).toContain('animate-progress-ring-pulse');
    expect(getByText('60%').tagName.toLowerCase()).toBe('text');
    expect(getByText('Profile')).toBeTruthy();
    expect(getByTestId('ring').className.endsWith('mt-4')).toBe(true);
  });

  it('a small circular bar shows its percentage below; a full one stops pulsing', () => {
    const { getByText, getByRole } = render(ProgressBar, {
      props: { variant: 'circular', value: 100, accessibilityLabel: 'Done' },
    });
    expect(getByText('100%').tagName.toLowerCase()).toBe('p');
    const arc = getByRole('progressbar').querySelectorAll('circle')[1];
    expect(arc.getAttribute('class')).not.toContain('animate-progress-ring-pulse');
  });

  it.each([
    ['small', 'h-0.5'],
    ['medium', 'h-1'],
  ] as const)('a %s linear track is Blade’s thickness', (size, height) => {
    expect(resolveProgressBar({ size }).track).toContain(height);
  });

  it.each([
    ['small', 24, 3],
    ['medium', 48, 5],
    ['large', 72, 7],
  ] as const)('a %s ring is %ipx across with a %ipx stroke', (size, box, stroke) => {
    const { ring } = resolveProgressBar({ variant: 'circular', size });
    expect(ring).toEqual({ box, stroke, radius: (box - stroke) / 2 });
  });

  it('the track is feedback neutral-subtle', () => {
    expectNoClass({ className: resolveProgressBar().track }, 'bg-current');
    expect(resolveProgressBar().track).toContain('bg-feedback-neutral-subtle');
  });
});
