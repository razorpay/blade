// Tailwind's theme values are an app's untyped data (tailwind.config.js),
// read as Tailwind reads them: ported from its JavaScript.
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tailwind v3.4's core utilities (src/corePlugins.js), in its order, read
 * from the app's resolved theme. The order is the stylesheet's: Uno writes
 * rules in the order they are listed, so where two classes set one property
 * (`rounded-lg rounded-t-none`, `text-sm leading-6`) the same one wins as
 * under Tailwind.
 *
 * Blade's own rules come after these in `bladeUnoConfig`, so a class both
 * define (`p-4`, `flex`, `shadow-card`) is Blade's — one definition per
 * class on the page.
 *
 * Transforms are not here: Blade's composed `--blade-*` model owns
 * `translate-*`, `rotate-*`, `scale-*` and `transform`. Filters set Blade's
 * filter variables (`--blade-blur`…), so they compose with Blade's.
 */
import type { Rule } from 'unocss';
import { toColorValue, withAlphaValue, withAlphaVariable } from './color';
import { addUtilities, createEngine } from './engine';
import type { Declarations, MatchOptions } from './engine';
import { flattenColors } from './theme';
import type { ResolvedTheme } from './theme';
import { formatBoxShadowValue, parseBoxShadowValue } from './values';

const kebab = (property: string): string =>
  property.startsWith('--') ? property : property.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const isPlainObject = (value: unknown): value is Record<string, any> =>
  Object.prototype.toString.call(value) === '[object Object]';

// Blade's composed filters (uno.config.ts `FILTER`): the same variables, so
// Tailwind's filter classes and Blade's compose on one element.
const CSS_FILTER = [
  'blur',
  'brightness',
  'contrast',
  'grayscale',
  'hue-rotate',
  'invert',
  'saturate',
  'sepia',
  'drop-shadow',
]
  .map((name) => `var(--blade-${name})`)
  .join(' ');

const CSS_BACKDROP_FILTER = [
  'blur',
  'brightness',
  'contrast',
  'grayscale',
  'hue-rotate',
  'invert',
  'opacity',
  'saturate',
  'sepia',
]
  .map((name) => `var(--blade-backdrop-${name})`)
  .join(' ');

const CSS_TOUCH_ACTION = 'var(--tw-pan-x) var(--tw-pan-y) var(--tw-pinch-zoom)';
const CSS_FONT_VARIANT_NUMERIC =
  'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)';

/** How a theme key's value becomes CSS (src/util/transformThemeValue.js). */
function transformThemeValue(themeKey: string): (value: any) => any {
  if (['fontSize', 'outline'].includes(themeKey)) {
    return (value) => (Array.isArray(value) ? value[0] : value);
  }
  if (themeKey === 'fontFamily') {
    return (value) => {
      const families = Array.isArray(value) && isPlainObject(value[1]) ? value[0] : value;
      return Array.isArray(families) ? families.join(', ') : families;
    };
  }
  if (
    [
      'boxShadow',
      'transitionProperty',
      'transitionDuration',
      'transitionDelay',
      'transitionTimingFunction',
      'backgroundImage',
      'backgroundSize',
      'backgroundColor',
      'cursor',
      'animation',
    ].includes(themeKey)
  ) {
    return (value) => (Array.isArray(value) ? value.join(', ') : value);
  }
  if (['gridTemplateColumns', 'gridTemplateRows', 'objectPosition'].includes(themeKey)) {
    // postcss.list.comma, joined with spaces
    return (value) =>
      typeof value === 'string'
        ? value
            .split(/,(?![^(]*\))/)
            .map((part) => part.trim())
            .filter(Boolean)
            .join(' ')
        : value;
  }
  return (value) => value;
}

/** `{ DEFAULT, …rest }` → `rest` */
const withoutDefault = ({ DEFAULT: _default, ...rest }: Record<string, any> = {}): Record<
  string,
  any
> => rest;

/** Splits `name 1s ease infinite` animations, finding each keyframes' name. */
function animationNames(input: string): (string | undefined)[] {
  const keywords = new Set([
    'normal',
    'reverse',
    'alternate',
    'alternate-reverse',
    'running',
    'paused',
    'none',
    'forwards',
    'backwards',
    'both',
    'infinite',
    'linear',
    'ease',
    'ease-in',
    'ease-out',
    'ease-in-out',
    'step-start',
    'step-end',
  ]);
  return input.split(/,(?![^(]*\))/g).map((animation) => {
    const seen = new Set<string>();
    for (const part of animation.trim().split(/ +(?![^(]*\))/g)) {
      if (/^(-?[\d.]+m?s)$/.test(part) || /^(\d+)$/.test(part)) continue;
      if (['cubic-bezier(', 'steps('].some((fn) => part.startsWith(fn))) continue;
      // Each keyword group counts once; a repeat would be the name.
      if (keywords.has(part) && !seen.has(part)) {
        seen.add(part);
        continue;
      }
      return part;
    }
    return undefined;
  });
}

/** Tailwind's keyframes object as CSS: `{ '0%': { opacity: 0 } }` → `0%{opacity:0}` */
function keyframesCSS(name: string, frames: Record<string, Record<string, any>>): string {
  const steps = Object.entries(frames)
    .map(
      ([step, declarations]) =>
        `${step}{${Object.entries(declarations)
          .map(([property, value]) => `${kebab(property.trim())}:${value}`)
          .join(';')}}`,
    )
    .join('');
  return `@keyframes ${name}{${steps}}`;
}

/** The Tailwind-compatible rules for `theme`, in Tailwind's order. */
export function tailwindRules(theme: ResolvedTheme): Rule[] {
  const { matchUtilities } = createEngine({ opacity: theme.opacity ?? {} });

  /** src/util/createUtilityPlugin.js */
  const createUtilityPlugin = (
    themeKey: string,
    variations: [string, (string | [string, string])[]][][] = [[[themeKey, [themeKey]]]],
    { filterDefault = false, ...options }: MatchOptions & { filterDefault?: boolean } = {},
  ): Rule[] => {
    const transform = transformThemeValue(themeKey);
    const values = filterDefault ? withoutDefault(theme[themeKey]) : theme[themeKey];
    return variations.flatMap((group) =>
      matchUtilities(
        Object.fromEntries(
          group.map(([prefix, properties]) => [
            prefix,
            (value: any) =>
              Object.fromEntries(
                properties.map((property) =>
                  Array.isArray(property)
                    ? [kebab(property[0]), property[1]]
                    : [kebab(property), transform(value)],
                ),
              ),
          ]),
        ),
        { ...options, values },
      ),
    );
  };

  const colors = (key: string): Record<string, string> => flattenColors(theme[key]);
  const colorUtility = (
    identifier: string,
    key: string,
    output: (value: string) => Declarations,
    { dropDefault = false, type = ['color', 'any'] as MatchOptions['type'] } = {},
  ): Rule[] =>
    matchUtilities(
      { [identifier]: output },
      { values: dropDefault ? withoutDefault(colors(key)) : colors(key), type },
    );

  const filter = (identifier: string, key: string, name = identifier, negative = false): Rule[] =>
    matchUtilities(
      {
        [identifier]: (value) => ({
          [`--blade-${name}`]: `${name}(${value})`,
          filter: CSS_FILTER,
        }),
      },
      { values: theme[key], supportsNegativeValues: negative },
    );

  const backdrop = (identifier: string, key: string, name: string, negative = false): Rule[] =>
    matchUtilities(
      {
        [`backdrop-${identifier}`]: (value) => ({
          [`--blade-backdrop-${identifier}`]: `${name}(${value})`,
          'backdrop-filter': CSS_BACKDROP_FILTER,
        }),
      },
      { values: theme[key], supportsNegativeValues: negative },
    );

  const keyframes: Record<string, string> = Object.fromEntries(
    Object.entries(theme.keyframes ?? {}).map(([name, frames]) => [
      name,
      keyframesCSS(name, frames as Record<string, Record<string, any>>),
    ]),
  );

  const boxShadowValue = transformThemeValue('boxShadow');

  return [
    // accessibility
    ...addUtilities({
      '.sr-only': {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        'white-space': 'nowrap',
        'border-width': '0',
      },
      '.not-sr-only': {
        position: 'static',
        width: 'auto',
        height: 'auto',
        padding: '0',
        margin: '0',
        overflow: 'visible',
        clip: 'auto',
        'white-space': 'normal',
      },
    }),
    ...addUtilities({
      '.pointer-events-none': { 'pointer-events': 'none' },
      '.pointer-events-auto': { 'pointer-events': 'auto' },
    }),
    ...addUtilities({
      '.visible': { visibility: 'visible' },
      '.invisible': { visibility: 'hidden' },
      '.collapse': { visibility: 'collapse' },
    }),
    ...addUtilities({
      '.static': { position: 'static' },
      '.fixed': { position: 'fixed' },
      '.absolute': { position: 'absolute' },
      '.relative': { position: 'relative' },
      '.sticky': { position: 'sticky' },
    }),
    ...createUtilityPlugin(
      'inset',
      [
        [['inset', ['inset']]],
        [
          ['inset-x', ['left', 'right']],
          ['inset-y', ['top', 'bottom']],
        ],
        [
          ['start', ['inset-inline-start']],
          ['end', ['inset-inline-end']],
          ['top', ['top']],
          ['right', ['right']],
          ['bottom', ['bottom']],
          ['left', ['left']],
        ],
      ],
      { supportsNegativeValues: true },
    ),
    ...addUtilities({
      '.isolate': { isolation: 'isolate' },
      '.isolation-auto': { isolation: 'auto' },
    }),
    ...createUtilityPlugin('zIndex', [[['z', ['zIndex']]]], { supportsNegativeValues: true }),
    ...createUtilityPlugin('order', undefined, { supportsNegativeValues: true }),
    ...createUtilityPlugin('gridColumn', [[['col', ['gridColumn']]]]),
    ...createUtilityPlugin('gridColumnStart', [[['col-start', ['gridColumnStart']]]]),
    ...createUtilityPlugin('gridColumnEnd', [[['col-end', ['gridColumnEnd']]]]),
    ...createUtilityPlugin('gridRow', [[['row', ['gridRow']]]]),
    ...createUtilityPlugin('gridRowStart', [[['row-start', ['gridRowStart']]]]),
    ...createUtilityPlugin('gridRowEnd', [[['row-end', ['gridRowEnd']]]]),
    ...addUtilities({
      '.float-start': { float: 'inline-start' },
      '.float-end': { float: 'inline-end' },
      '.float-right': { float: 'right' },
      '.float-left': { float: 'left' },
      '.float-none': { float: 'none' },
    }),
    ...addUtilities({
      '.clear-start': { clear: 'inline-start' },
      '.clear-end': { clear: 'inline-end' },
      '.clear-left': { clear: 'left' },
      '.clear-right': { clear: 'right' },
      '.clear-both': { clear: 'both' },
      '.clear-none': { clear: 'none' },
    }),
    ...createUtilityPlugin(
      'margin',
      [
        [['m', ['margin']]],
        [
          ['mx', ['margin-left', 'margin-right']],
          ['my', ['margin-top', 'margin-bottom']],
        ],
        [
          ['ms', ['margin-inline-start']],
          ['me', ['margin-inline-end']],
          ['mt', ['margin-top']],
          ['mr', ['margin-right']],
          ['mb', ['margin-bottom']],
          ['ml', ['margin-left']],
        ],
      ],
      { supportsNegativeValues: true },
    ),
    ...addUtilities({
      '.box-border': { 'box-sizing': 'border-box' },
      '.box-content': { 'box-sizing': 'content-box' },
    }),
    ...matchUtilities(
      {
        'line-clamp': (value) => ({
          overflow: 'hidden',
          display: '-webkit-box',
          '-webkit-box-orient': 'vertical',
          '-webkit-line-clamp': `${value}`,
        }),
      },
      { values: theme.lineClamp },
    ),
    ...addUtilities({
      '.line-clamp-none': {
        overflow: 'visible',
        display: 'block',
        '-webkit-box-orient': 'horizontal',
        '-webkit-line-clamp': 'none',
      },
    }),
    ...addUtilities(
      Object.fromEntries(
        [
          'block',
          'inline-block',
          'inline',
          'flex',
          'inline-flex',
          'table',
          'inline-table',
          'table-caption',
          'table-cell',
          'table-column',
          'table-column-group',
          'table-footer-group',
          'table-header-group',
          'table-row-group',
          'table-row',
          'flow-root',
          'grid',
          'inline-grid',
          'contents',
          'list-item',
        ]
          .map((display): [string, Declarations] => [`.${display}`, { display }])
          .concat([['.hidden', { display: 'none' }]]),
      ),
    ),
    ...createUtilityPlugin('aspectRatio', [[['aspect', ['aspect-ratio']]]]),
    ...createUtilityPlugin('size', [[['size', ['width', 'height']]]]),
    ...createUtilityPlugin('height', [[['h', ['height']]]]),
    ...createUtilityPlugin('maxHeight', [[['max-h', ['maxHeight']]]]),
    ...createUtilityPlugin('minHeight', [[['min-h', ['minHeight']]]]),
    ...createUtilityPlugin('width', [[['w', ['width']]]]),
    ...createUtilityPlugin('minWidth', [[['min-w', ['minWidth']]]]),
    ...createUtilityPlugin('maxWidth', [[['max-w', ['maxWidth']]]]),
    ...createUtilityPlugin('flex'),
    // `flex-shrink-*`, `flex-grow-*`: Tailwind's deprecated names, not ported
    ...createUtilityPlugin('flexShrink', [[['shrink', ['flex-shrink']]]]),
    ...createUtilityPlugin('flexGrow', [[['grow', ['flex-grow']]]]),
    ...createUtilityPlugin('flexBasis', [[['basis', ['flex-basis']]]]),
    ...addUtilities({
      '.table-auto': { 'table-layout': 'auto' },
      '.table-fixed': { 'table-layout': 'fixed' },
    }),
    ...addUtilities({
      '.caption-top': { 'caption-side': 'top' },
      '.caption-bottom': { 'caption-side': 'bottom' },
    }),
    ...addUtilities({
      '.border-collapse': { 'border-collapse': 'collapse' },
      '.border-separate': { 'border-collapse': 'separate' },
    }),
    ...matchUtilities(
      {
        'border-spacing': (value) => ({
          '--tw-border-spacing-x': value,
          '--tw-border-spacing-y': value,
          'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
        }),
        'border-spacing-x': (value) => ({
          '--tw-border-spacing-x': value,
          'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
        }),
        'border-spacing-y': (value) => ({
          '--tw-border-spacing-y': value,
          'border-spacing': 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)',
        }),
      },
      { values: theme.borderSpacing },
    ),
    ...createUtilityPlugin('transformOrigin', [[['origin', ['transformOrigin']]]]),
    // translate, rotate, skew, scale, transform: Blade's (see the header)
    ...matchUtilities(
      {
        animate: (value: string) => {
          const names = animationNames(value);
          return [
            ...names.flatMap((name) => (name && keyframes[name] ? [keyframes[name]] : [])),
            { animation: value },
          ];
        },
      },
      { values: theme.animation },
    ),
    ...createUtilityPlugin('cursor'),
    ...addUtilities({
      '.touch-auto': { 'touch-action': 'auto' },
      '.touch-none': { 'touch-action': 'none' },
      '.touch-pan-x': { '--tw-pan-x': 'pan-x', 'touch-action': CSS_TOUCH_ACTION },
      '.touch-pan-left': { '--tw-pan-x': 'pan-left', 'touch-action': CSS_TOUCH_ACTION },
      '.touch-pan-right': { '--tw-pan-x': 'pan-right', 'touch-action': CSS_TOUCH_ACTION },
      '.touch-pan-y': { '--tw-pan-y': 'pan-y', 'touch-action': CSS_TOUCH_ACTION },
      '.touch-pan-up': { '--tw-pan-y': 'pan-up', 'touch-action': CSS_TOUCH_ACTION },
      '.touch-pan-down': { '--tw-pan-y': 'pan-down', 'touch-action': CSS_TOUCH_ACTION },
      '.touch-pinch-zoom': { '--tw-pinch-zoom': 'pinch-zoom', 'touch-action': CSS_TOUCH_ACTION },
      '.touch-manipulation': { 'touch-action': 'manipulation' },
    }),
    ...addUtilities({
      '.select-none': { 'user-select': 'none' },
      '.select-text': { 'user-select': 'text' },
      '.select-all': { 'user-select': 'all' },
      '.select-auto': { 'user-select': 'auto' },
    }),
    ...addUtilities({
      '.resize-none': { resize: 'none' },
      '.resize-y': { resize: 'vertical' },
      '.resize-x': { resize: 'horizontal' },
      '.resize': { resize: 'both' },
    }),
    ...addUtilities({
      '.snap-none': { 'scroll-snap-type': 'none' },
      '.snap-x': { 'scroll-snap-type': 'x var(--tw-scroll-snap-strictness)' },
      '.snap-y': { 'scroll-snap-type': 'y var(--tw-scroll-snap-strictness)' },
      '.snap-both': { 'scroll-snap-type': 'both var(--tw-scroll-snap-strictness)' },
      '.snap-mandatory': { '--tw-scroll-snap-strictness': 'mandatory' },
      '.snap-proximity': { '--tw-scroll-snap-strictness': 'proximity' },
    }),
    ...addUtilities({
      '.snap-start': { 'scroll-snap-align': 'start' },
      '.snap-end': { 'scroll-snap-align': 'end' },
      '.snap-center': { 'scroll-snap-align': 'center' },
      '.snap-align-none': { 'scroll-snap-align': 'none' },
    }),
    ...addUtilities({
      '.snap-normal': { 'scroll-snap-stop': 'normal' },
      '.snap-always': { 'scroll-snap-stop': 'always' },
    }),
    ...createUtilityPlugin(
      'scrollMargin',
      [
        [['scroll-m', ['scroll-margin']]],
        [
          ['scroll-mx', ['scroll-margin-left', 'scroll-margin-right']],
          ['scroll-my', ['scroll-margin-top', 'scroll-margin-bottom']],
        ],
        [
          ['scroll-ms', ['scroll-margin-inline-start']],
          ['scroll-me', ['scroll-margin-inline-end']],
          ['scroll-mt', ['scroll-margin-top']],
          ['scroll-mr', ['scroll-margin-right']],
          ['scroll-mb', ['scroll-margin-bottom']],
          ['scroll-ml', ['scroll-margin-left']],
        ],
      ],
      { supportsNegativeValues: true },
    ),
    ...createUtilityPlugin('scrollPadding', [
      [['scroll-p', ['scroll-padding']]],
      [
        ['scroll-px', ['scroll-padding-left', 'scroll-padding-right']],
        ['scroll-py', ['scroll-padding-top', 'scroll-padding-bottom']],
      ],
      [
        ['scroll-ps', ['scroll-padding-inline-start']],
        ['scroll-pe', ['scroll-padding-inline-end']],
        ['scroll-pt', ['scroll-padding-top']],
        ['scroll-pr', ['scroll-padding-right']],
        ['scroll-pb', ['scroll-padding-bottom']],
        ['scroll-pl', ['scroll-padding-left']],
      ],
    ]),
    ...addUtilities({
      '.list-inside': { 'list-style-position': 'inside' },
      '.list-outside': { 'list-style-position': 'outside' },
    }),
    ...createUtilityPlugin('listStyleType', [[['list', ['listStyleType']]]]),
    ...createUtilityPlugin('listStyleImage', [[['list-image', ['listStyleImage']]]]),
    ...addUtilities({
      '.appearance-none': { appearance: 'none' },
      '.appearance-auto': { appearance: 'auto' },
    }),
    ...createUtilityPlugin('columns', [[['columns', ['columns']]]]),
    ...addUtilities(
      Object.fromEntries(
        ([
          ['before', ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column']],
          ['inside', ['auto', 'avoid', 'avoid-page', 'avoid-column']],
          ['after', ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column']],
        ] as const).flatMap(([side, values]) =>
          values.map((value) => [`.break-${side}-${value}`, { [`break-${side}`]: value }]),
        ),
      ),
    ),
    ...createUtilityPlugin('gridAutoColumns', [[['auto-cols', ['gridAutoColumns']]]]),
    ...addUtilities({
      '.grid-flow-row': { 'grid-auto-flow': 'row' },
      '.grid-flow-col': { 'grid-auto-flow': 'column' },
      '.grid-flow-dense': { 'grid-auto-flow': 'dense' },
      '.grid-flow-row-dense': { 'grid-auto-flow': 'row dense' },
      '.grid-flow-col-dense': { 'grid-auto-flow': 'column dense' },
    }),
    ...createUtilityPlugin('gridAutoRows', [[['auto-rows', ['gridAutoRows']]]]),
    ...createUtilityPlugin('gridTemplateColumns', [[['grid-cols', ['gridTemplateColumns']]]]),
    ...createUtilityPlugin('gridTemplateRows', [[['grid-rows', ['gridTemplateRows']]]]),
    ...addUtilities({
      '.flex-row': { 'flex-direction': 'row' },
      '.flex-row-reverse': { 'flex-direction': 'row-reverse' },
      '.flex-col': { 'flex-direction': 'column' },
      '.flex-col-reverse': { 'flex-direction': 'column-reverse' },
    }),
    ...addUtilities({
      '.flex-wrap': { 'flex-wrap': 'wrap' },
      '.flex-wrap-reverse': { 'flex-wrap': 'wrap-reverse' },
      '.flex-nowrap': { 'flex-wrap': 'nowrap' },
    }),
    ...addUtilities({
      '.place-content-center': { 'place-content': 'center' },
      '.place-content-start': { 'place-content': 'start' },
      '.place-content-end': { 'place-content': 'end' },
      '.place-content-between': { 'place-content': 'space-between' },
      '.place-content-around': { 'place-content': 'space-around' },
      '.place-content-evenly': { 'place-content': 'space-evenly' },
      '.place-content-baseline': { 'place-content': 'baseline' },
      '.place-content-stretch': { 'place-content': 'stretch' },
    }),
    ...addUtilities({
      '.place-items-start': { 'place-items': 'start' },
      '.place-items-end': { 'place-items': 'end' },
      '.place-items-center': { 'place-items': 'center' },
      '.place-items-baseline': { 'place-items': 'baseline' },
      '.place-items-stretch': { 'place-items': 'stretch' },
    }),
    ...addUtilities({
      '.content-normal': { 'align-content': 'normal' },
      '.content-center': { 'align-content': 'center' },
      '.content-start': { 'align-content': 'flex-start' },
      '.content-end': { 'align-content': 'flex-end' },
      '.content-between': { 'align-content': 'space-between' },
      '.content-around': { 'align-content': 'space-around' },
      '.content-evenly': { 'align-content': 'space-evenly' },
      '.content-baseline': { 'align-content': 'baseline' },
      '.content-stretch': { 'align-content': 'stretch' },
    }),
    ...addUtilities({
      '.items-start': { 'align-items': 'flex-start' },
      '.items-end': { 'align-items': 'flex-end' },
      '.items-center': { 'align-items': 'center' },
      '.items-baseline': { 'align-items': 'baseline' },
      '.items-stretch': { 'align-items': 'stretch' },
    }),
    ...addUtilities({
      '.justify-normal': { 'justify-content': 'normal' },
      '.justify-start': { 'justify-content': 'flex-start' },
      '.justify-end': { 'justify-content': 'flex-end' },
      '.justify-center': { 'justify-content': 'center' },
      '.justify-between': { 'justify-content': 'space-between' },
      '.justify-around': { 'justify-content': 'space-around' },
      '.justify-evenly': { 'justify-content': 'space-evenly' },
      '.justify-stretch': { 'justify-content': 'stretch' },
    }),
    ...addUtilities({
      '.justify-items-start': { 'justify-items': 'start' },
      '.justify-items-end': { 'justify-items': 'end' },
      '.justify-items-center': { 'justify-items': 'center' },
      '.justify-items-stretch': { 'justify-items': 'stretch' },
    }),
    ...createUtilityPlugin('gap', [
      [['gap', ['gap']]],
      [
        ['gap-x', ['columnGap']],
        ['gap-y', ['rowGap']],
      ],
    ]),
    ...matchUtilities(
      {
        'space-x': (raw) => {
          const value = raw === '0' ? '0px' : raw;
          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-x-reverse': '0',
              'margin-right': `calc(${value} * var(--tw-space-x-reverse))`,
              'margin-left': `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
            },
          };
        },
        'space-y': (raw) => {
          const value = raw === '0' ? '0px' : raw;
          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-y-reverse': '0',
              'margin-top': `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
              'margin-bottom': `calc(${value} * var(--tw-space-y-reverse))`,
            },
          };
        },
      },
      { values: theme.space, supportsNegativeValues: true },
    ),
    ...addUtilities({
      '.space-y-reverse > :not([hidden]) ~ :not([hidden])': { '--tw-space-y-reverse': '1' },
      '.space-x-reverse > :not([hidden]) ~ :not([hidden])': { '--tw-space-x-reverse': '1' },
    }),
    ...matchUtilities(
      {
        'divide-x': (raw) => {
          const value = raw === '0' ? '0px' : raw;
          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-divide-x-reverse': '0',
              'border-right-width': `calc(${value} * var(--tw-divide-x-reverse))`,
              'border-left-width': `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
            },
          };
        },
        'divide-y': (raw) => {
          const value = raw === '0' ? '0px' : raw;
          return {
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-divide-y-reverse': '0',
              'border-top-width': `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
              'border-bottom-width': `calc(${value} * var(--tw-divide-y-reverse))`,
            },
          };
        },
      },
      { values: theme.divideWidth, type: ['line-width', 'length', 'any'] },
    ),
    ...addUtilities({
      '.divide-y-reverse > :not([hidden]) ~ :not([hidden])': { '--tw-divide-y-reverse': '1' },
      '.divide-x-reverse > :not([hidden]) ~ :not([hidden])': { '--tw-divide-x-reverse': '1' },
    }),
    ...addUtilities(
      Object.fromEntries(
        ['solid', 'dashed', 'dotted', 'double', 'none'].map((style) => [
          `.divide-${style} > :not([hidden]) ~ :not([hidden])`,
          { 'border-style': style },
        ]),
      ),
    ),
    ...colorUtility(
      'divide',
      'divideColor',
      (value) => ({
        '& > :not([hidden]) ~ :not([hidden])': withAlphaVariable(
          value,
          'border-color',
          '--tw-divide-opacity',
        ),
      }),
      { dropDefault: true },
    ),
    ...matchUtilities(
      {
        'divide-opacity': (value) => ({
          '& > :not([hidden]) ~ :not([hidden])': { '--tw-divide-opacity': value },
        }),
      },
      { values: theme.divideOpacity },
    ),
    ...addUtilities({
      '.place-self-auto': { 'place-self': 'auto' },
      '.place-self-start': { 'place-self': 'start' },
      '.place-self-end': { 'place-self': 'end' },
      '.place-self-center': { 'place-self': 'center' },
      '.place-self-stretch': { 'place-self': 'stretch' },
    }),
    ...addUtilities({
      '.self-auto': { 'align-self': 'auto' },
      '.self-start': { 'align-self': 'flex-start' },
      '.self-end': { 'align-self': 'flex-end' },
      '.self-center': { 'align-self': 'center' },
      '.self-stretch': { 'align-self': 'stretch' },
      '.self-baseline': { 'align-self': 'baseline' },
    }),
    ...addUtilities({
      '.justify-self-auto': { 'justify-self': 'auto' },
      '.justify-self-start': { 'justify-self': 'start' },
      '.justify-self-end': { 'justify-self': 'end' },
      '.justify-self-center': { 'justify-self': 'center' },
      '.justify-self-stretch': { 'justify-self': 'stretch' },
    }),
    ...addUtilities(
      Object.fromEntries(
        ['', '-x', '-y'].flatMap((axis) =>
          ['auto', 'hidden', 'clip', 'visible', 'scroll'].map((value) => [
            `.overflow${axis}-${value}`,
            { [`overflow${axis}`]: value },
          ]),
        ),
      ),
    ),
    ...addUtilities(
      Object.fromEntries(
        ['', '-y', '-x'].flatMap((axis) =>
          ['auto', 'contain', 'none'].map((value) => [
            `.overscroll${axis}-${value}`,
            { [`overscroll-behavior${axis}`]: value },
          ]),
        ),
      ),
    ),
    ...addUtilities({
      '.scroll-auto': { 'scroll-behavior': 'auto' },
      '.scroll-smooth': { 'scroll-behavior': 'smooth' },
    }),
    ...addUtilities({
      '.truncate': { overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' },
      '.overflow-ellipsis': { 'text-overflow': 'ellipsis' },
      '.text-ellipsis': { 'text-overflow': 'ellipsis' },
      '.text-clip': { 'text-overflow': 'clip' },
    }),
    ...addUtilities({
      '.hyphens-none': { hyphens: 'none' },
      '.hyphens-manual': { hyphens: 'manual' },
      '.hyphens-auto': { hyphens: 'auto' },
    }),
    ...addUtilities(
      Object.fromEntries(
        ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'].map((value) => [
          `.whitespace-${value}`,
          { 'white-space': value },
        ]),
      ),
    ),
    ...addUtilities({
      '.text-wrap': { 'text-wrap': 'wrap' },
      '.text-nowrap': { 'text-wrap': 'nowrap' },
      '.text-balance': { 'text-wrap': 'balance' },
      '.text-pretty': { 'text-wrap': 'pretty' },
    }),
    ...addUtilities({
      '.break-normal': { 'overflow-wrap': 'normal', 'word-break': 'normal' },
      '.break-words': { 'overflow-wrap': 'break-word' },
      '.break-all': { 'word-break': 'break-all' },
      '.break-keep': { 'word-break': 'keep-all' },
    }),
    ...createUtilityPlugin('borderRadius', [
      [['rounded', ['border-radius']]],
      [
        ['rounded-s', ['border-start-start-radius', 'border-end-start-radius']],
        ['rounded-e', ['border-start-end-radius', 'border-end-end-radius']],
        ['rounded-t', ['border-top-left-radius', 'border-top-right-radius']],
        ['rounded-r', ['border-top-right-radius', 'border-bottom-right-radius']],
        ['rounded-b', ['border-bottom-right-radius', 'border-bottom-left-radius']],
        ['rounded-l', ['border-top-left-radius', 'border-bottom-left-radius']],
      ],
      [
        ['rounded-ss', ['border-start-start-radius']],
        ['rounded-se', ['border-start-end-radius']],
        ['rounded-ee', ['border-end-end-radius']],
        ['rounded-es', ['border-end-start-radius']],
        ['rounded-tl', ['border-top-left-radius']],
        ['rounded-tr', ['border-top-right-radius']],
        ['rounded-br', ['border-bottom-right-radius']],
        ['rounded-bl', ['border-bottom-left-radius']],
      ],
    ]),
    ...createUtilityPlugin(
      'borderWidth',
      [
        [['border', ['border-width']]],
        [
          ['border-x', ['border-left-width', 'border-right-width']],
          ['border-y', ['border-top-width', 'border-bottom-width']],
        ],
        [
          ['border-s', ['border-inline-start-width']],
          ['border-e', ['border-inline-end-width']],
          ['border-t', ['border-top-width']],
          ['border-r', ['border-right-width']],
          ['border-b', ['border-bottom-width']],
          ['border-l', ['border-left-width']],
        ],
      ],
      { type: ['line-width', 'length'] },
    ),
    ...addUtilities(
      Object.fromEntries(
        ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'].map((style) => [
          `.border-${style}`,
          { 'border-style': style },
        ]),
      ),
    ),
    ...colorUtility(
      'border',
      'borderColor',
      (value) => withAlphaVariable(value, 'border-color', '--tw-border-opacity'),
      { dropDefault: true },
    ),
    ...matchUtilities(
      {
        'border-x': (value) =>
          withAlphaVariable(
            value,
            ['border-left-color', 'border-right-color'],
            '--tw-border-opacity',
          ),
        'border-y': (value) =>
          withAlphaVariable(
            value,
            ['border-top-color', 'border-bottom-color'],
            '--tw-border-opacity',
          ),
      },
      { values: withoutDefault(colors('borderColor')), type: ['color', 'any'] },
    ),
    ...matchUtilities(
      {
        'border-s': (value) =>
          withAlphaVariable(value, 'border-inline-start-color', '--tw-border-opacity'),
        'border-e': (value) =>
          withAlphaVariable(value, 'border-inline-end-color', '--tw-border-opacity'),
        'border-t': (value) => withAlphaVariable(value, 'border-top-color', '--tw-border-opacity'),
        'border-r': (value) =>
          withAlphaVariable(value, 'border-right-color', '--tw-border-opacity'),
        'border-b': (value) =>
          withAlphaVariable(value, 'border-bottom-color', '--tw-border-opacity'),
        'border-l': (value) => withAlphaVariable(value, 'border-left-color', '--tw-border-opacity'),
      },
      { values: withoutDefault(colors('borderColor')), type: ['color', 'any'] },
    ),
    ...createUtilityPlugin('borderOpacity', [[['border-opacity', ['--tw-border-opacity']]]]),
    ...colorUtility('bg', 'backgroundColor', (value) =>
      withAlphaVariable(value, 'background-color', '--tw-bg-opacity'),
    ),
    ...createUtilityPlugin('backgroundOpacity', [[['bg-opacity', ['--tw-bg-opacity']]]]),
    ...createUtilityPlugin('backgroundImage', [[['bg', ['background-image']]]], {
      type: ['lookup', 'image', 'url'],
    }),
    ...gradientColorStops(),
    ...addUtilities({
      '.decoration-slice': { 'box-decoration-break': 'slice' },
      '.decoration-clone': { 'box-decoration-break': 'clone' },
      '.box-decoration-slice': { 'box-decoration-break': 'slice' },
      '.box-decoration-clone': { 'box-decoration-break': 'clone' },
    }),
    ...createUtilityPlugin('backgroundSize', [[['bg', ['background-size']]]], {
      type: ['lookup', 'length', 'percentage', 'size'],
    }),
    ...addUtilities({
      '.bg-fixed': { 'background-attachment': 'fixed' },
      '.bg-local': { 'background-attachment': 'local' },
      '.bg-scroll': { 'background-attachment': 'scroll' },
    }),
    ...addUtilities({
      '.bg-clip-border': { 'background-clip': 'border-box' },
      '.bg-clip-padding': { 'background-clip': 'padding-box' },
      '.bg-clip-content': { 'background-clip': 'content-box' },
      '.bg-clip-text': { 'background-clip': 'text' },
    }),
    ...createUtilityPlugin('backgroundPosition', [[['bg', ['background-position']]]], {
      type: ['lookup', ['position', { preferOnConflict: true }]],
    }),
    ...addUtilities({
      '.bg-repeat': { 'background-repeat': 'repeat' },
      '.bg-no-repeat': { 'background-repeat': 'no-repeat' },
      '.bg-repeat-x': { 'background-repeat': 'repeat-x' },
      '.bg-repeat-y': { 'background-repeat': 'repeat-y' },
      '.bg-repeat-round': { 'background-repeat': 'round' },
      '.bg-repeat-space': { 'background-repeat': 'space' },
    }),
    ...addUtilities({
      '.bg-origin-border': { 'background-origin': 'border-box' },
      '.bg-origin-padding': { 'background-origin': 'padding-box' },
      '.bg-origin-content': { 'background-origin': 'content-box' },
    }),
    ...colorUtility('fill', 'fill', (value) => ({ fill: toColorValue(value) })),
    ...colorUtility('stroke', 'stroke', (value) => ({ stroke: toColorValue(value) }), {
      type: ['color', 'url', 'any'],
    }),
    ...createUtilityPlugin('strokeWidth', [[['stroke', ['stroke-width']]]], {
      type: ['length', 'number', 'percentage'],
    }),
    ...addUtilities(
      Object.fromEntries(
        ['contain', 'cover', 'fill', 'none', 'scale-down'].map((fit) => [
          `.object-${fit}`,
          { 'object-fit': fit },
        ]),
      ),
    ),
    ...createUtilityPlugin('objectPosition', [[['object', ['object-position']]]]),
    ...createUtilityPlugin('padding', [
      [['p', ['padding']]],
      [
        ['px', ['padding-left', 'padding-right']],
        ['py', ['padding-top', 'padding-bottom']],
      ],
      [
        ['ps', ['padding-inline-start']],
        ['pe', ['padding-inline-end']],
        ['pt', ['padding-top']],
        ['pr', ['padding-right']],
        ['pb', ['padding-bottom']],
        ['pl', ['padding-left']],
      ],
    ]),
    ...addUtilities(
      Object.fromEntries(
        ['left', 'center', 'right', 'justify', 'start', 'end'].map((align) => [
          `.text-${align}`,
          { 'text-align': align },
        ]),
      ),
    ),
    ...createUtilityPlugin('textIndent', [[['indent', ['text-indent']]]], {
      supportsNegativeValues: true,
    }),
    ...addUtilities(
      Object.fromEntries(
        [
          'baseline',
          'top',
          'middle',
          'bottom',
          'text-top',
          'text-bottom',
          'sub',
          'super',
        ].map((align) => [`.align-${align}`, { 'vertical-align': align }]),
      ),
    ),
    ...matchUtilities({ align: (value) => ({ 'vertical-align': value }) }),
    ...matchUtilities(
      {
        font: (value) => {
          const [families, options = {}] =
            Array.isArray(value) && isPlainObject(value[1]) ? value : [value];
          return {
            'font-family': Array.isArray(families) ? families.join(', ') : families,
            'font-feature-settings': options.fontFeatureSettings,
            'font-variation-settings': options.fontVariationSettings,
          };
        },
      },
      { values: theme.fontFamily, type: ['lookup', 'generic-name', 'family-name'] },
    ),
    ...matchUtilities(
      {
        text: (value, { modifier }) => {
          const [fontSize, options] = Array.isArray(value) ? value : [value];
          if (modifier) return { 'font-size': fontSize, 'line-height': modifier };
          const { lineHeight, letterSpacing, fontWeight } = isPlainObject(options)
            ? options
            : { lineHeight: options };
          return {
            'font-size': fontSize,
            'line-height': lineHeight,
            'letter-spacing': letterSpacing,
            'font-weight': fontWeight,
          };
        },
      },
      {
        values: theme.fontSize,
        modifiers: theme.lineHeight,
        type: ['absolute-size', 'relative-size', 'length', 'percentage'],
      },
    ),
    ...createUtilityPlugin('fontWeight', [[['font', ['fontWeight']]]], {
      type: ['lookup', 'number', 'any'],
    }),
    ...addUtilities({
      '.uppercase': { 'text-transform': 'uppercase' },
      '.lowercase': { 'text-transform': 'lowercase' },
      '.capitalize': { 'text-transform': 'capitalize' },
      '.normal-case': { 'text-transform': 'none' },
    }),
    ...addUtilities({
      '.italic': { 'font-style': 'italic' },
      '.not-italic': { 'font-style': 'normal' },
    }),
    ...addUtilities({
      '.normal-nums': { 'font-variant-numeric': 'normal' },
      ...Object.fromEntries(
        ([
          ['ordinal', 'ordinal'],
          ['slashed-zero', 'slashed-zero'],
          ['lining-nums', 'numeric-figure'],
          ['oldstyle-nums', 'numeric-figure'],
          ['proportional-nums', 'numeric-spacing'],
          ['tabular-nums', 'numeric-spacing'],
          ['diagonal-fractions', 'numeric-fraction'],
          ['stacked-fractions', 'numeric-fraction'],
        ] as const).map(([name, variable]) => [
          `.${name}`,
          { [`--tw-${variable}`]: name, 'font-variant-numeric': CSS_FONT_VARIANT_NUMERIC },
        ]),
      ),
    }),
    ...createUtilityPlugin('lineHeight', [[['leading', ['lineHeight']]]]),
    ...createUtilityPlugin('letterSpacing', [[['tracking', ['letterSpacing']]]], {
      supportsNegativeValues: true,
    }),
    ...colorUtility('text', 'textColor', (value) =>
      withAlphaVariable(value, 'color', '--tw-text-opacity'),
    ),
    ...createUtilityPlugin('textOpacity', [[['text-opacity', ['--tw-text-opacity']]]]),
    ...addUtilities({
      '.underline': { 'text-decoration-line': 'underline' },
      '.overline': { 'text-decoration-line': 'overline' },
      '.line-through': { 'text-decoration-line': 'line-through' },
      '.no-underline': { 'text-decoration-line': 'none' },
    }),
    ...colorUtility('decoration', 'textDecorationColor', (value) => ({
      'text-decoration-color': toColorValue(value),
    })),
    ...addUtilities(
      Object.fromEntries(
        ['solid', 'double', 'dotted', 'dashed', 'wavy'].map((style) => [
          `.decoration-${style}`,
          { 'text-decoration-style': style },
        ]),
      ),
    ),
    ...createUtilityPlugin(
      'textDecorationThickness',
      [[['decoration', ['text-decoration-thickness']]]],
      { type: ['length', 'percentage'] },
    ),
    ...createUtilityPlugin(
      'textUnderlineOffset',
      [[['underline-offset', ['text-underline-offset']]]],
      { type: ['length', 'percentage', 'any'] },
    ),
    ...addUtilities({
      '.antialiased': {
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
      },
      '.subpixel-antialiased': {
        '-webkit-font-smoothing': 'auto',
        '-moz-osx-font-smoothing': 'auto',
      },
    }),
    ...colorUtility('placeholder', 'placeholderColor', (value) => ({
      '&::placeholder': withAlphaVariable(value, 'color', '--tw-placeholder-opacity'),
    })),
    ...matchUtilities(
      {
        'placeholder-opacity': (value) => ({
          '&::placeholder': { '--tw-placeholder-opacity': value },
        }),
      },
      { values: theme.placeholderOpacity },
    ),
    ...colorUtility('caret', 'caretColor', (value) => ({ 'caret-color': toColorValue(value) })),
    ...colorUtility('accent', 'accentColor', (value) => ({ 'accent-color': toColorValue(value) })),
    ...createUtilityPlugin('opacity', [[['opacity', ['opacity']]]]),
    ...addUtilities(
      Object.fromEntries(
        [
          'normal',
          'multiply',
          'screen',
          'overlay',
          'darken',
          'lighten',
          'color-dodge',
          'color-burn',
          'hard-light',
          'soft-light',
          'difference',
          'exclusion',
          'hue',
          'saturation',
          'color',
          'luminosity',
        ].map((mode) => [`.bg-blend-${mode}`, { 'background-blend-mode': mode }]),
      ),
    ),
    ...addUtilities(
      Object.fromEntries(
        [
          'normal',
          'multiply',
          'screen',
          'overlay',
          'darken',
          'lighten',
          'color-dodge',
          'color-burn',
          'hard-light',
          'soft-light',
          'difference',
          'exclusion',
          'hue',
          'saturation',
          'color',
          'luminosity',
          'plus-lighter',
        ].map((mode) => [`.mix-blend-${mode}`, { 'mix-blend-mode': mode }]),
      ),
    ),
    ...matchUtilities(
      {
        shadow: (raw) => {
          const value = boxShadowValue(raw);
          const ast = parseBoxShadowValue(value);
          for (const parsed of ast) if (parsed.valid) parsed.color = 'var(--tw-shadow-color)';
          return {
            '--tw-shadow': value === 'none' ? '0 0 #0000' : value,
            '--tw-shadow-colored': value === 'none' ? '0 0 #0000' : formatBoxShadowValue(ast),
            'box-shadow':
              'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)',
          };
        },
      },
      { values: theme.boxShadow, type: ['shadow'] },
    ),
    ...colorUtility('shadow', 'boxShadowColor', (value) => ({
      '--tw-shadow-color': toColorValue(value),
      '--tw-shadow': 'var(--tw-shadow-colored)',
    })),
    ...addUtilities({
      '.outline-none': { outline: '2px solid transparent', 'outline-offset': '2px' },
      '.outline': { 'outline-style': 'solid' },
      '.outline-dashed': { 'outline-style': 'dashed' },
      '.outline-dotted': { 'outline-style': 'dotted' },
      '.outline-double': { 'outline-style': 'double' },
    }),
    ...createUtilityPlugin('outlineWidth', [[['outline', ['outline-width']]]], {
      type: ['length', 'number', 'percentage'],
    }),
    ...createUtilityPlugin('outlineOffset', [[['outline-offset', ['outline-offset']]]], {
      type: ['length', 'number', 'percentage', 'any'],
      supportsNegativeValues: true,
    }),
    ...colorUtility('outline', 'outlineColor', (value) => ({
      'outline-color': toColorValue(value),
    })),
    ...matchUtilities(
      {
        ring: (value) => ({
          '--tw-ring-offset-shadow':
            'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)',
          '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
          'box-shadow':
            'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)',
        }),
      },
      { values: theme.ringWidth, type: 'length' },
    ),
    ...addUtilities({ '.ring-inset': { '--tw-ring-inset': 'inset' } }),
    ...colorUtility(
      'ring',
      'ringColor',
      (value) => withAlphaVariable(value, '--tw-ring-color', '--tw-ring-opacity'),
      { dropDefault: true },
    ),
    ...createUtilityPlugin('ringOpacity', [[['ring-opacity', ['--tw-ring-opacity']]]], {
      filterDefault: true,
    }),
    ...createUtilityPlugin('ringOffsetWidth', [[['ring-offset', ['--tw-ring-offset-width']]]], {
      type: 'length',
    }),
    ...colorUtility('ring-offset', 'ringOffsetColor', (value) => ({
      '--tw-ring-offset-color': toColorValue(value),
    })),
    ...filter('blur', 'blur'),
    ...filter('brightness', 'brightness'),
    ...filter('contrast', 'contrast'),
    ...matchUtilities(
      {
        'drop-shadow': (value) => ({
          '--blade-drop-shadow': Array.isArray(value)
            ? value.map((shadow) => `drop-shadow(${shadow})`).join(' ')
            : `drop-shadow(${value})`,
          filter: CSS_FILTER,
        }),
      },
      { values: theme.dropShadow },
    ),
    ...filter('grayscale', 'grayscale'),
    ...filter('hue-rotate', 'hueRotate', 'hue-rotate', true),
    ...filter('invert', 'invert'),
    ...filter('saturate', 'saturate'),
    ...filter('sepia', 'sepia'),
    ...addUtilities({
      '.filter': { filter: CSS_FILTER },
      '.filter-none': { filter: 'none' },
    }),
    ...backdrop('blur', 'backdropBlur', 'blur'),
    ...backdrop('brightness', 'backdropBrightness', 'brightness'),
    ...backdrop('contrast', 'backdropContrast', 'contrast'),
    ...backdrop('grayscale', 'backdropGrayscale', 'grayscale'),
    ...backdrop('hue-rotate', 'backdropHueRotate', 'hue-rotate', true),
    ...backdrop('invert', 'backdropInvert', 'invert'),
    ...backdrop('opacity', 'backdropOpacity', 'opacity'),
    ...backdrop('saturate', 'backdropSaturate', 'saturate'),
    ...backdrop('sepia', 'backdropSepia', 'sepia'),
    ...addUtilities({
      '.backdrop-filter': { 'backdrop-filter': CSS_BACKDROP_FILTER },
      '.backdrop-filter-none': { 'backdrop-filter': 'none' },
    }),
    ...matchUtilities(
      {
        transition: (value) => ({
          'transition-property': value,
          ...(value === 'none'
            ? {}
            : {
                'transition-timing-function': theme.transitionTimingFunction?.DEFAULT,
                'transition-duration': theme.transitionDuration?.DEFAULT,
              }),
        }),
      },
      { values: theme.transitionProperty },
    ),
    ...createUtilityPlugin('transitionDelay', [[['delay', ['transitionDelay']]]]),
    ...createUtilityPlugin('transitionDuration', [[['duration', ['transitionDuration']]]], {
      filterDefault: true,
    }),
    ...createUtilityPlugin('transitionTimingFunction', [[['ease', ['transitionTimingFunction']]]], {
      filterDefault: true,
    }),
    ...createUtilityPlugin('willChange', [[['will-change', ['will-change']]]]),
    ...createUtilityPlugin('content', [
      [['content', ['--tw-content', ['content', 'var(--tw-content)']]]],
    ]),
    ...addUtilities({
      '.forced-color-adjust-auto': { 'forced-color-adjust': 'auto' },
      '.forced-color-adjust-none': { 'forced-color-adjust': 'none' },
    }),
  ];

  /** src/corePlugins.js gradientColorStops */
  function gradientColorStops(): Rule[] {
    const transparentTo = (value: string): string =>
      withAlphaValue(value, '0', 'rgb(255 255 255 / 0)')!;
    const options: MatchOptions = { values: colors('gradientColorStops'), type: ['color', 'any'] };
    const positionOptions: MatchOptions = {
      values: theme.gradientColorStopPositions,
      type: ['length', 'percentage'],
    };
    return [
      ...matchUtilities(
        {
          from: (value) => ({
            '--tw-gradient-from': `${toColorValue(value)} var(--tw-gradient-from-position)`,
            '--tw-gradient-to': `${transparentTo(value)} var(--tw-gradient-to-position)`,
            '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
          }),
        },
        options,
      ),
      ...matchUtilities(
        { from: (value) => ({ '--tw-gradient-from-position': value }) },
        positionOptions,
      ),
      ...matchUtilities(
        {
          via: (value) => ({
            '--tw-gradient-to': `${transparentTo(value)}  var(--tw-gradient-to-position)`,
            '--tw-gradient-stops': `var(--tw-gradient-from), ${toColorValue(
              value,
            )} var(--tw-gradient-via-position), var(--tw-gradient-to)`,
          }),
        },
        options,
      ),
      ...matchUtilities(
        { via: (value) => ({ '--tw-gradient-via-position': value }) },
        positionOptions,
      ),
      ...matchUtilities(
        {
          to: (value) => ({
            '--tw-gradient-to': `${toColorValue(value)} var(--tw-gradient-to-position)`,
          }),
        },
        options,
      ),
      ...matchUtilities(
        { to: (value) => ({ '--tw-gradient-to-position': value }) },
        positionOptions,
      ),
    ];
  }
}
