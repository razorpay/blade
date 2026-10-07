export type Format = 'woff2' | 'ttf';
export interface GlyphFile {
  name: string;
  code: number;
  file: string;
}
export declare const FONT_FAMILY: 'blade-icons';
export declare const ICONS: string;
export declare const ICON_SVGS: string;
export declare const SOURCE_MODULE: string;
export declare const PACKAGE_ICONS: '@razorpay/blade-svelte/icons';
export declare function formatName(format: Format): string;
export declare function createIconCore(options: { root: string; extra?: string | readonly string[] }): {
  folders: string[];
  glyphFor(file: string): GlyphFile | null;
  rewriteImports(code: string, importer: string): string | null;
  glyphModule(glyph: GlyphFile, faceImport: string): string;
  font(files: Iterable<string>, formats: readonly Format[]): Promise<Record<Format, { path: string; name: string; source: Buffer }>>;
  scanExtra(): void;
  codesFile: string;
};
export declare function faceModule(urls: string[], formats: readonly Format[], hot?: string): string;
