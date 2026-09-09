import type { CreateThemeFontFace } from '~tokens/theme/createThemeConfig';

const normalizeSrc = (src: string): string => {
  const trimmed = src.trim();
  if (trimmed.startsWith('url(')) {
    return trimmed;
  }
  return `url(${JSON.stringify(trimmed)})`;
};

const srcWithFormat = (src: string, format?: string): string => {
  const url = normalizeSrc(src);
  if (!format || /\sformat\s*\(/i.test(src)) {
    return url;
  }
  return `${url} format('${format}')`;
};

/**
 * Build a CSS string of `@font-face` rules for custom merchant fonts.
 */
export const buildFontFaceCss = (fontFaces: CreateThemeFontFace[]): string => {
  return fontFaces
    .map((face) => {
      const sources = (Array.isArray(face.src) ? face.src : [face.src])
        .map((item) => srcWithFormat(item, face.format))
        .join(', ');
      const lines = [
        '@font-face {',
        `  font-family: ${JSON.stringify(face.fontFamily)};`,
        `  src: ${sources};`,
      ];
      if (face.fontWeight !== undefined) {
        lines.push(`  font-weight: ${face.fontWeight};`);
      }
      if (face.fontStyle) {
        lines.push(`  font-style: ${face.fontStyle};`);
      }
      if (face.fontDisplay) {
        lines.push(`  font-display: ${face.fontDisplay};`);
      }
      lines.push('}');
      return lines.join('\n');
    })
    .join('\n\n');
};
