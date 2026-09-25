// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './dotLoader.module.css';

/**
 * CSS custom property that drives the dot color. Consumers set this to a resolved
 * token CSS variable; it falls back to `currentColor`.
 */
export const DOT_LOADER_COLOR_CSS_VAR = '--dot-loader-color';

export const dotLoaderClass: string = styles['dot-loader'];
export const dotLoaderLargeClass: string = styles['dot-loader-large'];

/**
 * Size of the loader. `large` is the same loader scaled 1.5x, for hosts tall
 * enough that the default reads as undersized (the 48px large Button).
 */
export type DotLoaderSize = 'medium' | 'large';

/**
 * Get DotLoader template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 */
export function getDotLoaderTemplateClasses(): Record<string, string> {
  return {
    dotLoader: dotLoaderClass,
    dotLoaderLarge: dotLoaderLargeClass,
  } as const;
}

export function getDotLoaderClasses({
  size = 'medium',
  className,
}: { size?: DotLoaderSize; className?: string } = {}): string {
  return [dotLoaderClass, size === 'large' ? dotLoaderLargeClass : '', className]
    .filter(Boolean)
    .join(' ');
}
