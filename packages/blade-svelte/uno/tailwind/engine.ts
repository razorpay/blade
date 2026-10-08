// Tailwind's theme values are an app's untyped data (tailwind.config.js),
// read as Tailwind reads them: ported from its JavaScript.
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tailwind v3's `matchUtilities`, as UnoCSS rules: a utility is an
 * identifier (`bg`, `rounded-t`) and a function of the value its class
 * names — a theme key (`bg-primary-500`), a negative one (`-mt-2`), or a
 * bracketed value (`bg-[#fff]`, `bg-[length:200%_100%]`) whose type decides
 * which of the utilities sharing an identifier takes it. Ported from
 * src/util/pluginUtils.js and src/lib/{setupContextUtils,generateRules}.js
 * so a class means here what it meant to the app's Tailwind.
 */
import { symbols } from 'unocss';
import type { CSSObject, Rule } from 'unocss';
import { withAlphaValue } from './color';
import {
  absoluteSize,
  backgroundSize,
  color,
  familyName,
  genericName,
  image,
  length,
  lineWidth,
  negateValue,
  normalize,
  number,
  percentage,
  position,
  relativeSize,
  shadow,
  url,
} from './values';

export type ValueType =
  | 'any'
  | 'color'
  | 'url'
  | 'image'
  | 'length'
  | 'percentage'
  | 'position'
  | 'lookup'
  | 'generic-name'
  | 'family-name'
  | 'number'
  | 'line-width'
  | 'absolute-size'
  | 'relative-size'
  | 'shadow'
  | 'size';

interface TypeOption {
  type: ValueType;
  preferOnConflict?: boolean;
}

/** Tailwind's CSS-in-JS: declarations, and nested `&…` selectors. */
export interface Declarations {
  [key: string]: string | number | undefined | Declarations;
}

/** What a utility returns: declarations, or several (raw `@keyframes` CSS among them). */
export type UtilityOutput = Declarations | (Declarations | string)[] | undefined | null;

export type UtilityFunction = (value: any, extras: { modifier: string | null }) => UtilityOutput;

export interface MatchOptions {
  /** The theme scale: key → value. */
  values?: Record<string, any>;
  /** Types a bracketed value may be; `['any']` by default. */
  type?: ValueType | (ValueType | [ValueType, { preferOnConflict?: boolean }])[];
  supportsNegativeValues?: boolean;
  /** `text-sm/6`: the scale after `/`. */
  modifiers?: Record<string, any>;
}

interface Registered {
  identifier: string;
  run: UtilityFunction;
  options: MatchOptions & { types: TypeOption[] };
}

/** The opacity scale `/50` reads; set from the theme by `createEngine`. */
interface EngineContext {
  opacity: Record<string, any>;
}

const isArbitraryValue = (input: string): boolean => input.startsWith('[') && input.endsWith(']');

function isSyntacticallyValidPropertyValue(value: string): boolean {
  const matching: Record<string, string> = { '{': '}', '[': ']', '(': ')' };
  const inverse: Record<string, string> = { '}': '{', ']': '[', ')': '(' };
  const stack: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < value.length; i++) {
    const char = value[i];
    if (char === ':' && !inQuotes && stack.length === 0) return false;
    if (['"', "'", '`'].includes(char) && value[i - 1] !== '\\') inQuotes = !inQuotes;
    if (inQuotes || value[i - 1] === '\\') continue;
    if (char in matching) stack.push(char);
    else if (char in inverse) {
      if (stack.length === 0 || stack.pop() !== inverse[char]) return false;
    }
  }
  return stack.length === 0;
}

function resolveArbitraryValue(
  modifier: string,
  validate: (value: string) => boolean,
): string | undefined {
  if (!isArbitraryValue(modifier)) return undefined;
  const value = modifier.slice(1, -1);
  if (!validate(value)) return undefined;
  return normalize(value);
}

function asNegativeValue(
  modifier: string,
  lookup: Record<string, any> = {},
  validate: (value: string) => boolean,
): string | undefined {
  const positive = lookup[modifier];
  if (positive !== undefined) return negateValue(positive);
  if (isArbitraryValue(modifier)) {
    const resolved = resolveArbitraryValue(modifier, validate);
    return resolved === undefined ? undefined : negateValue(resolved);
  }
  return undefined;
}

function asValue(
  modifier: string,
  options: MatchOptions = {},
  validate: (value: string) => boolean = () => true,
): any {
  const value = options.values?.[modifier];
  if (value !== undefined) return value;
  if (options.supportsNegativeValues && modifier.startsWith('-')) {
    return asNegativeValue(modifier.slice(1), options.values, validate);
  }
  return resolveArbitraryValue(modifier, validate);
}

/** `red-500/50` → `['red-500', '50']`, a `/` inside brackets left alone. */
function splitUtilityModifier(modifier: string): [string, string | undefined] {
  let slashIdx = modifier.lastIndexOf('/');
  const arbitraryStartIdx = modifier.lastIndexOf('[', slashIdx);
  const arbitraryEndIdx = modifier.indexOf(']', slashIdx);
  const isNextToArbitrary = modifier[slashIdx - 1] === ']' || modifier[slashIdx + 1] === '[';
  if (!isNextToArbitrary && arbitraryStartIdx !== -1 && arbitraryEndIdx !== -1) {
    if (arbitraryStartIdx < slashIdx && slashIdx < arbitraryEndIdx) {
      slashIdx = modifier.lastIndexOf('/', arbitraryStartIdx);
    }
  }
  if (slashIdx === -1 || slashIdx === modifier.length - 1) return [modifier, undefined];
  if (isArbitraryValue(modifier) && !modifier.includes(']/[')) return [modifier, undefined];
  return [modifier.slice(0, slashIdx), modifier.slice(slashIdx + 1)];
}

const unwrapArbitraryModifier = (modifier: string): string => normalize(modifier.slice(1, -1));

function asColor(modifier: string, options: MatchOptions, context: EngineContext): any {
  if (options.values?.[modifier] !== undefined) return options.values[modifier];
  const [base, alpha] = splitUtilityModifier(modifier);
  if (alpha !== undefined) {
    const normalized =
      options.values?.[base] ?? (isArbitraryValue(base) ? base.slice(1, -1) : undefined);
    if (normalized === undefined) return undefined;
    if (isArbitraryValue(alpha)) {
      return withAlphaValue(normalized, unwrapArbitraryModifier(alpha));
    }
    if (context.opacity[alpha] === undefined) return undefined;
    return withAlphaValue(normalized, String(context.opacity[alpha]));
  }
  return asValue(modifier, options, color);
}

const guess = (validate: (value: string) => boolean) => (
  modifier: string,
  options: MatchOptions,
): any => asValue(modifier, options, validate);

const typeMap: Record<
  ValueType,
  (modifier: string, options: MatchOptions, context: EngineContext) => any
> = {
  any: (modifier, options) => asValue(modifier, options),
  color: asColor,
  url: guess(url),
  image: guess(image),
  length: guess(length),
  percentage: guess(percentage),
  position: guess(position),
  lookup: (modifier, options) => options.values?.[modifier],
  'generic-name': guess(genericName),
  'family-name': guess(familyName),
  number: guess(number),
  'line-width': guess(lineWidth),
  'absolute-size': guess(absoluteSize),
  'relative-size': guess(relativeSize),
  shadow: guess(shadow),
  size: guess(backgroundSize),
};

const supportedTypes = Object.keys(typeMap);

function* getMatchingTypes(
  types: TypeOption[],
  rawModifier: string,
  options: MatchOptions,
  context: EngineContext,
): Generator<[any, ValueType, string | null]> {
  let [modifier, utilityModifier] = splitUtilityModifier(rawModifier);
  const canUseUtilityModifier =
    options.modifiers != null &&
    ((utilityModifier && isArbitraryValue(utilityModifier)) ||
      (utilityModifier !== undefined && utilityModifier in options.modifiers));
  if (!canUseUtilityModifier) {
    modifier = rawModifier;
    utilityModifier = undefined;
  }
  if (utilityModifier !== undefined && modifier === '') modifier = 'DEFAULT';
  if (utilityModifier !== undefined && options.modifiers) {
    const configValue = options.modifiers[utilityModifier];
    if (configValue != null) utilityModifier = configValue;
    else if (isArbitraryValue(utilityModifier)) {
      utilityModifier = unwrapArbitraryModifier(utilityModifier);
    }
  }
  for (const { type } of types) {
    const result = typeMap[type](modifier, options, context);
    if (result === undefined) continue;
    yield [result, type, utilityModifier ?? null];
  }
}

function coerceValue(
  types: TypeOption[],
  modifier: string,
  options: MatchOptions,
  context: EngineContext,
): [any, ValueType | string, string | null] | [] {
  if (options.values && modifier in options.values) {
    for (const { type } of types) {
      const result = typeMap[type](modifier, options, context);
      if (result !== undefined) return [result, type, null];
    }
  }
  if (isArbitraryValue(modifier)) {
    const arbitraryValue = modifier.slice(1, -1);
    const index = arbitraryValue.indexOf(':');
    let explicitType = index === -1 ? undefined : arbitraryValue.slice(0, index);
    let value = index === -1 ? arbitraryValue : arbitraryValue.slice(index + 1);
    if (explicitType === undefined || !/^[\w-_]+$/g.test(explicitType)) {
      explicitType = undefined;
      value = arbitraryValue;
    } else if (!supportedTypes.includes(explicitType)) {
      return [];
    }
    if (value.length > 0 && explicitType && supportedTypes.includes(explicitType)) {
      return [asValue(`[${value}]`, options), explicitType, null];
    }
  }
  const first = getMatchingTypes(types, modifier, options, context).next();
  return first.done ? [] : first.value;
}

const normalizeTypes = (type: MatchOptions['type']): TypeOption[] =>
  ([] as NonNullable<MatchOptions['type']>[])
    .concat(type ?? 'any')
    .flat(0)
    .map((entry: any) =>
      Array.isArray(entry) ? { type: entry[0], ...entry[1] } : { type: entry as ValueType },
    );

/** `{ '&::placeholder': {…} }`: the inner rules, on `&` filled with the class. */
function nestUnder(template: string, declarations: Declarations): (CSSObject | string)[] {
  return toUno(declarations).map((inner) =>
    typeof inner === 'string'
      ? inner
      : ({
          ...inner,
          [symbols.selector]: (selector: string) => template.replace(/&/g, selector),
        } as CSSObject),
  );
}

/** Tailwind's nested selectors (`&::placeholder`, `& > :not([hidden]) ~ …`) as Uno's. */
function toUno(output: Declarations | string): (CSSObject | string)[] {
  if (typeof output === 'string') return [output];
  const own: CSSObject = {};
  const nested: (CSSObject | string)[] = [];
  for (const [key, value] of Object.entries(output)) {
    if (key.startsWith('@defaults')) continue;
    if (value === undefined) continue;
    if (typeof value === 'object') {
      if (key.includes('&')) nested.push(...nestUnder(key, value));
      continue;
    }
    own[key] = String(value);
  }
  return Object.keys(own).length > 0 ? [own, ...nested] : nested;
}

/**
 * Builds the rules, keeping Tailwind's choice among utilities that share an
 * identifier: a theme key is the scale's that has it; a bracketed value goes
 * to the one utility its type fits (`text-[14px]` the size, `text-[#fff]` the
 * colour), else none.
 */
export function createEngine(
  context: EngineContext,
): {
  matchUtilities: (utilities: Record<string, UtilityFunction>, options?: MatchOptions) => Rule[];
} {
  const byIdentifier = new Map<string, Registered[]>();

  /** The CSS one utility makes for `modifier`, or undefined. */
  function generate(entry: Registered, modifier: string): (CSSObject | string)[] | undefined {
    const plugins = byIdentifier.get(entry.identifier) ?? [];
    const { options } = entry;
    const [value, coercedType, utilityModifier] = coerceValue(
      options.types,
      modifier,
      options,
      context,
    );
    if (value === undefined) return undefined;
    if (!options.types.some(({ type }) => type === coercedType) && plugins.length > 1) {
      return undefined;
    }
    if (typeof value === 'string' && !isSyntacticallyValidPropertyValue(value)) return undefined;
    const outputs = ([] as (Declarations | string)[])
      .concat(entry.run(value, { modifier: utilityModifier ?? null }) ?? [])
      .filter(Boolean);
    if (outputs.length === 0) return undefined;
    return outputs.flatMap(toUno);
  }

  /** For a bracketed value several utilities read: the one Tailwind would pick. */
  function arbitraryOwner(identifier: string, modifier: string): Registered | undefined {
    const plugins = byIdentifier.get(identifier) ?? [];
    const matching = plugins.filter((entry) => generate(entry, modifier) !== undefined);
    if (matching.length <= 1) return matching[0];
    const typesOf = (entry: Registered): ValueType[] =>
      Array.from(getMatchingTypes(entry.options.types, modifier, entry.options, context)).map(
        ([, type]) => type,
      );
    const withAny = matching.filter((entry) => entry.options.types.some((t) => t.type === 'any'));
    const withoutAny = matching.filter((entry) => !withAny.includes(entry));
    const findFallback = (group: Registered[]): Registered | undefined => {
      if (group.length === 1) return group[0];
      return group.find((entry) => {
        const types = typesOf(entry);
        return entry.options.types.some(
          ({ type, preferOnConflict }) => types.includes(type) && preferOnConflict,
        );
      });
    };
    return findFallback(withoutAny) ?? findFallback(withAny);
  }

  /**
   * One Uno rule per call, as Tailwind gives one call one place in the
   * stylesheet: `rounded-t-none rounded-r-none` sort by name within it, as
   * Tailwind sorts them (Uno breaks ties by selector).
   */
  function matchUtilities(
    utilities: Record<string, UtilityFunction>,
    options: MatchOptions = {},
  ): Rule[] {
    const normalized = { ...options, types: normalizeTypes(options.type) };
    const entries = new Map<string, Registered>();
    for (const [identifier, run] of Object.entries(utilities)) {
      const entry: Registered = { identifier, run, options: normalized };
      if (!byIdentifier.has(identifier)) byIdentifier.set(identifier, []);
      byIdentifier.get(identifier)?.push(entry);
      entries.set(identifier, entry);
    }
    const alternatives = [...entries.keys()]
      .sort((a, b) => b.length - a.length)
      .map((identifier) => identifier.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'))
      .join('|');
    return [
      [
        new RegExp(`^(-)?(${alternatives})(?:-(.+))?$`),
        ([, negative, identifier, rest]) => {
          const entry = entries.get(identifier)!;
          let modifier = rest ?? 'DEFAULT';
          if (negative) modifier = `-${modifier}`;
          if (isArbitraryValue(modifier) && arbitraryOwner(identifier, modifier) !== entry) {
            return undefined;
          }
          return generate(entry, modifier) as any;
        },
      ],
    ];
  }

  return { matchUtilities };
}

/**
 * Tailwind's `addUtilities`: fixed classes. Its nested `&…` selectors become
 * Uno's; `@defaults` are the base layer's.
 */
export function addUtilities(utilities: Record<string, Declarations>): Rule[] {
  return Object.entries(utilities).map(
    ([selector, declarations]): Rule => {
      // `.space-y-reverse > :not([hidden]) ~ :not([hidden])` → the class and the rest
      const match = /^\.([\w-]+)(.*)$/.exec(selector);
      if (!match) throw new Error(`Not a class selector: ${selector}`);
      const [, name, rest] = match;
      const body = rest ? { [`&${rest}`]: declarations } : declarations;
      return [name, toUno(body) as any];
    },
  );
}
