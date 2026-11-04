// The font tools ship no types; only what font.js calls is declared.
declare module 'svg2ttf' {
  export default function svg2ttf(
    svgFont: string,
    options?: { ts?: number; description?: string; url?: string },
  ): { buffer: Uint8Array };
}
