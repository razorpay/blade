/**
 * Blade Design System — Tailwind plugin for the irreducible "hard cases" (HAND-AUTHORED).
 *
 * ~90% of Blade's rules are atomic-friendly and expressed as CVA utility strings. The remaining bits
 * cannot be represented as plain utilities and are emitted here as COMPONENT classes so they live
 * inside the SAME Tailwind build as everything else (no separate stylesheet, no consumer-specific
 * file). CVA references these classes by literal name (e.g. `blade-btn`, `blade-btn-primary`).
 *
 * Everything references the same `var(--…)` tokens the preset maps + `theme.css` defines, so runtime
 * dark/brand theming flows through unchanged. Emitted into Tailwind's `components` layer (lower
 * precedence than `utilities`), so a styleOverride/styled-prop utility still wins.
 *
 * Button (Phase 1 pilot) is a faithful port of `src/styles/Button/button.module.css`: the
 * `--btn-accent-*` var bundles, the radial-highlight `::before`, the multi-layer inset box-shadow /
 * focus-ring stacks, the definite/indefinite loaders, and the `@keyframes` + `prefers-reduced-motion`.
 */
const plugin = require('tailwindcss/plugin');

// Shared box-shadow stacks for the filled (primary) button, parameterized by --btn-accent-* vars.
const FILLED_BEVEL = 'var(--btn-accent-bevel, var(--interactive-border-static-white-faded))';
const filledShadow = (ringLayer) =>
  `inset 0 -1.5px 0 0 var(--btn-accent-border-highlighted), inset 0 0 0 0.5px ${ringLayer}, inset 0 1.5px 0 0 ${FILLED_BEVEL}, inset 0 -2px 0 0 ${FILLED_BEVEL}`;
const FILLED_DEFAULT_SHADOW = filledShadow('var(--btn-accent-border-default)');
const FILLED_HIGHLIGHTED_SHADOW = filledShadow('var(--btn-accent-border-highlighted)');
const FILLED_FOCUS_SHADOW = `0px 0px 0px 4px var(--surface-border-primary-muted), ${FILLED_HIGHLIGHTED_SHADOW}`;

// Shared box-shadow stacks for the outlined (secondary/tertiary) button.
const OUTLINED_DEFAULT_SHADOW =
  'inset 0 -1px 0.5px 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 1px var(--interactive-border-gray-default), inset 0 -1.5px 0 0 var(--interactive-border-gray-default)';
const OUTLINED_HIGHLIGHTED_SHADOW =
  'inset 0 -1px 0.5px 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 1px var(--interactive-border-gray-highlighted), inset 0 -1.5px 0 0 var(--interactive-border-gray-default)';
const OUTLINED_FOCUS_SHADOW = `0px 0px 0px 4px var(--surface-border-primary-muted), ${OUTLINED_HIGHLIGHTED_SHADOW}`;

// Radial highlight used by filled/white primary buttons via ::before.
const RADIAL_HIGHLIGHT_BEFORE = {
  content: '""',
  position: 'absolute',
  inset: '0',
  zIndex: '0',
  pointerEvents: 'none',
  borderRadius: 'inherit',
  backgroundImage:
    'radial-gradient(var(--btn-gradient-size, 64px) var(--btn-gradient-size, 64px) at 0% 0%, var(--interactive-background-static-white-faded) 0%, transparent 100%)',
  opacity: '1',
  transitionProperty: 'opacity',
  transitionTimingFunction: 'var(--easing-standard)',
  transitionDuration: 'var(--duration-xquick)',
};

const buttonComponents = {
  '.blade-btn': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    border: 'none',
    outline: 'none',
    textDecoration: 'none',
    overflow: 'hidden',
    borderRadius: 'var(--border-radius-small)',
    transitionProperty: 'background-color, box-shadow',
    transitionTimingFunction: 'var(--easing-standard)',
    transitionDuration: 'var(--duration-xquick)',
    fontFamily: 'var(--font-family-text)',
    fontWeight: 'var(--font-weight-medium)',
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    '&[disabled]': { cursor: 'not-allowed' },
  },

  // Sizes — each sets --btn-gradient-size for the filled variant's radial highlight.
  '.blade-btn-xsmall': {
    '--btn-gradient-size': '48px',
    minHeight: '28px',
    paddingLeft: 'var(--spacing-3)',
    paddingRight: 'var(--spacing-3)',
    paddingTop: '0',
    paddingBottom: '0',
  },
  '.blade-btn-small': {
    '--btn-gradient-size': '56px',
    minHeight: '32px',
    paddingLeft: 'var(--spacing-3)',
    paddingRight: 'var(--spacing-3)',
    paddingTop: '0',
    paddingBottom: '0',
  },
  '.blade-btn-medium': {
    '--btn-gradient-size': '64px',
    minHeight: '36px',
    paddingLeft: 'var(--spacing-4)',
    paddingRight: 'var(--spacing-4)',
    paddingTop: '0',
    paddingBottom: '0',
  },
  '.blade-btn-large': {
    '--btn-gradient-size': '72px',
    minHeight: '48px',
    borderRadius: 'var(--border-radius-medium)',
    paddingLeft: 'var(--spacing-5)',
    paddingRight: 'var(--spacing-5)',
    paddingTop: '0',
    paddingBottom: '0',
  },

  // Icon-only buttons.
  '.blade-btn-icon-only': {
    padding: '0',
    width: 'auto',
    height: 'auto',
    '&.blade-btn-xsmall': { width: '28px', height: '28px' },
    '&.blade-btn-small': { width: '32px', height: '32px' },
    '&.blade-btn-medium': { width: '36px', height: '36px' },
    '&.blade-btn-large': { width: '48px', height: '48px' },
  },

  // Accent color definitions — CSS custom properties that parameterize the filled pattern.
  '.blade-btn-color-primary': {
    '--btn-accent-bg-default': 'var(--interactive-background-primary-default)',
    '--btn-accent-bg-highlighted': 'var(--interactive-background-primary-highlighted)',
    '--btn-accent-bg-disabled': 'var(--interactive-background-primary-disabled)',
    '--btn-accent-border-default': 'var(--interactive-border-primary-default)',
    '--btn-accent-border-highlighted': 'var(--interactive-border-primary-highlighted)',
  },
  '.blade-btn-color-positive': {
    '--btn-accent-bg-default': 'var(--interactive-background-positive-default)',
    '--btn-accent-bg-highlighted': 'var(--interactive-background-positive-highlighted)',
    '--btn-accent-bg-disabled': 'var(--interactive-background-positive-disabled)',
    '--btn-accent-border-default': 'var(--interactive-border-positive-default)',
    '--btn-accent-border-highlighted': 'var(--interactive-border-positive-highlighted)',
  },
  '.blade-btn-color-negative': {
    '--btn-accent-bg-default': 'var(--interactive-background-negative-default)',
    '--btn-accent-bg-highlighted': 'var(--interactive-background-negative-highlighted)',
    '--btn-accent-bg-disabled': 'var(--interactive-background-negative-disabled)',
    '--btn-accent-border-default': 'var(--interactive-border-negative-default)',
    '--btn-accent-border-highlighted': 'var(--interactive-border-negative-highlighted)',
  },
  '.blade-btn-color-neutral': {
    '--btn-accent-bg-default': 'var(--interactive-background-neutral-default)',
    '--btn-accent-bg-highlighted': 'var(--interactive-background-neutral-highlighted)',
    '--btn-accent-bg-disabled': 'var(--interactive-background-neutral-disabled)',
    '--btn-accent-border-default': 'var(--interactive-border-neutral-default)',
    '--btn-accent-border-highlighted': 'var(--interactive-border-neutral-highlighted)',
    '--btn-accent-bevel': 'var(--interactive-border-static-white-faded-highlighted)',
  },

  // Filled button (primary variant) — shared across accent colors.
  '.blade-btn-color-primary.blade-btn-primary, .blade-btn-color-positive.blade-btn-primary, .blade-btn-color-negative.blade-btn-primary, .blade-btn-color-neutral.blade-btn-primary': {
    backgroundColor: 'var(--btn-accent-bg-default)',
    boxShadow: FILLED_DEFAULT_SHADOW,
    '&::before': RADIAL_HIGHLIGHT_BEFORE,
    '&:hover:not([disabled])': {
      backgroundColor: 'var(--btn-accent-bg-highlighted)',
      boxShadow: FILLED_HIGHLIGHTED_SHADOW,
      '&::before': { opacity: '0' },
    },
    '&:active:not([disabled])': {
      backgroundColor: 'var(--btn-accent-bg-highlighted)',
      boxShadow: FILLED_HIGHLIGHTED_SHADOW,
      '&::before': { opacity: '0' },
    },
    '&:focus-visible:not([disabled])': {
      backgroundColor: 'var(--btn-accent-bg-highlighted)',
      outline: '1px solid var(--surface-background-primary-subtle)',
      boxShadow: FILLED_FOCUS_SHADOW,
      '&::before': { opacity: '0' },
    },
    '&[disabled]': {
      backgroundColor: 'var(--btn-accent-bg-disabled)',
      boxShadow: 'none',
      '&::before': { opacity: '0' },
    },
  },

  // Outlined button (secondary/tertiary) — shared across accent colors.
  '.blade-btn-color-primary.blade-btn-secondary, .blade-btn-color-primary.blade-btn-tertiary, .blade-btn-color-positive.blade-btn-secondary, .blade-btn-color-negative.blade-btn-secondary, .blade-btn-color-neutral.blade-btn-secondary, .blade-btn-color-neutral.blade-btn-tertiary': {
    backgroundColor: 'var(--surface-background-gray-intense)',
    boxShadow: OUTLINED_DEFAULT_SHADOW,
    '&:hover:not([disabled])': {
      backgroundColor: 'var(--surface-background-gray-intense)',
      boxShadow: OUTLINED_HIGHLIGHTED_SHADOW,
    },
    '&:active:not([disabled])': {
      backgroundColor: 'var(--surface-background-gray-intense)',
      boxShadow: OUTLINED_HIGHLIGHTED_SHADOW,
    },
    '&:focus-visible:not([disabled])': {
      backgroundColor: 'var(--surface-background-gray-intense)',
      outline: '1px solid var(--surface-background-primary-subtle)',
      boxShadow: OUTLINED_FOCUS_SHADOW,
    },
    '&[disabled]': {
      backgroundColor: 'var(--interactive-background-static-white-ghost)',
      boxShadow: 'inset 0 0 0 1px var(--interactive-border-gray-disabled)',
    },
  },

  // Neutral's focus ring uses a neutral-tinted outer ring instead of the shared blue ring.
  '.blade-btn-color-neutral.blade-btn-primary:focus-visible:not([disabled])': {
    boxShadow: `0px 0px 0px 4px var(--interactive-border-neutral-faded), ${FILLED_HIGHLIGHTED_SHADOW}`,
  },
  '.blade-btn-color-neutral.blade-btn-secondary:focus-visible:not([disabled]), .blade-btn-color-neutral.blade-btn-tertiary:focus-visible:not([disabled])': {
    boxShadow: `0px 0px 0px 4px var(--interactive-border-neutral-faded), ${OUTLINED_HIGHLIGHTED_SHADOW}`,
  },

  // Color variant: White.
  '.blade-btn-color-white.blade-btn-primary': {
    backgroundColor: 'var(--interactive-background-static-white-default)',
    boxShadow:
      'inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 0.5px var(--interactive-border-static-white-default)',
    '&::before': RADIAL_HIGHLIGHT_BEFORE,
    '&:hover:not([disabled])': {
      backgroundColor: 'var(--interactive-background-static-white-highlighted)',
      boxShadow:
        'inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 0.5px var(--interactive-border-static-white-default)',
      '&::before': { opacity: '0' },
    },
    '&:active:not([disabled])': {
      backgroundColor: 'var(--interactive-background-static-white-highlighted)',
      boxShadow:
        'inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 0.5px var(--interactive-border-static-white-default)',
      '&::before': { opacity: '0' },
    },
    '&:focus-visible:not([disabled])': {
      backgroundColor: 'var(--interactive-background-static-white-highlighted)',
      outline: '1px solid var(--surface-background-primary-subtle)',
      boxShadow:
        '0px 0px 0px 4px var(--surface-border-primary-muted), inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 0.5px var(--interactive-border-static-white-default)',
      '&::before': { opacity: '0' },
    },
    '&[disabled]': {
      backgroundColor: 'var(--interactive-background-static-white-disabled)',
      boxShadow: 'none',
      '&::before': { opacity: '0' },
    },
  },
  '.blade-btn-color-white.blade-btn-secondary, .blade-btn-color-white.blade-btn-tertiary': {
    backgroundColor: 'var(--interactive-background-static-white-faded)',
    boxShadow:
      'inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 1px var(--interactive-border-static-white-highlighted)',
    '&:hover:not([disabled])': {
      backgroundColor: 'var(--interactive-background-static-black-faded)',
      boxShadow:
        'inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 1px var(--interactive-border-static-white-highlighted)',
    },
    '&:active:not([disabled])': {
      backgroundColor: 'var(--interactive-background-static-black-faded)',
      boxShadow:
        'inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 1px var(--interactive-border-static-white-highlighted)',
    },
    '&:focus-visible:not([disabled])': {
      backgroundColor: 'var(--interactive-background-static-black-faded)',
      outline: '1px solid var(--surface-background-primary-subtle)',
      boxShadow:
        '0px 0px 0px 4px var(--surface-border-primary-muted), inset 0 -1.5px 0 0 var(--interactive-border-static-black-faded-highlighted), inset 0 0 0 1px var(--interactive-border-static-white-highlighted)',
    },
    '&[disabled]': {
      backgroundColor: 'var(--interactive-background-gray-disabled)',
      boxShadow: 'inset 0 0 0 1px var(--interactive-border-static-white-disabled)',
    },
  },

  // Color variant: Transparent (only for tertiary).
  '.blade-btn-color-transparent.blade-btn-tertiary': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '&:hover:not([disabled])': { backgroundColor: 'var(--interactive-background-gray-faded)' },
    '&:active:not([disabled])': { backgroundColor: 'var(--interactive-background-gray-faded)' },
    '&:focus-visible:not([disabled])': {
      backgroundColor: 'var(--interactive-background-gray-faded)',
      outline: '1px solid var(--surface-background-primary-subtle)',
      boxShadow: '0px 0px 0px 4px var(--surface-border-primary-muted)',
    },
    '&[disabled]': {
      backgroundColor: 'var(--interactive-background-gray-disabled)',
      boxShadow: 'none',
    },
  },

  // Content wrapper.
  '.blade-btn-content': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1',
    position: 'relative',
    zIndex: '1',
    transitionProperty: 'color, fill, opacity',
    transitionTimingFunction: 'var(--easing-standard)',
    transitionDuration: 'var(--duration-xquick)',
  },
  '.blade-btn-content.blade-btn-loading': { opacity: '0' },

  // Icon wrapper.
  '.blade-btn-icon': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
  },

  // Avatar group inside large button.
  '.blade-btn-avatar-group': {
    display: 'flex',
    alignItems: 'center',
    flexShrink: '0',
    paddingLeft: 'var(--spacing-3)',
  },

  // Animated content wrapper (scale animation).
  '.blade-btn-animated-content': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1',
    position: 'relative',
    transform: 'scale(1)',
    transitionProperty: 'transform',
    transitionTimingFunction: 'var(--easing-standard)',
    transitionDuration: 'var(--duration-xquick)',
  },
  '.blade-btn-pressed': { transform: 'scale(0.95)' },

  // Loading state (ancestor form).
  '.blade-btn-loading .blade-btn-content': { opacity: '0' },

  // Indefinite loader — pure-CSS 3 dots.
  '.blade-btn-dots-loader': {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '1',
  },
  '.blade-btn-dots-loader::before': {
    content: '""',
    width: '24px',
    aspectRatio: '2',
    '--_dots-gradient':
      'no-repeat radial-gradient(circle closest-side, var(--btn-dots-color, currentColor) 90%, transparent)',
    background:
      'var(--_dots-gradient) 0% 50%, var(--_dots-gradient) 50% 50%, var(--_dots-gradient) 100% 50%',
    backgroundSize: 'calc(100% / 3) 50%',
    animation: 'btnDots 1s infinite linear',
  },
  '@keyframes btnDots': {
    '20%': { backgroundPosition: '0% 0%, 50% 50%, 100% 50%' },
    '40%': { backgroundPosition: '0% 100%, 50% 0%, 100% 50%' },
    '60%': { backgroundPosition: '0% 50%, 50% 100%, 100% 0%' },
    '80%': { backgroundPosition: '0% 50%, 50% 50%, 100% 100%' },
  },

  // Definite loader — the button keeps its normal filled treatment while [disabled] during load.
  ".blade-btn-primary.blade-btn-definite-loading[data-definite-loading='true'][disabled]": {
    backgroundColor: 'var(--btn-accent-bg-default)',
    boxShadow: FILLED_DEFAULT_SHADOW,
    '&::before': { opacity: '1' },
  },
  '.blade-btn-progress-overlay': {
    position: 'absolute',
    top: '0',
    left: '0',
    bottom: '0',
    right: '0',
    zIndex: '0',
    overflow: 'hidden',
    pointerEvents: 'none',
    borderRadius: 'inherit',
  },
  '.blade-btn-primary .blade-btn-progress-overlay::after': {
    content: '""',
    position: 'absolute',
    inset: '0',
    borderRadius: 'inherit',
    pointerEvents: 'none',
    boxShadow: FILLED_DEFAULT_SHADOW,
  },
  '.blade-btn-progress-overlay-fill': {
    position: 'absolute',
    top: '0',
    right: '0',
    bottom: '0',
    width: '100%',
    backgroundColor: 'var(--btn-progress-surface-backing, var(--surface-background-gray-intense))',
    backgroundImage:
      'linear-gradient(var(--btn-progress-rest-color, var(--btn-accent-bg-disabled)), var(--btn-progress-rest-color, var(--btn-accent-bg-disabled)))',
    animationName: 'btnProgressRecede',
    animationDuration: 'var(--btn-progress-duration, 0ms)',
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards',
  },
  '@keyframes btnProgressRecede': {
    from: { width: '100%' },
    to: { width: '0%' },
  },

  // Visually-hidden live region for polite loading announcements.
  '.blade-btn-live-region': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  },

  // Respect reduced-motion: freeze loader animations.
  '@media (prefers-reduced-motion: reduce)': {
    '.blade-btn-dots-loader::before': { animation: 'none' },
    '.blade-btn-progress-overlay-fill': { animation: 'none', width: '0%' },
  },
};

// BaseLink — the only irreducible bit is the descendant transition (`& *`) that animates
// color/fill on the link's children (icon + text) during hover/focus. Everything else on the
// link is expressible as plain utilities on the root element.
const linkComponents = {
  '.blade-link': {
    '& *': {
      transitionProperty: 'color, fill',
      transitionTimingFunction: 'var(--easing-standard)',
      transitionDuration: 'var(--duration-2xquick)',
    },
  },
};

// AnnouncementBanner — its background / text / icon colors swap to DIFFERENT tokens in dark mode
// (not the same var flipping), under BOTH the scoped `[data-blade-color-scheme='dark']` and the
// legacy `body[data-theme='dark']` selectors. A `bg-*`/`text-*` utility (utilities layer) would beat
// a component-layer dark override, and the preset's `dark:` variant only covers the scoped selector,
// so light+dark are emitted together here (no competing utility) to preserve dual-selector support.
const DARK_SCOPES = (selector) =>
  `body[data-theme='dark'] ${selector}, :root [data-blade-color-scheme='dark'] ${selector}`;

const announcementBannerComponents = {
  '.blade-announcement-banner-surface': {
    backgroundColor: 'var(--surface-background-gray-subtle)',
  },
  [DARK_SCOPES('.blade-announcement-banner-surface')]: {
    backgroundColor: 'var(--interactive-background-static-black-faded-highlighted)',
  },
  '.blade-announcement-banner-text': { color: 'var(--surface-text-gray-subtle)' },
  [DARK_SCOPES('.blade-announcement-banner-text')]: {
    color: 'var(--surface-text-static-white-subtle)',
  },
  '.blade-announcement-banner-icon': { color: 'var(--surface-icon-gray-subtle)' },
  [DARK_SCOPES('.blade-announcement-banner-icon')]: {
    color: 'var(--surface-icon-static-white-subtle)',
  },
};

// Breadcrumb — the separator show/hide rules use `:last-child` + child combinators, and the stepper
// variant widens the item gap via a descendant selector. These structural relationships can't be
// expressed as utilities on a single element, so the structural classes live here as component
// classes (the stepper gap override wins by descendant-selector specificity, in the same layer).
// The stepper pill's hover/focus tints ARE plain pseudo-variants and stay in the CVA utility strings.
const breadcrumbComponents = {
  '.blade-breadcrumb-nav': { display: 'block' },
  '.blade-breadcrumb-list': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-2)',
    alignItems: 'center',
    listStyle: 'none',
    margin: 'var(--spacing-0)',
    padding: 'var(--spacing-0)',
  },
  '.blade-breadcrumb-list-item': {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  '.blade-breadcrumb-separator': { display: 'flex', alignItems: 'center' },
  '.blade-breadcrumb-list-item:last-child > .blade-breadcrumb-separator': { display: 'none' },
  '.blade-breadcrumb-show-last-separator > .blade-breadcrumb-list-item:last-child > .blade-breadcrumb-separator':
    { display: 'flex' },
  '.blade-breadcrumb-current-page': {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  // Stepper variant widens the gap (later source order / descendant specificity wins).
  '.blade-breadcrumb-list-stepper': { gap: 'var(--spacing-7)' },
  '.blade-breadcrumb-list-stepper .blade-breadcrumb-list-item': { gap: 'var(--spacing-7)' },
};

// ActionList — the row (`.blade-actionlist-item`) carries an interactive-state stack with `:not()`
// chains on `[disabled]`/`[aria-disabled]`/`[aria-selected]` plus `:focus-visible`, and the scroll
// wrapper hides the trailing section separator via a `[role]`-based descendant selector. Neither is
// expressible as utilities on a single element, so both live here; layout stays atomic in the CVA.
const actionListComponents = {
  '.blade-actionlist-scroll [role=\'group\']:last-child > [role=\'separator\']:last-child': {
    display: 'none',
  },
  '.blade-actionlist-item': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    marginTop: 'var(--spacing-1)',
    marginBottom: 'var(--spacing-1)',
    padding: 'var(--spacing-3)',
    borderWidth: '0',
    borderRadius: 'var(--border-radius-small)',
    backgroundColor: 'transparent',
    textAlign: 'left',
    textDecoration: 'none',
    cursor: 'pointer',
    color: 'inherit',
    fontFamily: 'inherit',
    "&:hover:not([disabled]):not([aria-disabled='true']):not([aria-selected='true'])": {
      backgroundColor: 'var(--interactive-background-gray-default)',
    },
    '&:focus-visible': {
      outline: '4px solid var(--surface-border-primary-muted)',
      outlineOffset: '1px',
    },
    "&[aria-selected='true'], &[aria-selected='true']:hover": {
      backgroundColor: 'var(--interactive-background-gray-faded-highlighted)',
    },
    "&[disabled], &[aria-disabled='true']": { cursor: 'not-allowed' },
  },
  ".blade-actionlist-item-negative:hover:not([disabled]):not([aria-disabled='true']):not([aria-selected='true'])":
    { backgroundColor: 'var(--interactive-background-negative-faded)' },
};

// SegmentedControl — the item button carries a focus/hover/disabled state stack (including
// `:focus:not(:focus-visible)` and a selected-item hover override that must win by specificity).
// These pseudo-state relationships live here; layout/size/text stay atomic in the template classes.
const segmentedControlComponents = {
  '.blade-segmented-item': {
    appearance: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-3)',
    flex: '1',
    backgroundColor: 'transparent',
    position: 'relative',
    zIndex: '1',
    transitionProperty: 'background-color',
    transitionTimingFunction: 'var(--easing-standard)',
    transitionDuration: 'var(--duration-gentle)',
    '&:focus:not(:focus-visible)': { outline: 'none' },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: 'inset 0px 0px 0px 4px var(--surface-border-primary-muted)',
    },
    '&:disabled': { cursor: 'not-allowed', backgroundColor: 'transparent' },
    '&:hover:not(:disabled)': { backgroundColor: 'var(--interactive-background-gray-default)' },
  },
  // Selected item: hover stays transparent (the sliding indicator supplies the background).
  // Compound `.item.item-selected` beats the base `.item:hover` by specificity regardless of order.
  '.blade-segmented-item.blade-segmented-item-selected:hover:not(:disabled)': {
    backgroundColor: 'transparent',
  },
};

// AppBar — two descendant relationships that utilities can't express on a single element:
// the logo constrains any child img/svg, and the title's `flex` shorthand flips to shrink-wrap when
// the title row also holds an icon badge (kept in the component layer so the descendant override
// wins over the base). Root grid / data-sticky / responsive padding stay atomic in the CVA.
const appBarComponents = {
  '.blade-appbar-logo img, .blade-appbar-logo svg': {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '20px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  },
  '.blade-appbar-title': { flex: '1 1 0' },
  '.blade-appbar-title-row-icon-badge .blade-appbar-title': { flex: '0 1 auto' },
};

// BaseText — a zero-specificity margin reset (`:where(.base){margin:0}`) so any styled-prop margin
// utility overrides it regardless of source order. Kept as-is via `:where()`; everything else on
// BaseText is atomic.
const baseTextComponents = {
  ':where(.blade-text-base)': { margin: '0' },
};

module.exports = plugin(function bladeHardCases({ addComponents }) {
  addComponents(buttonComponents);
  addComponents(linkComponents);
  addComponents(announcementBannerComponents);
  addComponents(breadcrumbComponents);
  addComponents(actionListComponents);
  addComponents(segmentedControlComponents);
  addComponents(appBarComponents);
  addComponents(baseTextComponents);
});
