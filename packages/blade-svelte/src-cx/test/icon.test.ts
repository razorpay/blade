import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { icons, Icon } from '../index';
import IconNative from '../components/icon/Icon.native.svelte';

describe('Icon', () => {
  it('inlines markup so the glyph paints with the text colour', () => {
    const { getByTestId } = render(Icon, {
      props: { source: icons.chevronDown, testID: 'glyph' },
    });
    const glyph = getByTestId('glyph');
    expect(glyph.querySelector('svg')).not.toBeNull();
    expect(glyph.querySelector('img')).toBeNull();
    expect(glyph.innerHTML).toContain('currentColor');
  });

  it('loads a URL as an image', () => {
    const { getByTestId } = render(Icon, {
      props: { source: '/icons/lock.svg', testID: 'glyph' },
    });
    const image = getByTestId('glyph').querySelector('img');
    expect(image?.getAttribute('src')).toBe('/icons/lock.svg');
    expect(image?.getAttribute('alt')).toBe('');
  });

  it('is decorative unless it is given a label', () => {
    const { getByTestId, rerender } = render(Icon, {
      props: { source: icons.info, testID: 'glyph' },
    });
    const glyph = getByTestId('glyph');
    expect(glyph.getAttribute('aria-hidden')).toBe('true');
    expect(glyph.hasAttribute('role')).toBe(false);

    return rerender({
      source: icons.info,
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
      props: { source: icons.lock, testID: 'glyph' },
    });
    const glyph = getByTestId('glyph');
    expect(glyph.className).toContain('w-4 h-4');
    expect(glyph.className).toContain('text-inherit');

    return rerender({
      source: icons.lock,
      testID: 'glyph',
      size: 'large',
      color: 'muted',
      class: 'ml-2',
    }).then(() => {
      expect(glyph.className).toContain('w-5 h-5');
      expect(glyph.className).toContain('icon-surface-gray-muted');
      expect(glyph.className.endsWith('ml-2')).toBe(true);
    });
  });

  it('ships every glyph as currentColor-only markup without a root size', () => {
    for (const [name, markup] of Object.entries(icons)) {
      expect(markup, name).toMatch(/^<svg[^>]*viewBox=/);
      expect(markup, name).toContain('currentColor');
      expect(markup, name).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(markup.match(/^<svg[^>]*>/)?.[0], name).not.toMatch(
        /\s(width|height)=/
      );
      expect(markup.length, name).toBeLessThan(1024);
    }
  });
});

describe('Icon (native)', () => {
  it('is always an image: markup travels as a data URI', () => {
    const { getByTestId } = render(IconNative, {
      props: { source: icons.close, testID: 'glyph', size: 'small' },
    });
    const image = getByTestId('glyph');
    expect(image.tagName).toBe('IMG');
    expect(image.getAttribute('src')).toMatch(/^data:image\/svg\+xml;utf8,/);
    expect(image.className).toContain('w-3 h-3');
  });
});
