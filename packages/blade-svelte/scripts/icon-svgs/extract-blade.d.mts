export interface Lockfile {
  glyphs: Record<string, number>;
  retired: Record<string, number>;
}

export declare function toKebab(component: string): string;
export declare function jsxToSvg(source: string, component: string): string;
export declare function updateLockfile(previous: Lockfile, names: string[]): Lockfile;
