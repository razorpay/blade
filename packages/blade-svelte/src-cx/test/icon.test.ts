import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { Icon } from '../index';
import { ChevronDownIcon, InfoIcon, LockIcon } from '../icons';
import * as glyphs from '../icons/glyphs';
import { asGlyph } from './classes';

describe('Icon', () => {
  it('draws its glyph as one private-use character of the icon font', () => {
    const { getByTestId } = render(Icon, {
      props: { source: ChevronDownIcon, testID: 'glyph' },
    });
    const glyph = getByTestId('glyph');
    expect(glyph.textContent).toBe(asGlyph(ChevronDownIcon).code);
    expect(glyph.dataset.icon).toBe('chevron-down');
    expect(glyph.className).toContain('icon-font');
    expect(glyph.children).toHaveLength(0);
  });

  it('without a font plugin, draws a URL as a mask over the text colour', () => {
    const { getByTestId } = render(Icon, {
      props: { source: '/assets/rocket-1a2b.svg', testID: 'glyph', color: 'primary' },
    });
    const glyph = getByTestId('glyph');
    expect(glyph.className).toContain('icon-mask');
    expect(glyph.className).toContain('icon-surface-primary-normal');
    expect(glyph.style.getPropertyValue('mask-image')).toBe('url("/assets/rocket-1a2b.svg")');
    expect(glyph.textContent).toBe('');
    expect(glyph.hasAttribute('data-icon')).toBe(false);
  });

  it('is decorative unless it is given a label', () => {
    const { getByTestId, rerender } = render(Icon, {
      props: { source: InfoIcon, testID: 'glyph' },
    });
    const glyph = getByTestId('glyph');
    expect(glyph.getAttribute('aria-hidden')).toBe('true');
    expect(glyph.hasAttribute('role')).toBe(false);

    return rerender({
      source: InfoIcon,
      testID: 'glyph',
      accessibilityLabel: 'Details',
    }).then(() => {
      expect(glyph.getAttribute('role')).toBe('img');
      expect(glyph.getAttribute('aria-label')).toBe('Details');
      expect(glyph.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  it('is 16px in the inherited colour by default; axes and class override', () => {
    const { getByTestId, rerender } = render(Icon, {
      props: { source: LockIcon, testID: 'glyph' },
    });
    const glyph = getByTestId('glyph');
    expect(glyph.className).toContain('w-4 h-4 [font-size:16px]');
    expect(glyph.className).toContain('text-inherit');

    return rerender({
      source: LockIcon,
      testID: 'glyph',
      size: 'large',
      color: 'muted',
      class: 'ml-2',
    }).then(() => {
      expect(glyph.className).toContain('w-5 h-5 [font-size:20px]');
      expect(glyph.className).toContain('icon-surface-gray-muted');
      expect(glyph.className.endsWith('ml-2')).toBe(true);
    });
  });

  it('ships every glyph as a unique Blade-block codepoint', () => {
    const tokens = Object.values(glyphs).map(asGlyph);
    expect(tokens.length).toBeGreaterThan(400);
    const codes = new Set(tokens.map(({ code }) => code));
    expect(codes.size).toBe(tokens.length);
    for (const { name, code } of tokens) {
      expect(code, name).toHaveLength(1);
      const point = code.codePointAt(0)!;
      expect(point >= 0xe000 && point <= 0xefff, name).toBe(true);
    }
  });
});
