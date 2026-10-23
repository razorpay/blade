export interface Lockfile {
  glyphs: Record<string, number>;
  retired: Record<string, number>;
}

export declare function toKebab(component: string): string;
export declare function jsxToSvg(source: string, component: string): string;
export declare function updateLockfile(previous: Lockfile, names: string[]): Lockfile;
export declare function iconsDoc(doc: string, components: string[]): string;
export declare function isStroked(source: string): boolean;
export declare function extractBladeIcons(options?: { check?: boolean }): {
  /** Files that differed, from packages/blade-svelte (and, unless `check`, were rewritten). */
  outdated: string[];
  /** Stroke-drawn icons left out: a font cannot draw them. */
  stroked: string[];
  glyphs: number;
};
