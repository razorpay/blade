/**
 * An app's own variants, written as Tailwind's `addVariant` writes them:
 * `'[data-quick-buy="true"] &'` (a selector around the class), `'&:hover'`,
 * or `'@media print'` / `'@supports (…)'` (an at-rule around the rule).
 */
import type { Variant } from 'unocss';

export function customVariants(variants: Record<string, string> = {}): Variant[] {
  return Object.entries(variants).map(
    ([name, template]): Variant => {
      const prefix = `${name}:`;
      const handle = template.trim().startsWith('@')
        ? { parent: template.trim() }
        : { selector: (selector: string) => template.replace(/&/g, selector) };
      return {
        match: (matcher) =>
          matcher.startsWith(prefix)
            ? { matcher: matcher.slice(prefix.length), ...handle }
            : undefined,
        multiPass: true,
      };
    },
  );
}
