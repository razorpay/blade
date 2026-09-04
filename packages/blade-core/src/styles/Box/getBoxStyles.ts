/**
 * Box style engine (framework-agnostic).
 *
 * Box is the layout primitive of Blade. Unlike CVA components it has no fixed
 * variant matrix — it maps ~95 responsive props to CSS. This engine resolves
 * those props into a list of **utility class names** (see the generated
 * `BOX-UTILITIES` block in `blade-core/src/tokens/theme.css`).
 *
 * Per the human-approved delivery decision, Box emits **utility classes only** —
 * it never emits an inline `style` attribute. Token-based values (spacing,
 * colors, border radius/width, elevation) and CSS keyword enums are covered
 * comprehensively, at every breakpoint. Truly arbitrary values (`437px`,
 * `calc(...)`, `clipPath`, `transform`, `transition`, raw colors, grid
 * templates, numeric `order`/`zIndex`/`flexBasis`, etc.) cannot be represented
 * as static utility classes and are a documented limitation: they are skipped.
 *
 * IMPORTANT: The class-name patterns below MUST stay in sync with the CSS
 * generator at `blade-core/scripts/generate-box-utilities.mjs`.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BoxStyleInput = Record<string, any>;

type Breakpoint = 'base' | 'xs' | 's' | 'm' | 'l' | 'xl';

const BREAKPOINTS: readonly { key: Breakpoint; prefix: string }[] = [
  { key: 'base', prefix: '' },
  { key: 'xs', prefix: 'xs-' },
  { key: 's', prefix: 's-' },
  { key: 'm', prefix: 'm-' },
  { key: 'l', prefix: 'l-' },
  { key: 'xl', prefix: 'xl-' },
];

/** Keyword spacing values that map to utility classes (dimensions/offsets). */
const DIMENSION_KEYWORDS: Record<string, string> = {
  auto: 'auto',
  '100%': 'full',
  'fit-content': 'fit',
  'min-content': 'min',
  'max-content': 'max',
};

const Z_INDEX_VALUES = new Set(['auto', '0', '1', '10', '20', '30', '40', '50']);
const FLEX_VALUES = new Set(['1', 'auto', 'none', 'initial']);
const FLEX_GROW_SHRINK_VALUES = new Set(['0', '1']);

const isResponsiveObject = (value: unknown): boolean =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/** Extracts the value for a given breakpoint from a (possibly responsive) prop. */
const getResponsiveValue = (value: unknown, breakpoint: Breakpoint): unknown => {
  if (value === undefined || value === null) return undefined;
  if (isResponsiveObject(value)) {
    return (value as Record<string, unknown>)[breakpoint];
  }
  // Bare value / array only applies at the base breakpoint.
  return breakpoint === 'base' ? value : undefined;
};

const isSpacingToken = (value: unknown): value is string =>
  typeof value === 'string' && value.startsWith('spacing.');

const spacingSuffix = (value: string): string => `spacing-${value.slice('spacing.'.length)}`;

const kebabCase = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

type Classes = string[];

const pushSpacing = (
  classes: Classes,
  prefix: string,
  base: string,
  value: unknown,
  keywords?: Record<string, string>,
): void => {
  if (value === undefined || value === null || typeof value === 'object') return;
  if (isSpacingToken(value)) {
    classes.push(`${prefix}${base}-${spacingSuffix(value)}`);
    return;
  }
  if (keywords && typeof value === 'string' && keywords[value]) {
    classes.push(`${prefix}${base}-${keywords[value]}`);
  }
  // Arbitrary values (px, %, calc, ...) are a documented limitation — skipped.
};

const pushEnum = (classes: Classes, prefix: string, base: string, value: unknown): void => {
  if (value === undefined || value === null) return;
  classes.push(`${prefix}${base}-${value}`);
};

const pushBackground = (classes: Classes, prefix: string, value: unknown): void => {
  if (typeof value !== 'string') return;
  if (value === 'transparent') {
    classes.push(`${prefix}background-transparent`);
    return;
  }
  if (value.includes('.')) {
    classes.push(`${prefix}background-${value.replace(/\./g, '-')}`);
  }
  // Raw CSS colors are a documented limitation — skipped.
};

const pushTokenColor = (classes: Classes, prefix: string, base: string, value: unknown): void => {
  if (typeof value !== 'string' || !value.includes('.')) return;
  classes.push(`${prefix}${base}-${value.replace(/\./g, '-')}`);
};

const pushGlobalProps = (props: BoxStyleInput, prefix: string, breakpoint: Breakpoint): Classes => {
  const classes: Classes = [];
  const r = (value: unknown): unknown => getResponsiveValue(value, breakpoint);

  // Layout
  pushEnum(classes, prefix, 'display', r(props.display));
  pushEnum(classes, prefix, 'overflow', r(props.overflow));
  pushEnum(classes, prefix, 'overflow-x', r(props.overflowX));
  pushEnum(classes, prefix, 'overflow-y', r(props.overflowY));
  pushEnum(classes, prefix, 'text-align', r(props.textAlign));
  pushEnum(classes, prefix, 'white-space', r(props.whiteSpace));
  pushEnum(classes, prefix, 'visibility', r(props.visibility));
  pushEnum(classes, prefix, 'pointer-events', r(props.pointerEvents));
  pushEnum(classes, prefix, 'position', r(props.position));

  // Dimensions
  pushSpacing(classes, prefix, 'width', r(props.width), DIMENSION_KEYWORDS);
  pushSpacing(classes, prefix, 'min-width', r(props.minWidth), DIMENSION_KEYWORDS);
  pushSpacing(classes, prefix, 'max-width', r(props.maxWidth), DIMENSION_KEYWORDS);
  pushSpacing(classes, prefix, 'height', r(props.height), DIMENSION_KEYWORDS);
  pushSpacing(classes, prefix, 'min-height', r(props.minHeight), DIMENSION_KEYWORDS);
  pushSpacing(classes, prefix, 'max-height', r(props.maxHeight), DIMENSION_KEYWORDS);

  // Position offsets
  const autoKeyword = { auto: 'auto' };
  pushSpacing(classes, prefix, 'top', r(props.top), autoKeyword);
  pushSpacing(classes, prefix, 'right', r(props.right), autoKeyword);
  pushSpacing(classes, prefix, 'bottom', r(props.bottom), autoKeyword);
  pushSpacing(classes, prefix, 'left', r(props.left), autoKeyword);

  // Flexbox
  pushEnum(classes, prefix, 'flex-direction', r(props.flexDirection));
  pushEnum(classes, prefix, 'flex-wrap', r(props.flexWrap));
  pushEnum(classes, prefix, 'align-items', r(props.alignItems));
  pushEnum(classes, prefix, 'align-content', r(props.alignContent));
  pushEnum(classes, prefix, 'align-self', r(props.alignSelf));
  pushEnum(classes, prefix, 'justify-items', r(props.justifyItems));
  pushEnum(classes, prefix, 'justify-content', r(props.justifyContent));
  pushEnum(classes, prefix, 'justify-self', r(props.justifySelf));
  pushEnum(classes, prefix, 'place-items', r(props.placeItems));
  pushEnum(classes, prefix, 'place-self', r(props.placeSelf));

  const flexValue = r(props.flex);
  if (flexValue !== undefined && flexValue !== null && FLEX_VALUES.has(String(flexValue))) {
    classes.push(`${prefix}flex-${flexValue}`);
  }
  const flexGrow = r(props.flexGrow);
  if (
    flexGrow !== undefined &&
    flexGrow !== null &&
    FLEX_GROW_SHRINK_VALUES.has(String(flexGrow))
  ) {
    classes.push(`${prefix}flex-grow-${flexGrow}`);
  }
  const flexShrink = r(props.flexShrink);
  if (
    flexShrink !== undefined &&
    flexShrink !== null &&
    FLEX_GROW_SHRINK_VALUES.has(String(flexShrink))
  ) {
    classes.push(`${prefix}flex-shrink-${flexShrink}`);
  }

  const zIndex = r(props.zIndex);
  if (zIndex !== undefined && zIndex !== null && Z_INDEX_VALUES.has(String(zIndex))) {
    classes.push(`${prefix}z-index-${zIndex}`);
  }

  // Spacing — padding (shorthand + x/y + sides, with side fallbacks)
  pushSpacing(classes, prefix, 'padding', r(props.padding));
  pushSpacing(classes, prefix, 'padding-x', r(props.paddingX));
  pushSpacing(classes, prefix, 'padding-y', r(props.paddingY));
  pushSpacing(classes, prefix, 'padding-top', r(props.paddingTop ?? props.paddingY));
  pushSpacing(classes, prefix, 'padding-bottom', r(props.paddingBottom ?? props.paddingY));
  pushSpacing(classes, prefix, 'padding-left', r(props.paddingLeft ?? props.paddingX));
  pushSpacing(classes, prefix, 'padding-right', r(props.paddingRight ?? props.paddingX));

  // Spacing — margin (shorthand + x/y + sides, with side fallbacks)
  pushSpacing(classes, prefix, 'margin', r(props.margin), autoKeyword);
  pushSpacing(classes, prefix, 'margin-x', r(props.marginX), autoKeyword);
  pushSpacing(classes, prefix, 'margin-y', r(props.marginY), autoKeyword);
  pushSpacing(classes, prefix, 'margin-top', r(props.marginTop ?? props.marginY), autoKeyword);
  pushSpacing(
    classes,
    prefix,
    'margin-bottom',
    r(props.marginBottom ?? props.marginY),
    autoKeyword,
  );
  pushSpacing(classes, prefix, 'margin-left', r(props.marginLeft ?? props.marginX), autoKeyword);
  pushSpacing(classes, prefix, 'margin-right', r(props.marginRight ?? props.marginX), autoKeyword);

  // Gap
  pushSpacing(classes, prefix, 'gap', r(props.gap));
  pushSpacing(classes, prefix, 'gap-y', r(props.rowGap));
  pushSpacing(classes, prefix, 'gap-x', r(props.columnGap));

  // Background & border color (token colors are base-only to bound generated CSS)
  if (breakpoint === 'base') {
    pushBackground(classes, prefix, r(props.backgroundColor));
    pushTokenColor(classes, prefix, 'border', r(props.borderColor));
  }
  pushEnum(classes, prefix, 'background-repeat', r(props.backgroundRepeat));
  pushEnum(classes, prefix, 'background-size', r(props.backgroundSize));
  pushEnum(classes, prefix, 'background-origin', r(props.backgroundOrigin));
  pushEnum(classes, prefix, 'background-position', r(props.backgroundPosition));

  // Border radius / width (global)
  pushEnum(classes, prefix, 'border-radius', r(props.borderRadius));
  pushEnum(classes, prefix, 'border-width', r(props.borderWidth));
  pushEnum(classes, prefix, 'border-style', r(props.borderStyle));

  // Elevation
  const elevation = r(props.elevation);
  if (typeof elevation === 'string' && !props.$isCard) {
    classes.push(`${prefix}elevation-${kebabCase(elevation)}`);
  }

  return classes;
};

/** Side props are resolved at the base breakpoint only (rarely responsive). */
const pushSideProps = (props: BoxStyleInput): Classes => {
  const classes: Classes = [];
  const base = (value: unknown): unknown => getResponsiveValue(value, 'base');

  pushTokenColor(classes, '', 'border-top', base(props.borderTopColor));
  pushTokenColor(classes, '', 'border-right', base(props.borderRightColor));
  pushTokenColor(classes, '', 'border-bottom', base(props.borderBottomColor));
  pushTokenColor(classes, '', 'border-left', base(props.borderLeftColor));

  pushEnum(classes, '', 'border-top-width', base(props.borderTopWidth));
  pushEnum(classes, '', 'border-right-width', base(props.borderRightWidth));
  pushEnum(classes, '', 'border-bottom-width', base(props.borderBottomWidth));
  pushEnum(classes, '', 'border-left-width', base(props.borderLeftWidth));

  pushEnum(classes, '', 'border-top-left-radius', base(props.borderTopLeftRadius));
  pushEnum(classes, '', 'border-top-right-radius', base(props.borderTopRightRadius));
  pushEnum(classes, '', 'border-bottom-right-radius', base(props.borderBottomRightRadius));
  pushEnum(classes, '', 'border-bottom-left-radius', base(props.borderBottomLeftRadius));

  return classes;
};

/** Applies the `borderStyle: 'solid'` default when a border is present (matches React). */
const pushBorderStyleDefaults = (props: BoxStyleInput): Classes => {
  const classes: Classes = [];
  const hasBorder = Boolean(props.borderWidth || props.borderColor || props.border);

  if (!props.borderStyle && hasBorder) {
    classes.push('border-style-solid');
  }

  if (!hasBorder) {
    const sides: [string, boolean][] = [
      ['top', Boolean(props.borderTop || props.borderTopColor || props.borderTopWidth)],
      ['right', Boolean(props.borderRight || props.borderRightColor || props.borderRightWidth)],
      ['bottom', Boolean(props.borderBottom || props.borderBottomColor || props.borderBottomWidth)],
      ['left', Boolean(props.borderLeft || props.borderLeftColor || props.borderLeftWidth)],
    ];
    for (const [side, present] of sides) {
      const explicit = props[`border${side[0].toUpperCase()}${side.slice(1)}Style`];
      if (explicit) {
        pushEnum(classes, '', `border-${side}-style`, getResponsiveValue(explicit, 'base'));
      } else if (present) {
        classes.push(`border-${side}-style-solid`);
      }
    }
  }

  return classes;
};

/**
 * Resolves Box props into a list of utility class names (all breakpoints).
 */
export const getBoxClasses = (props: BoxStyleInput): string[] => {
  const classes: Classes = [];

  for (const { key, prefix } of BREAKPOINTS) {
    classes.push(...pushGlobalProps(props, prefix, key));
  }

  classes.push(...pushSideProps(props));
  classes.push(...pushBorderStyleDefaults(props));

  return classes;
};

/**
 * Resolves Box props into a single space-separated class string.
 */
export const getBoxStyles = (props: BoxStyleInput): { classes: string[] } => {
  return { classes: getBoxClasses(props) };
};
