import type {
  AppBarLeadingSlot,
  ButtonSlot,
  CardSlot,
  StyleOverride,
} from '@razorpay/blade-core/styles';

export const CHECKOUT_STYLE_COMPONENTS = ['Button', 'AppBarLeading', 'Card'] as const;

export type CheckoutStyleComponent = (typeof CHECKOUT_STYLE_COMPONENTS)[number];

export const CHECKOUT_SLOT_CATALOG: Record<
  CheckoutStyleComponent,
  { slotType: string; slots: readonly string[] }
> = {
  Button: { slotType: 'ButtonSlot', slots: ['root', 'icon', 'text'] satisfies readonly ButtonSlot[] },
  AppBarLeading: {
    slotType: 'AppBarLeadingSlot',
    slots: ['title'] satisfies readonly AppBarLeadingSlot[],
  },
  Card: { slotType: 'CardSlot', slots: ['root'] satisfies readonly CardSlot[] },
};

export const CHECKOUT_DEFAULT_SLOT_CLASSES: Record<
  CheckoutStyleComponent,
  Record<string, string>
> = {
  Button: {
    root: 'bg-(--brand-bg)',
    text: 'text-(--brand-text)',
    icon: 'text-(--brand-color)',
  },
  AppBarLeading: { title: 'text-(--demo-text)' },
  Card: { root: 'card-brand-border' },
};

export const CHECKOUT_INITIAL_CSS_VAR_VALUES: Record<string, string> = {
  '--brand-bg': '#171717',
  '--brand-text': '#FFFFFF',
  '--brand-color': '#FFFFFF',
  '--demo-text': '#FFFFFF',
  '--demo-card-border': '#e2e8f0',
};

const SLOT_CLASS_TO_CSS_VARS: Record<string, readonly string[]> = {
  'card-brand-border': ['--demo-card-border'],
};

const LENGTH_CSS_VARS = new Set<string>();

const UTILITY_PROPERTY_BY_PREFIX: Record<string, string> = {
  bg: 'background-color',
  text: 'color',
};

const STATIC_UTILITY_CLASS_TOKENS = new Set(['bg-(--brand-bg)']);

const CSS_VAR_IN_UTILITY = /\(--([\w-]+)\)/g;
const UTILITY_CLASS_PATTERN = /^([a-z]+)-\(--([\w-]+)\)$/;

type ParsedUtilityClass = {
  classToken: string;
  cssVar: string;
  property: string;
};

function parseUtilityClassToken(token: string): ParsedUtilityClass | null {
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
}

function escapeUtilityClassSelector(classToken: string): string {
  return classToken.replace(/([()])/g, '\\$1');
}

export function collectCssVarsFromClassNames(classNames: string): string[] {
  const used = new Set<string>();
  const order: string[] = [];
  const trimmed = classNames.trim();
  if (!trimmed) {
    return [];
  }

  const registerVar = (varName: string): void => {
    if (!used.has(varName)) {
      used.add(varName);
      order.push(varName);
    }
  };

  for (const token of trimmed.split(/\s+/)) {
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

    const mappedVars = SLOT_CLASS_TO_CSS_VARS[token];
    if (mappedVars) {
      for (const varName of mappedVars) {
        registerVar(varName);
      }
    }
  }

  return order;
}

function collectUtilityClassesFromClassNames(classNames: string): ParsedUtilityClass[] {
  const seen = new Set<string>();
  const utilities: ParsedUtilityClass[] = [];
  const trimmed = classNames.trim();
  if (!trimmed) {
    return [];
  }

  for (const token of trimmed.split(/\s+/)) {
    const parsed = parseUtilityClassToken(token);
    if (!parsed || seen.has(parsed.classToken) || STATIC_UTILITY_CLASS_TOKENS.has(parsed.classToken)) {
      continue;
    }
    seen.add(parsed.classToken);
    utilities.push(parsed);
  }

  return utilities;
}

export function createInitialCheckoutSlotClasses(): Record<
  CheckoutStyleComponent,
  Record<string, string>
> {
  return Object.fromEntries(
    CHECKOUT_STYLE_COMPONENTS.map((name) => [name, { ...CHECKOUT_DEFAULT_SLOT_CLASSES[name] }]),
  ) as Record<CheckoutStyleComponent, Record<string, string>>;
}

export function resolveStyleOverride(
  slotClasses: Record<string, string>,
): StyleOverride<string> {
  const entries = Object.entries(slotClasses).filter(([, className]) => className.trim());
  return Object.fromEntries(entries);
}

export function buildPreviewVarsStyle(
  cssVarValues: Record<string, string>,
  activeCssVars: string[],
): string {
  return activeCssVars
    .map((varName) => `${varName}: ${cssVarValues[varName] ?? CHECKOUT_INITIAL_CSS_VAR_VALUES[varName] ?? '#888888'}`)
    .join('; ');
}

export function buildDynamicUtilityCss(
  slotClassesByComponent: Record<CheckoutStyleComponent, Record<string, string>>,
  cssVarValues: Record<string, string>,
): string {
  const seen = new Set<string>();
  const rules: string[] = [];

  for (const component of CHECKOUT_STYLE_COMPONENTS) {
    for (const slot of CHECKOUT_SLOT_CATALOG[component].slots) {
      const classNames = (slotClassesByComponent[component][slot] ?? '').trim();
      if (!classNames) {
        continue;
      }

      for (const utility of collectUtilityClassesFromClassNames(classNames)) {
        if (seen.has(utility.classToken)) {
          continue;
        }
        seen.add(utility.classToken);
        const selector = `.${escapeUtilityClassSelector(utility.classToken)}`;
        rules.push(`${selector} { ${utility.property}: var(${utility.cssVar}); }`);
      }

      for (const token of classNames.split(/\s+/)) {
        const mappedVars = SLOT_CLASS_TO_CSS_VARS[token];
        if (!mappedVars?.length || seen.has(`mapped:${token}`)) {
          continue;
        }
        seen.add(`mapped:${token}`);
        const declarations = mappedVars
          .map(
            (varName) =>
              `${varName}: ${cssVarValues[varName] ?? CHECKOUT_INITIAL_CSS_VAR_VALUES[varName] ?? '#888888'}`,
          )
          .join('; ');
        rules.push(`.${token} { ${declarations}; }`);
      }
    }
  }

  return rules.join('\n');
}

export function collectActiveCssVars(
  slotClassesByComponent: Record<CheckoutStyleComponent, Record<string, string>>,
  selectedComponent: CheckoutStyleComponent,
): string[] {
  const used = new Set<string>();
  const order: string[] = [];

  for (const slot of CHECKOUT_SLOT_CATALOG[selectedComponent].slots) {
    for (const varName of collectCssVarsFromClassNames(
      slotClassesByComponent[selectedComponent][slot] ?? '',
    )) {
      if (!used.has(varName)) {
        used.add(varName);
        order.push(varName);
      }
    }
  }

  return order;
}

export function isCheckoutStyleComponent(value: string): value is CheckoutStyleComponent {
  return (CHECKOUT_STYLE_COMPONENTS as readonly string[]).includes(value);
}

export function defaultCssVarValue(varName: string): string {
  return CHECKOUT_INITIAL_CSS_VAR_VALUES[varName] ?? '#888888';
}

export { LENGTH_CSS_VARS };
