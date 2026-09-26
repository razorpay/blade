import { defineConfig } from 'unocss';
import type { Rule, Variant } from 'unocss';
import {
  backdropBlur,
  bladeNeutralTheme,
  border,
  breakpoints,
  elevation,
  motion,
  opacity,
  size,
  typography,
} from '@razorpay/blade-core/tokens';
import { colorsToCSSVariables } from '@razorpay/blade-core/utils';

/**
 * Every class maps to exactly one CSS property with a static value, so the processed output can be
 * turned into JSON for non-web rendering surfaces. Lengths are px, except typography which is rem
 * (and em for letter spacing), so it can be scaled for mobile by scaling the root font size.
 */

type Scale = Record<string | number, string | number>;

/** Adds `px` to numeric token values, keeps string values like `50%` as is */
const px = (value: string | number): string => (typeof value === 'number' ? `${value}px` : value);

/** `rules('p', 'padding', { 1: 2 })` → `[['p-1', { padding: '2px' }]]` */
const rules = (
  prefix: string,
  property: string,
  scale: Scale,
  format: (value: string | number) => string = px,
): Rule[] =>
  Object.entries(scale).map(([key, value]) => [`${prefix}-${key}`, { [property]: format(value) }]);

/** Same scale for multiple prefix → property pairs */
const rulesFor = (
  prefixToProperty: Record<string, string>,
  scale: Scale,
  format?: (value: string | number) => string,
): Rule[] =>
  Object.entries(prefixToProperty).flatMap(([prefix, property]) =>
    rules(prefix, property, scale, format),
  );

/** `{ 1: 2 }` → `{ 'blade-1': 2 }`, keeps token classes like `p-blade-1` explicit */
const bladePrefixed = (scale: Scale): Scale =>
  Object.fromEntries(Object.entries(scale).map(([key, value]) => [`blade-${key}`, value]));

/** Static keyword rules, e.g. `keywords('display', { flex: 'flex' })` → `flex { display: flex }` */
const keywords = (property: string, classToValue: Record<string, string>): Rule[] =>
  Object.entries(classToValue).map(([className, value]) => [className, { [property]: value }]);

// ===== Colors =====

/**
 * Maps the property segment of a color token to its class prefix and CSS property.
 * e.g. `surface.background.gray.subtle` → `bg-surface-gray-subtle`
 */
const colorPropertyToUtility = {
  background: { prefix: 'bg', property: 'background-color' },
  border: { prefix: 'border', property: 'border-color' },
  text: { prefix: 'text', property: 'color' },
  icon: { prefix: 'icon', property: 'color' },
} as const;

type ColorProperty = keyof typeof colorPropertyToUtility;

const isColorProperty = (segment: string): segment is ColorProperty =>
  segment in colorPropertyToUtility;

/** Token categories that don't get utility classes */
const excludedColorCategories = new Set(['data']);

/** `@deprecated` tokens in the theme */
const deprecatedColorTokens = new Set([
  '--popup-background-subtle',
  '--popup-background-intense',
  '--popup-border-subtle',
  '--popup-border-intense',
]);

/** Light mode color values of the neutral theme */
const getColorRules = (): Rule[] => {
  const colorRules: Rule[] = [];
  // Only used for token naming: '--surface-background-gray-subtle' → value
  const colors = colorsToCSSVariables(bladeNeutralTheme.colors.onLight);
  for (const [cssVariable, value] of Object.entries(colors)) {
    // '--surface-background-gray-subtle' → ['surface', 'background', 'gray', 'subtle']
    const [category, colorProperty, ...rest] = cssVariable.replace(/^--/, '').split('-');
    // Skips excluded categories and tokens without a property segment like `transparent`
    if (excludedColorCategories.has(category) || deprecatedColorTokens.has(cssVariable)) continue;
    if (!colorProperty || !isColorProperty(colorProperty) || rest.length === 0) continue;

    const { prefix, property } = colorPropertyToUtility[colorProperty];
    colorRules.push([[prefix, category, ...rest].join('-'), { [property]: String(value) }]);
    // Native checkboxes and radios take the fill tokens, e.g. `accent-interactive-primary-default`
    if (colorProperty === 'background') {
      colorRules.push([['accent', category, ...rest].join('-'), { 'accent-color': String(value) }]);
    }
    // Focus outlines take the border tokens, e.g. `outline-surface-primary-muted`
    if (colorProperty === 'border') {
      colorRules.push([['outline', category, ...rest].join('-'), { 'outline-color': String(value) }]);
    }
  }
  return colorRules;
};

/** Light mode color value of a token, e.g. `color('surface-border-primary-muted')` */
const color = (token: string): string => {
  const value = colorsToCSSVariables(bladeNeutralTheme.colors.onLight)[`--${token}`];
  if (!value) throw new Error(`Unknown color token: ${token}`);
  return value;
};

const colorKeywordRules: Rule[] = [
  ...keywords('background-color', { 'bg-transparent': 'transparent', 'bg-current': 'currentColor' }),
  ...keywords('border-color', { 'border-transparent': 'transparent', 'border-current': 'currentColor' }),
  ...keywords('border-top-color', { 'border-t-transparent': 'transparent' }),
  ...keywords('outline-color', { 'outline-transparent': 'transparent', 'outline-current': 'currentColor' }),
  ...keywords('color', { 'text-current': 'currentColor', 'text-inherit': 'inherit' }),
  ...keywords('fill', { 'fill-none': 'none', 'fill-current': 'currentColor' }),
  ...keywords('stroke', { 'stroke-none': 'none', 'stroke-current': 'currentColor' }),
  ...keywords('accent-color', { 'accent-current': 'currentColor' }),
];

// ===== Spacing =====

/** e.g. `p-blade-1` → 2px */
const spacing = bladePrefixed(bladeNeutralTheme.spacing);

/**
 * Tailwind's default spacing scale in px (1 unit = 4px), for spacing and sizing classes.
 * e.g. `p-4` → 16px, `w-0.5` → 2px, `p-px` → 1px
 */
const builtInSpacing: Scale = {
  ...Object.fromEntries(
    [
      0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40,
      44, 48, 52, 56, 60, 64, 72, 80, 96,
    ].map((unit) => [unit, unit * 4]),
  ),
  px: 1,
};

const paddingAndMargin = {
  p: 'padding',
  px: 'padding-inline',
  py: 'padding-block',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  m: 'margin',
  mx: 'margin-inline',
  my: 'margin-block',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
};

const negativeMargin = {
  '-m': 'margin',
  '-mx': 'margin-inline',
  '-my': 'margin-block',
  '-mt': 'margin-top',
  '-mr': 'margin-right',
  '-mb': 'margin-bottom',
  '-ml': 'margin-left',
};

const gap = {
  gap: 'gap',
  'gap-x': 'column-gap',
  'gap-y': 'row-gap',
};

const inset = {
  inset: 'inset',
  'inset-x': 'inset-inline',
  'inset-y': 'inset-block',
  top: 'top',
  right: 'right',
  bottom: 'bottom',
  left: 'left',
};

const negativeInset = {
  '-inset': 'inset',
  '-inset-x': 'inset-inline',
  '-inset-y': 'inset-block',
  '-top': 'top',
  '-right': 'right',
  '-bottom': 'bottom',
  '-left': 'left',
};

const negativePx = (value: string | number): string => `-${px(value)}`;

/** Logical properties (`padding-inline`) keep axis classes like `px-*` to a single property */
const spacingRules: Rule[] = [
  ...rulesFor({ ...paddingAndMargin, ...gap, ...inset }, { ...spacing, ...builtInSpacing }),
  // Negative margins and insets, e.g. `-mt-blade-1` → -2px, `-top-1` → -4px
  ...rulesFor({ ...negativeMargin, ...negativeInset }, { ...spacing, ...builtInSpacing }, negativePx),
  ...keywords('margin', { 'm-auto': 'auto' }),
  ...keywords('margin-inline', { 'mx-auto': 'auto' }),
];

// ===== Sizing =====

/** e.g. `w-blade-36` → 36px, `w-9` → 36px */
const sizeRules: Rule[] = rulesFor(
  {
    w: 'width',
    h: 'height',
    'min-w': 'min-width',
    'min-h': 'min-height',
    'max-w': 'max-width',
    'max-h': 'max-height',
  },
  { ...bladePrefixed(size), ...builtInSpacing, full: '100%', auto: 'auto' },
);

// ===== Border =====

const borderRules: Rule[] = [
  // e.g. `rounded-medium` → 12px, `rounded-tl-small` → 8px
  ...rulesFor(
    {
      rounded: 'border-radius',
      'rounded-tl': 'border-top-left-radius',
      'rounded-tr': 'border-top-right-radius',
      'rounded-br': 'border-bottom-right-radius',
      'rounded-bl': 'border-bottom-left-radius',
    },
    border.radius,
  ),
  // e.g. `border-thin` → 1px, `border-t-thicker` → 2px
  ...rulesFor(
    {
      border: 'border-width',
      'border-t': 'border-top-width',
      'border-r': 'border-right-width',
      'border-b': 'border-bottom-width',
      'border-l': 'border-left-width',
    },
    border.width,
  ),
  // No preflight sets a default border style, so it needs to be set explicitly
  ...keywords('border-style', {
    'border-solid': 'solid',
    'border-dashed': 'dashed',
    'border-dotted': 'dotted',
    'border-none': 'none',
  }),
];

// ===== Elevation & Motion =====

const effectRules: Rule[] = [
  // e.g. `shadow-midRaised`, light mode only
  ...rules('shadow', 'box-shadow', elevation.onLight),
  // e.g. `duration-moderate` → 280ms
  ...rules('duration', 'transition-duration', motion.duration, (value) => `${value}ms`),
  // e.g. `ease-standard` → cubic-bezier(0.3, 0, 0.2, 1)
  // Blade's `linear` is `cubic-bezier(0, 0, 0, 0)`, which isn't linear, so it's replaced
  ...rules('ease', 'transition-timing-function', { ...motion.easing, linear: 'linear' }),
  // e.g. `delay-gentle` → 480ms
  ...rules('delay', 'transition-delay', motion.delay, (value) => `${value}ms`),
  // e.g. `backdrop-blur-medium` → blur(8px)
  ...rules('backdrop-blur', 'backdrop-filter', backdropBlur, (value) => `blur(${px(value)})`),
];

// ===== Typography =====

/** Desktop values, mobile is handled by scaling the root font size */
const { fonts, lineHeights, letterSpacings } = typography.onDesktop;

/** Root font size the rem values are based on */
const ROOT_FONT_SIZE = 16;

/** Avoids floating point artifacts, e.g. -1.3 / 100 → -0.013 instead of -0.013000000000000001 */
const round = (value: number): number => Number(value.toFixed(4));

const rem = (value: string | number): string => `${round(Number(value) / ROOT_FONT_SIZE)}rem`;

const typographyRules: Rule[] = [
  // e.g. `text-100` → 0.875rem (14px)
  ...rules('text', 'font-size', fonts.size, rem),
  // e.g. `leading-100` → 1.25rem (20px)
  ...rules('leading', 'line-height', lineHeights, rem),
  // e.g. `font-semibold` → 600
  ...rules('font', 'font-weight', fonts.weight, String),
  // e.g. `font-heading` → "TASA Orbiter", …
  ...rules('font', 'font-family', fonts.family, String),
  // Tokens are % of the font size, e.g. `tracking-25` → -3.3% → -0.033em
  ...rules('tracking', 'letter-spacing', letterSpacings, (value) => `${round(Number(value) / 100)}em`),
];

// ===== Layout =====

const layoutRules: Rule[] = [
  ...keywords('display', {
    block: 'block',
    'inline-block': 'inline-block',
    inline: 'inline',
    flex: 'flex',
    'inline-flex': 'inline-flex',
    grid: 'grid',
    hidden: 'none',
  }),
  ...keywords('position', {
    static: 'static',
    relative: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
  }),
  ...keywords('flex-direction', {
    'flex-row': 'row',
    'flex-row-reverse': 'row-reverse',
    'flex-col': 'column',
    'flex-col-reverse': 'column-reverse',
  }),
  ...keywords('flex-wrap', {
    'flex-wrap': 'wrap',
    'flex-nowrap': 'nowrap',
  }),
  ...keywords('flex', { 'flex-1': '1 1 0%', 'flex-auto': '1 1 auto', 'flex-none': 'none' }),
  ...keywords('flex-grow', { grow: '1', 'grow-0': '0' }),
  ...keywords('flex-shrink', { shrink: '1', 'shrink-0': '0' }),
  ...keywords('align-items', {
    'items-start': 'flex-start',
    'items-center': 'center',
    'items-end': 'flex-end',
    'items-baseline': 'baseline',
    'items-stretch': 'stretch',
  }),
  ...keywords('justify-content', {
    'justify-start': 'flex-start',
    'justify-center': 'center',
    'justify-end': 'flex-end',
    'justify-between': 'space-between',
    'justify-around': 'space-around',
    'justify-evenly': 'space-evenly',
  }),
  ...keywords('align-self', {
    'self-auto': 'auto',
    'self-start': 'flex-start',
    'self-center': 'center',
    'self-end': 'flex-end',
    'self-stretch': 'stretch',
  }),
  ...keywords('overflow', {
    'overflow-auto': 'auto',
    'overflow-hidden': 'hidden',
    'overflow-visible': 'visible',
    'overflow-scroll': 'scroll',
  }),
];

// ===== Fractions =====

/** Percentage lengths, e.g. `top-1/2` → 50%, `w-5/6` → 83.333333% */
const fractions: Scale = {
  '1/2': '50%',
  '1/3': '33.333333%',
  '2/3': '66.666667%',
  '1/4': '25%',
  '3/4': '75%',
  '5/6': '83.333333%',
  full: '100%',
};

const fractionRules: Rule[] = [
  ...rulesFor({ ...inset, w: 'width', h: 'height', 'max-w': 'max-width', 'max-h': 'max-height' }, fractions),
  ...rulesFor(negativeInset, fractions, (value) => `-${value}`),
  ...keywords('width', { 'w-max': 'max-content', 'w-min': 'min-content', 'w-fit': 'fit-content' }),
  ...keywords('margin-inline-start', { 'ms-auto': 'auto' }),
  ...keywords('margin-inline-end', { 'me-auto': 'auto' }),
  // Logical margins, e.g. `ms-1` → 4px
  ...rulesFor({ ms: 'margin-inline-start', me: 'margin-inline-end' }, { ...spacing, ...builtInSpacing }),
];

// ===== Visual =====

/** Blade's opacity scale, e.g. `opacity-300` → 0.18, `opacity-1300` → 1 */
const opacityRules: Rule[] = rules('opacity', 'opacity', opacity, String);

/** No tokens for stacking; the steps the components use */
const zIndexRules: Rule[] = rules(
  'z',
  'z-index',
  Object.fromEntries([0, 1, 5, 10, 20, 30, 50, 60].map((z) => [z, z])),
  String,
);

const transformRules: Rule[] = [
  // Individual transform properties, so they compose without a shared `transform`
  // e.g. `scale-95` → scale: 0.95, `rotate-45` → rotate: 45deg
  ...rules(
    'scale',
    'scale',
    Object.fromEntries([0, 50, 75, 90, 95, 100, 105].map((scale) => [scale, scale / 100])),
    String,
  ),
  ...rules('rotate', 'rotate', { 0: 0, 45: 45, 90: 90, 180: 180 }, (value) => `${value}deg`),
  ...rules('-rotate', 'rotate', { 45: 45, 90: 90, 180: 180 }, (value) => `-${value}deg`),
  // `translate-x-4` → 16px 0; both axes at once take the arbitrary form `[translate:-50%_-50%]`
  ...rules('translate-x', 'translate', { ...builtInSpacing, ...fractions }, (value) => `${px(value)} 0`),
  ...rules('-translate-x', 'translate', { ...builtInSpacing, ...fractions }, (value) => `-${px(value)} 0`),
  ...rules('translate-y', 'translate', { ...builtInSpacing, ...fractions }, (value) => `0 ${px(value)}`),
  ...rules('-translate-y', 'translate', { ...builtInSpacing, ...fractions }, (value) => `0 -${px(value)}`),
  ...keywords('transform-origin', {
    'origin-center': 'center',
    'origin-left': 'left',
    'origin-right': 'right',
    'origin-top': 'top',
    'origin-bottom': 'bottom',
  }),
];

const transitionRules: Rule[] = [
  ...keywords('transition-property', {
    'transition-none': 'none',
    'transition-all': 'all',
    'transition-colors': 'color, background-color, border-color, outline-color, fill, stroke',
    'transition-opacity': 'opacity',
    'transition-shadow': 'box-shadow',
    'transition-transform': 'translate, scale, rotate, transform',
    'transition-size': 'width, height',
  }),
];

/**
 * Checkout's surfaces as named shadows, their colours baked from the tokens. A button's frame is a
 * stack of inset shadows: the bottom edge, a hairline rim and a white bevel; hover, press and focus
 * darken the rim. `-focus` adds Blade's 4px focus ring to the frame, as `box-shadow` is one property.
 */
const focusRing = (tint: string): string => `0px 0px 0px 4px ${tint}`;
const FOCUS_PRIMARY = color('surface-border-primary-muted');
const FOCUS_NEGATIVE = color('feedback-border-negative-subtle');
const FOCUS_NEUTRAL = color('interactive-border-neutral-faded');

const filledFrame = ({ rim, edge, bevel }: { rim: string; edge: string; bevel: string }) => {
  const frame = `inset 0 1.5px 0 0 ${bevel}, inset 0 -2px 0 0 ${bevel}`;
  const highlighted = `inset 0 -1.5px 0 0 ${edge}, inset 0 0 0 0.5px ${edge}, ${frame}`;
  return {
    rest: `inset 0 -1.5px 0 0 ${edge}, inset 0 0 0 0.5px ${rim}, ${frame}`,
    highlighted,
  };
};

const buttonAccents = {
  primary: {
    rim: color('interactive-border-primary-default'),
    edge: color('interactive-border-primary-highlighted'),
    bevel: 'hsla(0, 0%, 100%, 0.18)',
    ring: FOCUS_PRIMARY,
  },
  neutral: {
    rim: color('interactive-background-neutral-default'),
    edge: 'hsla(0, 0%, 0%, 0.88)',
    bevel: 'hsla(0, 0%, 100%, 0.32)',
    ring: FOCUS_NEUTRAL,
  },
  positive: {
    rim: color('interactive-background-positive-default'),
    edge: color('interactive-background-positive-highlighted'),
    bevel: 'hsla(0, 0%, 100%, 0.18)',
    ring: FOCUS_PRIMARY,
  },
  negative: {
    rim: color('interactive-background-negative-default'),
    edge: color('interactive-background-negative-highlighted'),
    bevel: 'hsla(0, 0%, 100%, 0.18)',
    ring: FOCUS_PRIMARY,
  },
};

/** Blade's outlined frame: a bottom shade, the 1px rim, then the bottom edge */
const outlinedFrame = (rim: string): string =>
  `inset 0 -1px 0.5px 0 ${color('interactive-border-static-black-faded-highlighted')}, inset 0 0 0 1px ${rim}, inset 0 -1.5px 0 0 ${color('interactive-border-gray-default')}`;
const outlined = {
  rest: outlinedFrame(color('interactive-border-gray-default')),
  highlighted: outlinedFrame(color('interactive-border-gray-highlighted')),
};

const namedShadows: Scale = {
  // Blade's elevated card (`drop-shadow-01`)
  card: '0 6px 32px 4px hsla(205, 8%, 71%, 0.06)',
  // Blade's focus ring, on its own and inset
  focus: focusRing(FOCUS_PRIMARY),
  'focus-inset': `inset ${focusRing(FOCUS_PRIMARY)}`,
  'focus-negative': focusRing(FOCUS_NEGATIVE),
  'focus-neutral': focusRing(FOCUS_NEUTRAL),
  ...Object.fromEntries(
    Object.entries(buttonAccents).flatMap(([accent, { ring, ...colors }]) => {
      const { rest, highlighted } = filledFrame(colors);
      return [
        [`button-${accent}`, rest],
        [`button-${accent}-highlighted`, highlighted],
        [`button-${accent}-focus`, `${highlighted}, ${focusRing(ring)}`],
      ];
    }),
  ),
  'button-outlined': outlined.rest,
  'button-outlined-highlighted': outlined.highlighted,
  'button-outlined-focus': `${focusRing(FOCUS_PRIMARY)}, ${outlined.highlighted}`,
  'button-outlined-neutral-focus': `${focusRing(FOCUS_NEUTRAL)}, ${outlined.highlighted}`,
  // Blade's bottom sheet: an upward drop shadow
  bottomSheet: '0px -24px 48px -12px hsla(217, 56%, 17%, 0.18)',
  // Blade's toast: a white bevel along the top edge, under its popup border
  'toast-bevel': `inset 0 1.5px 0 0 ${color('interactive-background-static-white-faded-highlighted')}`,
  'button-outlined-disabled': `inset 0 0 0 1px ${color('interactive-border-gray-disabled')}`,
};

/** The filled button's resting sheen: a white radial from the top-left corner, sized per button size */
const sheen = (size: number): string =>
  `radial-gradient(${size}px ${size}px at 0% 0%, hsla(0, 0%, 100%, 0.18) 0%, transparent 100%)`;

const backgroundImages: Scale = {
  'button-sheen-xsmall': sheen(48),
  'button-sheen-small': sheen(56),
  'button-sheen-medium': sheen(64),
  'button-sheen-large': sheen(72),
};

/**
 * Blade's raised surface (`getSurfaceStyles`, light mode): a 1px inset rim, the card's drop
 * shadow and a top inner shade, over two 16px gradients that tint the bottom edge. Several
 * properties, so one class rather than a shadow plus background utilities.
 */
const surfaceGradient = (from: string, to: string): string => `linear-gradient(to bottom, ${from} 0%, ${to} 100%)`;
const SURFACE_WHITE = 'hsla(0, 0%, 100%, 1)';
const SURFACE_TINT = 'hsla(0, 0%, 97%, 1)';
const surfaceRaised: Rule = [
  'surface-raised',
  {
    'box-shadow': `inset 0px 0px 0px 1px ${color('interactive-border-gray-disabled')}, ${namedShadows.card}, inset 0px -1.5px 0px 1px ${color('surface-background-gray-intense')}`,
    border: 'none',
    'background-image': `${surfaceGradient(SURFACE_WHITE, SURFACE_WHITE)}, ${surfaceGradient(SURFACE_WHITE, SURFACE_TINT)}`,
    'background-position': 'center top, center calc(100% - 2px)',
    'background-size': 'calc(100% - 2px) 16px, calc(100% - 2px) 16px',
    'background-repeat': 'no-repeat',
  },
];

const visualRules: Rule[] = [
  surfaceRaised,
  ...rules('shadow', 'box-shadow', namedShadows, String),
  ...rules('bg', 'background-image', backgroundImages, String),
  ...keywords('background-image', { 'bg-none': 'none' }),
  // e.g. `blur-medium` → blur(8px), `grayscale` → grayscale(1)
  ...rules('blur', 'filter', backdropBlur, (value) => `blur(${px(value)})`),
  ...keywords('filter', { grayscale: 'grayscale(1)', 'filter-none': 'none' }),
  ...keywords('border-radius', { 'rounded-inherit': 'inherit' }),
  // `::before` and `::after` render only with content
  ...keywords('content', { 'content-empty': "''" }),
  // Outlines, for rings that have to sit beside a box shadow, e.g. `outline-thick` → 1.5px
  ...rules('outline', 'outline-width', border.width),
  ...keywords('outline-style', { 'outline-none': 'none', 'outline-solid': 'solid' }),
  ...rules('outline-offset', 'outline-offset', { 0: 0, 1: 1, 2: 2 }),
  ...rules('-outline-offset', 'outline-offset', { 1: 1, 2: 2, 4: 4 }, negativePx),
];

// ===== Animation =====

const keyframes = {
  spin: 'from { rotate: 0deg } to { rotate: 360deg }',
  pulse: '50% { opacity: 0.5 }',
  bounce: '0%, 100% { translate: 0 -50% } 50% { translate: 0 0 }',
  shake:
    '0%, 100% { translate: 0 0 } 12.5% { translate: -6px 0 } 37.5% { translate: 5px 0 } 62.5% { translate: -3px 0 } 87.5% { translate: 2px 0 }',
  // Blade's Skeleton: the gray fill rests, then brightens to its highlighted step
  skeleton: `0%, 25% { background-color: ${color('interactive-background-gray-default')} } 100% { background-color: ${color('interactive-background-gray-highlighted')} }`,
};

/** Blade's Skeleton pulse: 2xgentle on, xmoderate off, alternating */
const skeletonPulse = `skeleton ${motion.duration['2xgentle'] + motion.duration.xmoderate}ms ${motion.easing.standard} infinite alternate`;

const animationRules: Rule[] = keywords('animation', {
  'animate-none': 'none',
  'animate-spin': 'spin 1s linear infinite',
  'animate-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'animate-bounce': 'bounce 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite',
  'animate-shake': 'shake 400ms ease-in-out 1',
  'animate-skeleton': skeletonPulse,
});

// ===== Interaction =====

const interactionRules: Rule[] = [
  ...keywords('cursor', {
    'cursor-auto': 'auto',
    'cursor-default': 'default',
    'cursor-pointer': 'pointer',
    'cursor-text': 'text',
    'cursor-not-allowed': 'not-allowed',
    'cursor-grab': 'grab',
    'cursor-grabbing': 'grabbing',
  }),
  ...keywords('pointer-events', { 'pointer-events-none': 'none', 'pointer-events-auto': 'auto' }),
  ...keywords('user-select', { 'select-none': 'none', 'select-auto': 'auto', 'select-text': 'text' }),
  ...keywords('touch-action', { 'touch-none': 'none', 'touch-auto': 'auto', 'touch-pan-y': 'pan-y' }),
  ...keywords('resize', { resize: 'both', 'resize-none': 'none', 'resize-y': 'vertical' }),
  ...keywords('scroll-snap-type', { 'snap-x-mandatory': 'x mandatory', 'snap-none': 'none' }),
  ...keywords('scroll-snap-align', { 'snap-start': 'start', 'snap-center': 'center' }),
  ...keywords('overscroll-behavior-x', { 'overscroll-x-contain': 'contain' }),
  ...keywords('scrollbar-width', { 'scrollbar-none': 'none' }),
];

// ===== More layout & text =====

const moreLayoutRules: Rule[] = [
  ...keywords('display', { table: 'table', contents: 'contents', 'display-box': '-webkit-box' }),
  ...keywords('visibility', { visible: 'visible', invisible: 'hidden' }),
  ...keywords('box-sizing', { 'box-border': 'border-box', 'box-content': 'content-box' }),
  ...keywords('isolation', { isolate: 'isolate' }),
  ...keywords('overflow-x', { 'overflow-x-auto': 'auto', 'overflow-x-hidden': 'hidden' }),
  ...keywords('overflow-y', { 'overflow-y-auto': 'auto', 'overflow-y-hidden': 'hidden' }),
  ...keywords('object-fit', { 'object-contain': 'contain', 'object-cover': 'cover' }),
  ...keywords('order', { 'order-first': '-9999', 'order-last': '9999', 'order-none': '0' }),
  ...keywords('-webkit-box-orient', { 'box-vertical': 'vertical' }),
  ...rules(
    'line-clamp',
    '-webkit-line-clamp',
    Object.fromEntries([1, 2, 3, 4].map((lines) => [lines, lines])),
    String,
  ),
  // e.g. `grid-cols-12` → repeat(12, minmax(0, 1fr)), `col-span-6` → span 6 / span 6
  ...Array.from({ length: 12 }, (_, i): Rule[] => [
    [`grid-cols-${i + 1}`, { 'grid-template-columns': `repeat(${i + 1}, minmax(0, 1fr))` }],
    [`col-span-${i + 1}`, { 'grid-column': `span ${i + 1} / span ${i + 1}` }],
    [`col-start-${i + 1}`, { 'grid-column-start': String(i + 1) }],
  ]).flat(),
  ...keywords('grid-column', { 'col-span-full': '1 / -1' }),
];

const textRules: Rule[] = [
  ...keywords('text-align', {
    'text-left': 'left',
    'text-center': 'center',
    'text-right': 'right',
    'text-start': 'start',
    'text-end': 'end',
  }),
  ...keywords('white-space', {
    'whitespace-normal': 'normal',
    'whitespace-nowrap': 'nowrap',
    'whitespace-pre': 'pre',
    'whitespace-pre-wrap': 'pre-wrap',
  }),
  ...keywords('text-decoration-line', {
    underline: 'underline',
    'line-through': 'line-through',
    'no-underline': 'none',
  }),
  ...rules('underline-offset', 'text-underline-offset', { 1: 1, 2: 2, 4: 4 }),
  ...keywords('text-overflow', { 'text-ellipsis': 'ellipsis' }),
  ...keywords('font-variant-numeric', { 'tabular-nums': 'tabular-nums' }),
  ...keywords('vertical-align', { 'align-middle': 'middle', 'align-top': 'top', 'align-baseline': 'baseline' }),
];

/**
 * One-off values as an arbitrary property, still one property per class:
 * `[stroke-linecap:round]`, `[--tab-index:2]`, `[width:calc(100%/var(--tab-count))]`.
 * `_` stands for a space.
 */
const arbitraryPropertyRule: Rule = [
  /^\[(--[\w-]+|[a-z-]+):(.+)\]$/,
  ([, property, value]) => ({ [property]: value.replace(/_/g, ' ') }),
];

// ===== Shortcuts =====

/** Multi-property utilities, spelled out as single-property classes */
const shortcuts: Record<string, string> = {
  truncate: 'overflow-hidden text-ellipsis whitespace-nowrap',
  ...Object.fromEntries(
    [1, 2, 3, 4].map((lines) => [
      `clamp-${lines}`,
      `overflow-hidden display-box box-vertical line-clamp-${lines}`,
    ]),
  ),
  'sr-only':
    'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-none [clip:rect(0,0,0,0)]',
};

// ===== Variants =====

/** e.g. `hover:bg-…` → `.hover\:bg-…:hover` */
const pseudoClasses: Record<string, string> = {
  hover: ':hover',
  focus: ':focus',
  'focus-visible': ':focus-visible',
  'focus-within': ':focus-within',
  active: ':active',
  disabled: ':disabled',
  enabled: ':enabled',
  checked: ':checked',
  first: ':first-child',
  last: ':last-child',
  empty: ':empty',
  before: '::before',
  after: '::after',
  placeholder: '::placeholder',
};

/**
 * Appends a state to a selector, ahead of any pseudo-element an inner variant added:
 * `hover:before:` → `.x:hover::before`, not `.x::before:hover`
 */
const withState = (selector: string, state: string): string => {
  const pseudoElement = /::[\w-]+$/.exec(selector);
  if (!pseudoElement || state.startsWith('::')) return `${selector}${state}`;
  return `${selector.slice(0, pseudoElement.index)}${state}${pseudoElement[0]}`;
};

const pseudoClassVariant: Variant = (matcher) => {
  const [name, ...rest] = matcher.split(':');
  const pseudoClass = pseudoClasses[name];
  if (!pseudoClass || rest.length === 0) return undefined;
  return {
    matcher: rest.join(':'),
    selector: (selector) => withState(selector, pseudoClass),
  };
};

/** `data-[state=closed]:` → `[data-state="closed"]` */
const dataAttribute = (condition: string): string => {
  const [key, value] = condition.split('=');
  return value === undefined ? `[data-${key}]` : `[data-${key}="${value}"]`;
};

/** The state part of a group or peer variant: a pseudo class or a data attribute */
const stateSelector = (state: string): string | undefined => {
  const data = /^data-\[(.+)\]$/.exec(state);
  if (data) return dataAttribute(data[1]);
  return pseudoClasses[state];
};

/** `data-[state=closed]:opacity-0` → `.x[data-state="closed"]` */
const dataVariant: Variant = (matcher) => {
  const match = /^data-\[([^\]]+)\]:(.+)$/.exec(matcher);
  if (!match) return undefined;
  return {
    matcher: match[2],
    selector: (selector) => withState(selector, dataAttribute(match[1])),
  };
};

/**
 * State of a marked ancestor or preceding sibling: `group-active:`, `group-hover/item:` (the
 * ancestor carries `group/item`), `group-data-[state=closed]:`, `peer-disabled:`
 */
const groupPeerVariant: Variant = (matcher) => {
  const match = /^(group|peer)-(data-\[[^\]]+\]|[a-z-]+)(?:\/([\w-]+))?:(.+)$/.exec(matcher);
  if (!match) return undefined;
  const [, kind, state, name, rest] = match;
  const pseudo = stateSelector(state);
  if (!pseudo) return undefined;
  const marker = `.${kind}${name ? `\\/${name}` : ''}${pseudo}`;
  return {
    matcher: rest,
    selector: (selector) => (kind === 'group' ? `${marker} ${selector}` : `${marker} ~ ${selector}`),
  };
};

/** `*:w-2` → direct children; `[&>img]:w-full`, `[&>*+*]:border-t-thin` → any selector around `&` */
const selectorVariant: Variant = (matcher) => {
  if (matcher.startsWith('*:')) {
    return { matcher: matcher.slice(2), selector: (selector) => `${selector} > *` };
  }
  const match = /^\[(&[^\]]+)\]:(.+)$/.exec(matcher);
  if (!match) return undefined;
  const template = match[1].replace(/_/g, ' ');
  return { matcher: match[2], selector: (selector) => template.replace(/&/g, selector) };
};

/** Blade's breakpoints, mobile first: `m:p-4` → `@media (min-width: 768px)` */
const breakpointVariant: Variant = (matcher) => {
  const [name, ...rest] = matcher.split(':');
  if (rest.length === 0 || !(name in breakpoints) || name === 'base') return undefined;
  return {
    matcher: rest.join(':'),
    parent: `@media (min-width: ${breakpoints[name as keyof typeof breakpoints]}px)`,
  };
};

const motionReduceVariant: Variant = (matcher) => {
  if (!matcher.startsWith('motion-reduce:')) return undefined;
  return {
    matcher: matcher.slice('motion-reduce:'.length),
    parent: '@media (prefers-reduced-motion: reduce)',
  };
};

/** `!border-thin` → `border-width: 1px !important` */
const importantVariant: Variant = (matcher) => {
  if (!matcher.startsWith('!')) return undefined;
  return {
    matcher: matcher.slice(1),
    body: (body) => {
      for (const entry of body) {
        if (entry[1] != null && !String(entry[1]).endsWith('!important')) {
          entry[1] = `${entry[1]} !important`;
        }
      }
      return body;
    },
  };
};

const preflights = [
  // Borders are opt-in per side: `border-t-thin border-solid` draws only the top edge
  { getCSS: () => '*, ::before, ::after { border-width: 0; }' },
  // Buttons show they are pressable, as the browser leaves them on the arrow
  { getCSS: () => 'button, [role="button"] { cursor: pointer; } :disabled { cursor: default; }' },
  {
    getCSS: () =>
      Object.entries(keyframes)
        .map(([name, frames]) => `@keyframes ${name} { ${frames} }`)
        .join('\n'),
  },
];

export default defineConfig({
  presets: [],
  separators: [':'],
  rules: [
    ...getColorRules(),
    ...colorKeywordRules,
    ...spacingRules,
    ...sizeRules,
    ...fractionRules,
    ...borderRules,
    ...effectRules,
    ...opacityRules,
    ...zIndexRules,
    ...transformRules,
    ...transitionRules,
    ...visualRules,
    ...animationRules,
    ...interactionRules,
    ...typographyRules,
    ...textRules,
    ...layoutRules,
    ...moreLayoutRules,
    arbitraryPropertyRule,
  ],
  shortcuts,
  // Multi-pass, so variants chain: `hover:before:`, `data-[state=closed]:data-[side=ahead]:`
  variants: [
    importantVariant,
    selectorVariant,
    groupPeerVariant,
    dataVariant,
    breakpointVariant,
    motionReduceVariant,
    pseudoClassVariant,
  ].map((match): Variant => ({ match, multiPass: true })),
  preflights,
});
