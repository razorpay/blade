/**
 * Builds a `style` attribute value that contains ONLY CSS custom properties.
 *
 * Blade Svelte convention: the `style` attribute must never carry raw CSS
 * declarations (`width: 12px`). Instead, components expose component-scoped
 * custom properties on the host element and consume them from the component's
 * CSS (e.g. `.modal-container { width: var(--modal-width) }`). This keeps the
 * style attribute cachable, override-friendly, and free of specificity fights
 * with class-based styling.
 *
 * ## Usage
 *
 * ```svelte
 * <script lang="ts">
 *   // <Modal width="12px" />
 *   const { modalStyles } = getStyledProps('modal', { width });
 * </script>
 *
 * <div class="modal-container" style={modalStyles}>...</div>
 * ```
 *
 * - Prop keys are converted to kebab-case and prefixed with the component name:
 *   `{ maxWidth: '12px' }` → `--modal-max-width: 12px`.
 * - `undefined` / `null` / `''` values are skipped.
 * - The `margin` shorthand is expanded into its four longhands so CSS can
 *   consume each side independently (`--modal-margin-top`, …) without a
 *   shorthand/longhand `var()` conflict.
 * - Returns `undefined` for the style string when nothing is set, so Svelte
 *   omits the `style` attribute entirely.
 */

/** Values accepted for each style prop. */
export type StylePropValue = string | number | undefined | null;

/** Input shape: style prop name → value. */
export type StylePropsInput = Record<string, StylePropValue>;

const toKebabCase = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Expands a CSS `margin` shorthand value (`1-4` space-separated lengths) into
 * its four longhand props, mirroring the CSS shorthand rules:
 * `4px 8px` → top/bottom `4px`, left/right `8px`.
 */
const expandMarginShorthand = (value: string): StylePropsInput => {
  const parts = value.trim().split(/\s+/);
  if (parts.length === 0 || parts.length > 4) {
    return {};
  }
  const [top, right = top, bottom = top, left = right] = parts;
  return {
    marginTop: top,
    marginRight: right,
    marginBottom: bottom,
    marginLeft: left,
  };
};

/**
 * Converts style props into a `style` attribute string of CSS custom
 * properties scoped by the component name.
 *
 * @param componentName Component name used as the CSS variable prefix
 *   (`'modal'` → `--modal-*`) and as the returned key (`modalStyles`).
 * @param props Style props; see the module docs for value handling.
 * @returns `{ [`${componentName}Styles`]: string | undefined }` where the
 *   value is a `--component-prop: value; …` string, or `undefined` when no
 *   props are set.
 */
export const getStyledProps = <ComponentName extends string>(
  componentName: ComponentName,
  props: StylePropsInput,
): Record<`${ComponentName}Styles`, string | undefined> => {
  const prefix = `--${toKebabCase(componentName)}-`;
  const declarations: string[] = [];

  const pushProp = (prop: string, value: StylePropValue): void => {
    if (value === undefined || value === null || value === '') return;
    declarations.push(`${prefix}${toKebabCase(prop)}: ${value}`);
  };

  for (const [prop, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === '') continue;

    if (prop === 'margin') {
      // Expand the shorthand so consuming CSS only needs longhand `var()`s.
      for (const [marginProp, marginValue] of Object.entries(
        expandMarginShorthand(String(value)),
      )) {
        pushProp(marginProp, marginValue);
      }
      continue;
    }

    pushProp(prop, value);
  }

  return {
    [`${componentName}Styles`]: declarations.length > 0 ? declarations.join('; ') : undefined,
  } as Record<`${ComponentName}Styles`, string | undefined>;
};
