export interface BladeIconFontPluginOptions {
  /**
   * The app's icon folders, relative to the project root. Any plain import
   * of an SVG in them (`import RocketIcon from './icons/rocket.svg'`) becomes
   * a glyph, and the font holds it once something imports it. Files are
   * named in kebab-case, single colour, filled shapes only (no strokes,
   * transforms or opacity). Without the plugin the same import is its URL.
   */
  extra?: string | readonly string[];
  /**
   * Font files to emit. `ttf` is for renderers without woff2.
   * @default ['woff2']
   */
  formats?: readonly ('woff2' | 'ttf')[];
}
