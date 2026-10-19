export interface ClassIndex {
  utilities: Record<string, string>;
  arbitrary: Record<string, string>;
  spacing: Record<string, number>;
  colorPrefixes: string[];
  colorCategories: string[];
  bladeCss: string[];
}
export function loadIndex(): ClassIndex;
export function splitClass(
  token: string,
): { variants: string; utility: string; important: boolean };
export function keysOf(utility: string, index?: ClassIndex): string[] | undefined;
export function conflictsIn(
  tokens: Iterable<string>,
  index?: ClassIndex,
): Array<{ first: string; second: string; property: string }>;
export function isBladeShaped(utility: string, index?: ClassIndex): boolean;
export function isKnown(utility: string, index?: ClassIndex): boolean;
export function tokenFor(utility: string, index?: ClassIndex): string | undefined;
export const COMPONENT_KEYS: Record<string, string[]>;
export function restyles(
  token: string,
  component: string,
  allow?: string[],
  index?: ClassIndex,
): string[];
