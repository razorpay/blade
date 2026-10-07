// The font tools ship no types; only what font.js calls is declared.
declare module 'svg2ttf' {
  export default function svg2ttf(
    svgFont: string,
    options?: { ts?: number; description?: string; url?: string },
  ): { buffer: Uint8Array };
}

declare module 'wawoff2' {
  const wawoff2: {
    compress(ttf: Uint8Array): Promise<Uint8Array>;
    decompress(woff2: Uint8Array): Promise<Uint8Array>;
  };
  export default wawoff2;
}
