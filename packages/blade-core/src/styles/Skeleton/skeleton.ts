import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './skeleton.module.css';

export const skeletonStyles = cva(styles.skeleton);

/**
 * Generate the skeleton class string.
 */
export function getSkeletonClasses(props?: { className?: string }): string {
  const classes = [skeletonStyles(), props?.className].filter(Boolean).join(' ');
  return classes;
}

/**
 * Return skeleton template classes to prevent Svelte tree-shaking
 * from removing class imports that are only used in templates.
 */
export function getSkeletonTemplateClasses(): Record<string, string> {
  return {
    skeleton: styles.skeleton,
  } as const;
}
