import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import TypographyHarness from './fixtures/TypographyHarness.svelte';

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
    expect(heading.className).toContain('text-400');
    expect(heading.className).toContain('text-center');
  });
});
