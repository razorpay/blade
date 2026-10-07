import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import TypographyHarness from './fixtures/TypographyHarness.svelte';
import { HEADING_AXES, resolveHeading, resolveText } from '../components/shared/typography';

describe('Text and Heading (preset components)', () => {
  it('Text renders the chosen element with the preset defaults', () => {
    const { getByTestId } = render(TypographyHarness);
    const plain = getByTestId('plain');
    expect(plain.tagName).toBe('P');
    expect(plain.className).toContain('text-100');
    expect(plain.className).toContain('text-surface-gray-normal');
    expect(plain.textContent).toContain('Plain');
  });

  it('Text resolves its style props and appends the caller class last', () => {
    const { getByTestId } = render(TypographyHarness);
    const styled = getByTestId('styled');
    expect(styled.tagName).toBe('SPAN');
    for (const name of ['text-75', 'font-medium', 'text-surface-gray-muted', 'clamp-2']) {
      expect(styled.className).toContain(name);
    }
    expect(styled.className.endsWith('mt-2')).toBe(true);
  });

  it('Text has a static white and a subtle step between default and muted', () => {
    const { getByTestId } = render(TypographyHarness);
    expect(getByTestId('on-dark').className).toContain('text-surface-static-white-normal');
    expect(getByTestId('subtle').className).toContain('text-surface-gray-subtle');
  });

  it('Heading keeps the document level apart from the visual size', () => {
    const { getByRole } = render(TypographyHarness);
    const heading = getByRole('heading', { level: 1, name: 'Card details' });
    expect(heading.className).toContain('font-heading');
    // Figma's Heading/Large: 24/32.
    expect(heading.className).toContain('text-500 leading-500');
    expect(heading.className).toContain('text-center');
  });

  it.each([
    ['xsmall', 'text-25 leading-25 tracking-50'],
    ['small', 'text-75 leading-75 tracking-50'],
    ['medium', 'text-100 leading-100 tracking-50'],
    ['large', 'text-200 leading-200 tracking-25'],
  ] as const)("Text %s is Figma's Body style", (size, classes) => {
    expect(resolveText({ size })).toContain(classes);
  });

  it.each([
    ['small', 'text-300 leading-300'],
    ['medium', 'text-400 leading-400'],
    ['large', 'text-500 leading-500'],
    ['xlarge', 'text-600 leading-600'],
    ['2xlarge', 'text-700 leading-700'],
  ] as const)("Heading %s is Figma's Heading style", (size, classes) => {
    expect(resolveHeading({ size })).toContain(classes);
  });

  it('Heading comes in Figma\'s two weights only', () => {
    expect(HEADING_AXES.weight).toEqual(['regular', 'semibold']);
  });
});
