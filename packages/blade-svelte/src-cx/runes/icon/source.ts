/**
 * An icon, as an `icon`/`source` prop takes it. Without a font plugin it is
 * the URL of a single-colour SVG (what importing the file yields), drawn as a
 * mask in the text colour. With `bladeIconFontPlugin` (Vite or webpack) the
 * same import yields a `Glyph`: one character of the `blade-icons` font the
 * app's build makes from the icons it imports. Either way it paints with the
 * text colour; anything with its own colours is an Image.
 */
export type IconSource = string | Glyph;

/** One glyph of the `blade-icons` font. */
export interface Glyph {
  /** The glyph's name: the SVG's file name, and `data-icon`. */
  readonly name: string;
  /** The glyph's codepoint, a Private Use Area character. */
  readonly code: string;
}

export function glyph(name: string, code: string): Glyph {
  return { name, code };
}

export function isGlyph(source: IconSource): source is Glyph {
  return typeof source === 'object';
}
