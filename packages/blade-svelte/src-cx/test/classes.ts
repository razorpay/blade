import { expect } from 'vitest';
import { isGlyph, type Glyph, type IconSource } from '../runes/icon/source';

type WithClass = { className: string } | null | undefined;

/** Asserts a class on an element. */
export function expectClass(element: WithClass, cls: string): void {
  expect(element?.className ?? '').toContain(cls);
}

export function expectNoClass(element: WithClass, cls: string): void {
  expect(element?.className ?? '').not.toContain(cls);
}

/** Markup a component's decorative parts draw (a loader, a shimmer). */
export function expectMarkup(
  element: { innerHTML: string } | null | undefined,
  fragment: string,
): void {
  expect(element?.innerHTML ?? '').toContain(fragment);
}

/**
 * An icon as the tests see it: a glyph, since they run with the font plugin
 * (vitest.config.ts). Typed as its SVG's URL, which it is without one.
 */
export function asGlyph(icon: IconSource): Glyph {
  if (!isGlyph(icon)) throw new Error(`expected a glyph, got the URL ${icon}: is the font plugin in the test config?`);
  return icon;
}

/** The Icon glyphs inside an element, optionally only one glyph's. */
export function glyphsIn(element: ParentNode | null | undefined, token?: IconSource): HTMLElement[] {
  const selector = token ? `[data-icon="${asGlyph(token).name}"]` : '[data-icon]';
  return [...(element?.querySelectorAll<HTMLElement>(selector) ?? [])];
}

/** Asserts an element draws an Icon glyph: that token's, when one is given. */
export function expectGlyph(element: ParentNode | null | undefined, token?: IconSource): void {
  const [glyph] = glyphsIn(element, token);
  expect(glyph, `no ${token ? `"${asGlyph(token).name}" ` : ''}glyph`).toBeTruthy();
  if (token) expect(glyph.textContent).toBe(asGlyph(token).code);
}
