// @ts-check
/**
 * Builds the `blade-icons` font from prepared glyphs. Deterministic: the
 * same glyphs give the same bytes, so the file's hash only changes when the
 * icons do.
 */
import { Readable } from 'node:stream';
import { prepareSvg } from './svg.js';

export const FONT_FAMILY = 'blade-icons';

/**
 * @typedef {object} FontGlyph
 * @property {string} name
 * @property {number} code a Private Use Area codepoint
 * @property {string} svg the icon's markup
 */

/**
 * @param {FontGlyph[]} glyphs
 * @returns {Promise<{ ttf: Buffer; woff2: Buffer }>}
 */
export async function buildFont(glyphs) {
  const [{ SVGIcons2SVGFontStream }, { default: svg2ttf }, { default: wawoff2 }] = await Promise.all([
    import('svgicons2svgfont'),
    import('svg2ttf'),
    import('wawoff2'),
  ]);

  const svgFont = await new Promise((resolve, reject) => {
    // Every glyph is an em square: the icon's box is its font size, and with
    // no descent the em sits exactly on a `line-height: 1` line.
    const stream = new SVGIcons2SVGFontStream({
      fontName: FONT_FAMILY,
      fontHeight: 1000,
      normalize: true,
      preserveAspectRatio: true,
      fixedWidth: true,
      descent: 0,
      round: 1e3,
    });
    let font = '';
    stream.on('data', (/** @type {string | Buffer} */ chunk) => {
      font += chunk.toString();
    });
    stream.on('end', () => resolve(font));
    stream.on('error', reject);
    for (const { name, code, svg } of [...glyphs].sort((a, b) => a.code - b.code)) {
      const { viewBox, d } = prepareSvg(svg, name);
      const icon = /** @type {Readable & { metadata?: unknown }} */ (
        Readable.from([`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path d="${d}"/></svg>`])
      );
      icon.metadata = { name, unicode: [String.fromCodePoint(code)] };
      stream.write(icon);
    }
    stream.end();
  });

  // `ts: 0` pins the creation date the font records, keeping builds identical.
  const ttf = Buffer.from(svg2ttf(svgFont, { ts: 0, description: FONT_FAMILY, url: '' }).buffer);
  const woff2 = Buffer.from(await wawoff2.compress(ttf));
  return { ttf, woff2 };
}
