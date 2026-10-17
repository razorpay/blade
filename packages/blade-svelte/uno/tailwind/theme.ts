// Tailwind's theme values are an app's untyped data (tailwind.config.js),
// read as Tailwind reads them: ported from its JavaScript.
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * An app's theme, in tailwind.config.js's shape, resolved as Tailwind v3
 * resolves it (src/util/resolveConfig.js): each key is the app's if it sets
 * it, else a preset's, else Tailwind's default; `extend` merges into the key
 * (objects deeply, arrays replaced); a key may be a function of `theme()`.
 */
import { parseColor, withAlphaValue } from './color';

/** A theme value: a string, a number, a nested scale, or a font-size tuple. */
export type ThemeValue =
  | string
  | number
  | readonly ThemeValue[]
  | { readonly [key: string]: ThemeValue };

export type ThemeScale = Record<string, ThemeValue>;

/** `theme('spacing')`, `theme('colors.primary.500', fallback)`, `theme('colors.cta / 50%')` */
export type ThemeLookup = (path: string, fallback?: ThemeValue) => any;

export interface ThemeHelpers {
  theme: ThemeLookup;
}

/** A key's value, or a function of the rest of the theme. */
export type ThemeEntry = ThemeValue | ((helpers: ThemeHelpers) => any);

/** A tailwind.config.js `theme`: keys replace Tailwind's, `extend` adds to them. */
export interface ThemeConfig {
  [key: string]: ThemeEntry | Record<string, ThemeEntry> | undefined;
  extend?: Record<string, ThemeEntry>;
}

/** A resolved theme: plain data, every function called. */
export type ResolvedTheme = Record<string, any>;

const isPlainObject = (value: unknown): value is Record<string, any> => {
  if (Object.prototype.toString.call(value) !== '[object Object]') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || Object.getPrototypeOf(prototype) === null;
};

const isFunction = (value: unknown): value is (...args: any[]) => any =>
  typeof value === 'function';

type Customizer = (merged: any, value: any) => any;

function mergeWith(target: any, ...rest: any[]): any {
  const customizer = rest.pop() as Customizer;
  for (const source of rest) {
    for (const key of Object.keys(source ?? {})) {
      const merged = customizer(target[key], source[key]);
      if (merged !== undefined) target[key] = merged;
      else if (isPlainObject(target[key]) && isPlainObject(source[key])) {
        target[key] = mergeWith({}, target[key], source[key], customizer);
      } else target[key] = source[key];
    }
  }
  return target;
}

const cloneDeep = (value: any): any => {
  if (Array.isArray(value)) return value.map(cloneDeep);
  if (isPlainObject(value)) {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, cloneDeep(entry)]));
  }
  return value;
};

/** All the `extend`s, per key, as a list: earlier configs last, so the app's applies last. */
function collectExtends(themes: ThemeConfig[]): Record<string, any[]> {
  return themes.reduce<Record<string, any[]>>(
    (merged, { extend }) =>
      mergeWith(merged, extend ?? {}, (mergedValue: any, extendValue: any) => {
        if (mergedValue === undefined) return [extendValue];
        if (Array.isArray(mergedValue)) return [extendValue, ...mergedValue];
        return [extendValue, mergedValue];
      }),
    {},
  );
}

function mergeExtensionCustomizer(merged: any, value: any): any {
  if (Array.isArray(merged) && isPlainObject(merged[0])) return merged.concat(value);
  if (Array.isArray(value) && isPlainObject(value[0]) && isPlainObject(merged)) {
    return [merged, ...value];
  }
  if (Array.isArray(value)) return value;
  return undefined;
}

function mergeExtensions({ extend, ...theme }: Record<string, any>): Record<string, any> {
  return mergeWith(theme, extend, (themeValue: any, extensions: any[]) => {
    if (!isFunction(themeValue) && !extensions.some(isFunction)) {
      return mergeWith({}, themeValue, ...extensions, mergeExtensionCustomizer);
    }
    return (helpers: ThemeHelpers) =>
      mergeWith(
        {},
        ...[themeValue, ...extensions].map((entry) => (isFunction(entry) ? entry(helpers) : entry)),
        mergeExtensionCustomizer,
      );
  });
}

/** `a.b[c.d].e` → `['a', 'b', 'c.d', 'e']` */
const toPath = (path: string): string[] => path.split(/\.(?![^[]*\])|[[\]]/g).filter(Boolean);

/** The path, and the path before a `/ <alpha>` if there is one. */
function* toPaths(key: string): Generator<string[] & { alpha?: string }> {
  const path = toPath(key);
  if (path.length === 0) return;
  yield path;
  const match = /^(.*?)\s*\/\s*([^/]+)$/.exec(key);
  if (match) {
    const withAlpha: string[] & { alpha?: string } = toPath(match[1]);
    withAlpha.alpha = match[2];
    yield withAlpha;
  }
}

/** `hsl(var(--x) / <alpha-value>)` at an opacity; any other colour as is. */
export const colorAt = (color: string, alpha: string | number): string =>
  color.includes('<alpha-value>') ? color.replace('<alpha-value>', String(alpha)) : color;

function resolveFunctionKeys(object: Record<string, any>): ResolvedTheme {
  // A key's function reads the theme through `helpers.theme`, set below.
  const helpers = {} as ThemeHelpers;
  const resolvePath: ThemeLookup = (key, fallback) => {
    for (const path of toPaths(key)) {
      let index = 0;
      let value: any = object;
      while (value !== undefined && value !== null && index < path.length) {
        value = value[path[index++]];
        const callIt = isFunction(value) && (path.alpha === undefined || index <= path.length - 1);
        value = callIt ? value(helpers) : value;
      }
      if (value === undefined) continue;
      if (path.alpha !== undefined) {
        const color = String(value);
        if (color.includes('<alpha-value>')) return colorAt(color, path.alpha);
        const parsed = parseColor(color, { loose: true });
        return parsed ? withAlphaValue(color, path.alpha, color) : color;
      }
      return isPlainObject(value) ? cloneDeep(value) : value;
    }
    return fallback;
  };
  helpers.theme = resolvePath;
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, isFunction(value) ? value(helpers) : value]),
  );
}

/**
 * The resolved theme: `themes` in priority order (the app's, then its
 * presets', then Blade's copy of Tailwind's defaults).
 */
export function resolveTheme(themes: ThemeConfig[]): ResolvedTheme {
  const base = themes.reduce<Record<string, any>>((merged, { extend: _extend, ...theme }) => {
    for (const key of Object.keys(theme)) if (!(key in merged)) merged[key] = theme[key];
    return merged;
  }, {});
  return resolveFunctionKeys(mergeExtensions({ ...base, extend: collectExtends(themes) }));
}

/** `{ primary: { DEFAULT: a, 500: b } }` → `{ primary: a, 'primary-500': b }` */
export function flattenColors(colors: Record<string, any> = {}): Record<string, string> {
  return Object.assign(
    {},
    ...Object.entries(colors).map(([key, value]) => {
      if (isPlainObject(value)) {
        return Object.fromEntries(
          Object.entries(flattenColors(value)).map(([shade, color]) => [
            shade === 'DEFAULT' ? key : `${key}-${shade}`,
            color,
          ]),
        );
      }
      return { [key]: String(value) };
    }),
  );
}

/** A colour as `theme()` in a class or CSS gives it: `<alpha-value>` at 1. */
export const opaque = (color: string): string => {
  if (!color.includes('<alpha-value>')) return color;
  return colorAt(color, 1);
};
