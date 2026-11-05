/**
 * An app's own variants, written as Tailwind's `addVariant` writes them:
 * `'[data-quick-buy="true"] &'` (a selector around the class), `'&:hover'`,
 * or `'@media print'` / `'@supports (…)'` (an at-rule around the rule).
 */
import type { Variant, VariantHandler } from 'unocss';

export function customVariants(
  variants: Record<string, string> = {},
  /** Puts the variant's utilities in the layer of `custom:<name>` (config.ts `layered`). */
  layered: (kind: string, handler: VariantHandler) => VariantHandler = (_, handler) => handler,
): Variant[] {
  return Object.entries(variants).map(
    ([name, template]): Variant => {
      const prefix = `${name}:`;
      const handle = template.trim().startsWith('@')
        ? { parent: template.trim() }
        : { selector: (selector: string) => template.replace(/&/g, selector) };
      return {
        match: (matcher) =>
          matcher.startsWith(prefix)
            ? layered(`custom:${name}`, { matcher: matcher.slice(prefix.length), ...handle })
            : undefined,
        multiPass: true,
      };
    },
  );
}
