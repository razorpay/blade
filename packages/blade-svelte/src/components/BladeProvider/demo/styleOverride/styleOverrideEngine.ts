import { BLADE_SLOT_METADATA, SLOT_METADATA_COMPONENT_NAMES } from '@razorpay/blade-core/styles';
import type { ComponentSlotMeta, StyleOverride } from '@razorpay/blade-core/styles';
import type { BladeComponentName } from '../../types';

/**
 * Shared engine behind every `styleOverride` demo surface — the checkout studio Widgets tab and
 * the standalone slot playground. Surfaces differ only in which components they expose and how
 * they frame them; the slot catalog, class parsing, generated CSS and copy-ready snippets all
 * come from here.
 *
 * The slot catalog is `BLADE_SLOT_METADATA` from blade-core, so it cannot drift from the slot
 * unions. Everything else in this module is demo scaffolding: the `--demo-*` / `--brand-*`
 * variables and the named helper classes below are not part of the `styleOverride` API, they are
 * just what these playgrounds happen to type into the slots.
 */

/**
 * The demo union is the provider registry's union. Typing the ordered list as it, and indexing
 * blade-core metadata by it, breaks the build the moment the two lists drift apart.
 */
export type StyleOverrideComponent = BladeComponentName;

/** Slot name → classname string for one component. */
export type SlotClassMap = Record<string, string>;

export type SlotClassesByComponent = Partial<Record<StyleOverrideComponent, SlotClassMap>>;

export const STYLE_OVERRIDE_COMPONENTS: readonly StyleOverrideComponent[] = SLOT_METADATA_COMPONENT_NAMES;

export const getSlotMeta = (component: StyleOverrideComponent): ComponentSlotMeta =>
  BLADE_SLOT_METADATA[component];

export const isStyleOverrideComponent = (value: string): value is StyleOverrideComponent =>
  value in BLADE_SLOT_METADATA;

// ---------------------------------------------------------------------------
// Demo classes
// ---------------------------------------------------------------------------

/**
 * Classes that ship their own CSS, keyed by the classname a consumer types into a slot. Slots
 * are seeded with `property-(--var)` utilities (see {@link UTILITY_PROPERTY_BY_PREFIX}) whose CSS
 * is generated; the entries here are the exceptions that can't be a single property utility.
 * Kept as a map (not one CSS blob) so the CSS snippet can emit only the rules in play.
 *
 * `bg-(--brand-bg)` and `card-brand-border` repoint Blade interactive tokens rather than
 * painting a property, which is what keeps hover / disabled states working — see the safety
 * rules on `StyleOverride` in blade-core. `cta-*` are fixed-value looks; `bg-transparent` lets a
 * surface behind the slot show through.
 */
const STATIC_CLASS_RULES: Record<string, string> = {
  'bg-(--brand-bg)': `.bg-\\(--brand-bg\\) {
  --interactive-background-primary-default: var(--brand-bg);
  --interactive-background-primary-highlighted: color-mix(in srgb, var(--brand-bg) 80%, black);
  --interactive-background-primary-disabled: color-mix(in srgb, var(--brand-bg) 18%, transparent);
  --interactive-border-primary-default: var(--brand-bg);
  --interactive-border-primary-highlighted: color-mix(in srgb, var(--brand-bg) 80%, black);
  background-image: none;
}`,
  'card-brand-border': `.card-brand-border {
  --interactive-border-gray-disabled: var(--demo-card-border);
}`,
  'cta-pill': `.cta-pill {
  border-radius: 999px;
}`,
  'cta-square': `.cta-square {
  border-radius: 4px;
}`,
  'cta-disabled-fade': `.cta-disabled-fade[disabled] {
  opacity: 0.5;
}`,
  'bg-transparent': `.bg-transparent {
  background-color: transparent;
}`,
};

/** Named classes read these demo variables, so a surface can offer a control for them. */
const CLASS_CSS_VARS: Record<string, readonly string[]> = {
  'card-brand-border': ['--demo-card-border'],
};

/** Every named demo rule, for the live stylesheet a surface mounts once. */
export const STATIC_SLOT_CLASS_CSS = Object.values(STATIC_CLASS_RULES).join('\n\n');

/**
 * Explicit "edit as a length" overrides for {@link isLengthCssVar}, for vars no length utility
 * drives and whose name the heuristic misses. The seeded radius vars are already covered by their
 * `rounded-(--var)` utilities; keep this for hand-typed vars that need forcing.
 */
export const LENGTH_CSS_VARS = new Set([
  '--demo-avatar-radius',
  '--icon-btn-radius',
  '--card-radius',
]);

export const DEMO_CSS_VAR_DEFAULTS: Record<string, string> = {
  '--brand-bg': '#171717',
  '--brand-text': '#FFFFFF',
  '--brand-icon': '#FFFFFF',
  '--footer-amount-value': '#1a1a1a',
  '--footer-amount-currency': '#888888',
  '--demo-text': '#1a1a1a',
  '--demo-accent': '#6c5ce7',
  '--demo-surface': '#f3efff',
  '--demo-accordion-root-bg': '#f3efff',
  '--demo-accordion-item-bg': '#f8f5ff',
  '--demo-accordion-header-bg': '#efe9ff',
  '--demo-accordion-title': '#6c5ce7',
  '--demo-accordion-subtitle': '#888888',
  '--demo-accordion-body': '#1a1a1a',
  '--demo-accordion-body-bg': '#f3efff',
  '--demo-card-border': '#94a3b8',
  '--card-radius': '8px',
  '--demo-avatar-radius': '6px',
  '--icon-btn-radius': '6px',
  '--icon-btn-icon-color': '#6c5ce7',
};

export const getCssVarValue = (cssVarValues: Record<string, string>, varName: string): string =>
  cssVarValues[varName] ?? DEMO_CSS_VAR_DEFAULTS[varName] ?? '#888888';

// ---------------------------------------------------------------------------
// Class parsing
// ---------------------------------------------------------------------------

const UTILITY_PROPERTY_BY_PREFIX: Record<string, string> = {
  bg: 'background-color',
  text: 'color',
  rounded: 'border-radius',
};

const UTILITY_CLASS_PATTERN = /^([a-z]+)-\(--([\w-]+)\)$/;
const CSS_VAR_IN_UTILITY = /\(--([\w-]+)\)/g;

type ParsedUtilityClass = {
  classToken: string;
  cssVar: string;
  property: string;
};

const parseUtilityClassToken = (token: string): ParsedUtilityClass | null => {
  const match = UTILITY_CLASS_PATTERN.exec(token);
  if (!match) {
    return null;
  }
  const [, prefix, varStem] = match;
  const property = UTILITY_PROPERTY_BY_PREFIX[prefix];
  if (!property) {
    return null;
  }
  return { classToken: token, cssVar: `--${varStem}`, property };
};

const escapeUtilityClassSelector = (classToken: string): string =>
  classToken.replace(/([()])/g, '\\$1');

const splitClassNames = (classNames: string): string[] => {
  const trimmed = classNames.trim();
  return trimmed ? trimmed.split(/\s+/) : [];
};

/** Utility properties whose value is a length, so their variable is edited as px, not a color. */
const LENGTH_UTILITY_PROPERTIES = new Set(['border-radius']);

/**
 * Last-resort guess for a variable no length utility drives (e.g. one only a named static class
 * reads). Deliberately narrow — `border` is excluded so color vars like `--demo-card-border`
 * stay colors, while `--*-radius`, `--*-width` and friends read as lengths.
 */
const LENGTH_CSS_VAR_NAME_PATTERN = /(?:radius|width|height|size|gap|spacing|padding|margin|offset|inset|thickness)/;

/** Which utility in `classNames`, if any, drives `varName`, and whether that property is a length. */
const utilityLengthKindForVar = (
  varName: string,
  classNames: string,
): 'length' | 'color' | null => {
  for (const token of splitClassNames(classNames)) {
    const utility = parseUtilityClassToken(token);
    if (utility && utility.cssVar === varName) {
      return LENGTH_UTILITY_PROPERTIES.has(utility.property) ? 'length' : 'color';
    }
  }
  return null;
};

/**
 * Whether a demo variable should be edited as a length (px input) rather than a color (picker).
 *
 * The utility driving it wins: `rounded-(--x)` is a `border-radius`, so `--x` is a length even if
 * its name gives nothing away — and `bg-(--x)` stays a color even if the name looks length-y. Only
 * when no utility drives the var do the explicit {@link LENGTH_CSS_VARS} and the name heuristic
 * decide. `classNames` is the slot class string(s) the var appears in.
 */
export const isLengthCssVar = (varName: string, classNames = ''): boolean => {
  const byUsage = utilityLengthKindForVar(varName, classNames);
  if (byUsage) {
    return byUsage === 'length';
  }
  return LENGTH_CSS_VARS.has(varName) || LENGTH_CSS_VAR_NAME_PATTERN.test(varName);
};

/** Ordered, de-duplicated list of demo variables a slot's classnames depend on. */
export const collectCssVarsFromClassNames = (classNames: string): string[] => {
  const used = new Set<string>();
  const order: string[] = [];

  const registerVar = (varName: string): void => {
    if (!used.has(varName)) {
      used.add(varName);
      order.push(varName);
    }
  };

  for (const token of splitClassNames(classNames)) {
    const parsedUtility = parseUtilityClassToken(token);
    if (parsedUtility) {
      registerVar(parsedUtility.cssVar);
    } else {
      CSS_VAR_IN_UTILITY.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = CSS_VAR_IN_UTILITY.exec(token)) !== null) {
        registerVar(`--${match[1]}`);
      }
    }

    for (const varName of CLASS_CSS_VARS[token] ?? []) {
      registerVar(varName);
    }
  }

  return order;
};

const forEachSlotClassNames = (
  slotClassesByComponent: SlotClassesByComponent,
  components: readonly StyleOverrideComponent[],
  visit: (classNames: string) => void,
): void => {
  for (const component of components) {
    const slotClasses = slotClassesByComponent[component] ?? {};
    for (const slot of getSlotMeta(component).slots) {
      const classNames = (slotClasses[slot.name] ?? '').trim();
      if (classNames) {
        visit(classNames);
      }
    }
  }
};

export const collectCssVarsForComponents = (
  slotClassesByComponent: SlotClassesByComponent,
  components: readonly StyleOverrideComponent[],
): string[] => {
  const used = new Set<string>();
  const order: string[] = [];

  forEachSlotClassNames(slotClassesByComponent, components, (classNames) => {
    for (const varName of collectCssVarsFromClassNames(classNames)) {
      if (!used.has(varName)) {
        used.add(varName);
        order.push(varName);
      }
    }
  });

  return order;
};

// ---------------------------------------------------------------------------
// Generated CSS
// ---------------------------------------------------------------------------

type GeneratedCss = {
  /** `.text-(--demo-text) { color: var(--demo-text) }` style rules for typed utilities. */
  utilityRules: string[];
  /** Demo variable values pinned onto the elements that use a named class. */
  mappedRules: string[];
  /** Named class rules actually in play, for the copy-ready CSS tab. */
  staticRules: string[];
};

const generateCss = (
  slotClassesByComponent: SlotClassesByComponent,
  components: readonly StyleOverrideComponent[],
  cssVarValues: Record<string, string>,
): GeneratedCss => {
  const seenUtility = new Set<string>();
  const seenMapped = new Set<string>();
  const seenStatic = new Set<string>();
  const result: GeneratedCss = { utilityRules: [], mappedRules: [], staticRules: [] };

  forEachSlotClassNames(slotClassesByComponent, components, (classNames) => {
    for (const token of splitClassNames(classNames)) {
      const staticRule = STATIC_CLASS_RULES[token];
      if (staticRule && !seenStatic.has(token)) {
        seenStatic.add(token);
        result.staticRules.push(staticRule);
      }

      const utility = parseUtilityClassToken(token);
      // A token with its own static rule declares more than one property, so never
      // regenerate it from the `prefix-(--var)` shorthand.
      if (utility && !staticRule && !seenUtility.has(token)) {
        seenUtility.add(token);
        result.utilityRules.push(
          `.${escapeUtilityClassSelector(token)} { ${utility.property}: var(${utility.cssVar}); }`,
        );
      }

      const mappedVars = CLASS_CSS_VARS[token];
      if (mappedVars?.length && !seenMapped.has(token)) {
        seenMapped.add(token);
        const declarations = mappedVars
          .map((varName) => `${varName}: ${getCssVarValue(cssVarValues, varName)}`)
          .join('; ');
        result.mappedRules.push(`.${token} { ${declarations}; }`);
      }
    }
  });

  return result;
};

/** Stylesheet the surface mounts so typed classnames actually resolve in the preview. */
export const buildDynamicCss = (
  slotClassesByComponent: SlotClassesByComponent,
  components: readonly StyleOverrideComponent[],
  cssVarValues: Record<string, string>,
): string => {
  const { utilityRules, mappedRules } = generateCss(
    slotClassesByComponent,
    components,
    cssVarValues,
  );
  return [...utilityRules, ...mappedRules].join('\n');
};

export const buildPreviewVarsStyle = (
  cssVarValues: Record<string, string>,
  activeCssVars: readonly string[],
): string =>
  activeCssVars.map((varName) => `${varName}: ${getCssVarValue(cssVarValues, varName)}`).join('; ');

/** Idempotently writes `css` into a `<style>` element owned by `host`. */
export const mountDemoStylesheet = (
  host: HTMLElement | undefined,
  marker: string,
  css: string,
): void => {
  if (!host) {
    return;
  }
  let styleEl = host.querySelector<HTMLStyleElement>(`style[${marker}]`);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.setAttribute(marker, '');
    host.appendChild(styleEl);
  }
  styleEl.textContent = css;
};

// ---------------------------------------------------------------------------
// Snippets
// ---------------------------------------------------------------------------

/** Drops empty slots, so a snippet only ever shows what actually overrides something. */
export const resolveStyleOverride = (slotClasses: SlotClassMap = {}): StyleOverride<string> =>
  Object.fromEntries(Object.entries(slotClasses).filter(([, className]) => className.trim()));

const indentedSlotEntries = (override: StyleOverride<string>, indent: string): string =>
  Object.entries(override)
    .map(([slot, className]) => `${indent}${slot}: '${className}',`)
    .join('\n');

export const buildInstanceSnippet = (
  component: StyleOverrideComponent,
  slotClasses: SlotClassMap = {},
): string => {
  const override = resolveStyleOverride(slotClasses);
  const importLine = `import { ${component} } from '@razorpay/blade-svelte';`;

  if (Object.keys(override).length === 0) {
    return `${importLine}\n\n<${component} />`;
  }

  return `${importLine}

<${component}
  styleOverride={{
${indentedSlotEntries(override, '    ')}
  }}
/>`;
};

export const buildProviderSnippet = (
  slotClassesByComponent: SlotClassesByComponent,
  components: readonly StyleOverrideComponent[],
): string => {
  const entries = components
    .map(
      (component) => [component, resolveStyleOverride(slotClassesByComponent[component])] as const,
    )
    .filter(([, override]) => Object.keys(override).length > 0)
    .map(
      ([component, override]) => `    ${component}: {
      styleOverride: {
${indentedSlotEntries(override, '        ')}
      },
    },`,
    );

  const header = `import { BladeProvider } from '@razorpay/blade-svelte';
import { bladeTheme } from '@razorpay/blade-core/tokens';
`;

  if (entries.length === 0) {
    return `${header}
<BladeProvider themeTokens={bladeTheme}>
  {@render children()}
</BladeProvider>`;
  }

  return `${header}
<BladeProvider
  themeTokens={bladeTheme}
  componentConfig={{
${entries.join('\n')}
  }}
>
  {@render children()}
</BladeProvider>`;
};

/** The stylesheet a consumer has to add for the classnames above to resolve on their side. */
export const buildCssSnippet = (
  slotClassesByComponent: SlotClassesByComponent,
  components: readonly StyleOverrideComponent[],
  cssVarValues: Record<string, string>,
): string => {
  const { utilityRules, staticRules } = generateCss(
    slotClassesByComponent,
    components,
    cssVarValues,
  );
  const activeVars = collectCssVarsForComponents(slotClassesByComponent, components);

  const blocks: string[] = [];

  if (activeVars.length > 0) {
    const declarations = activeVars
      .map((varName) => `  ${varName}: ${getCssVarValue(cssVarValues, varName)};`)
      .join('\n');
    blocks.push(`:root {\n${declarations}\n}`);
  }

  blocks.push(...staticRules, ...utilityRules);

  return blocks.length > 0
    ? blocks.join('\n\n')
    : '/* No slot classnames set — nothing to add to your stylesheet. */';
};

export type SnippetForm = 'instance' | 'provider' | 'css';

export const buildSnippet = (
  form: SnippetForm,
  options: {
    component: StyleOverrideComponent;
    components: readonly StyleOverrideComponent[];
    slotClassesByComponent: SlotClassesByComponent;
    cssVarValues: Record<string, string>;
  },
): string => {
  const { component, components, slotClassesByComponent, cssVarValues } = options;

  if (form === 'instance') {
    return buildInstanceSnippet(component, slotClassesByComponent[component]);
  }
  if (form === 'provider') {
    return buildProviderSnippet(slotClassesByComponent, components);
  }
  return buildCssSnippet(slotClassesByComponent, components, cssVarValues);
};

// ---------------------------------------------------------------------------
// Slot class state
// ---------------------------------------------------------------------------

export const cloneSlotClasses = <Name extends StyleOverrideComponent>(
  source: Record<Name, SlotClassMap>,
  components: readonly Name[],
): Record<Name, SlotClassMap> =>
  Object.fromEntries(components.map((name) => [name, { ...source[name] }])) as Record<
    Name,
    SlotClassMap
  >;
