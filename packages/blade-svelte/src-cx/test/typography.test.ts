import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import TypographyHarness from './fixtures/TypographyHarness.svelte';
import {
  HEADING_AXES,
  resolveCode,
  resolveDisplay,
  resolveHeading,
  resolveText,
} from '../components/shared/typography';
import { createRawSnippet } from 'svelte';
import { Code } from '../components/code';
import { Display } from '../components/display';

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

const words = (text: string) => createRawSnippet(() => ({ render: () => `<span>${text}</span>` }));

describe('Display (preset component)', () => {
  it("is Figma's Display scale in the heading face, an h1 by default", () => {
    const { getByRole } = render(Display, { props: { children: words('Accept payments') } });
    const display = getByRole('heading', { level: 1, name: 'Accept payments' });
    expect(display.className).toContain('font-heading');
    expect(display.className).toContain('text-800 leading-800');
    expect(display.className).toContain('font-semibold');
    expect(display.className).not.toContain('tracking-');
  });

  it('sizes 48 to 72px; regular and medium are letter-spaced, semibold not', () => {
    expect(resolveDisplay({ size: 'xlarge' })).toContain('text-1100 leading-1100');
    expect(resolveDisplay({ size: 'large' })).toContain('text-1000 leading-1000');
    expect(resolveDisplay({ weight: 'regular' })).toContain('font-normal tracking-50');
    expect(resolveDisplay({ weight: 'medium' })).toContain('font-medium tracking-50');
  });
});

describe('Code (preset component)', () => {
  it('is a <code> in an inline chip, highlighted by default', () => {
    const { getByTestId } = render(Code, { props: { children: words('KEY_ID'), testID: 'code', class: 'ml-1' } });
    const root = getByTestId('code');
    expect(root.tagName).toBe('SPAN');
    expect(root.className).toContain('inline-block align-middle');
    expect(root.className).toContain('bg-feedback-neutral-subtle');
    expect(root.className.endsWith('ml-1')).toBe(true);
    const code = root.firstElementChild!;
    expect(code.tagName).toBe('CODE');
    expect(code.className).toContain('font-mono');
    expect(code.className).toContain('text-surface-gray-subtle');
    expect(code.textContent).toBe('KEY_ID');
  });

  it("follows Figma's 10/14 and 12/18; plain code takes a colour", () => {
    expect(resolveCode().code).toContain('text-25 [line-height:0.875rem]');
    expect(resolveCode({ size: 'medium', weight: 'bold' }).code).toContain('text-75 [line-height:1.125rem] font-bold');
    const plain = resolveCode({ isHighlighted: false, color: 'primary' });
    expect(plain.root).not.toContain('bg-');
    expect(plain.code).toContain('text-surface-primary-normal');
  });
});

