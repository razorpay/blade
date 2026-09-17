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

// Spinner — the rotating box carries a `@keyframes` animation. The per-color rules resolve without
// a descendant selector: the color is set on the root as a `text-*` utility and the SVG inherits it
// via `fill=currentColor`, so only the animation lives here.
const spinnerComponents = {
  '.blade-spinner-box': {
    padding: '1px',
    width: 'max-content',
    display: 'inline-flex',
    animation: 'spinner-rotate var(--duration-2xgentle) var(--easing-overshoot) infinite',
  },
  '@keyframes spinner-rotate': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
};

// Skeleton — the base composes two `@keyframes` (a one-shot fade-in + an infinite alternating pulse)
// via per-animation duration/delay/timing/iteration/direction lists that a utility can't express.
const skeletonComponents = {
  '.blade-skeleton': {
    display: 'block',
    opacity: '0',
    backgroundColor: 'var(--interactive-background-gray-default)',
    animationName: 'skeleton-fade-in, skeleton-pulse',
    animationDuration: 'var(--duration-2xgentle), 1320ms',
    animationDelay: '0ms, var(--duration-2xgentle)',
    animationTimingFunction: 'var(--easing-standard), var(--easing-standard)',
    animationIterationCount: '1, infinite',
    animationDirection: 'normal, alternate',
    animationFillMode: 'forwards',
  },
  '@keyframes skeleton-fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
  '@keyframes skeleton-pulse': {
    '0%': { backgroundColor: 'var(--interactive-background-gray-default)' },
    '25%': { backgroundColor: 'var(--interactive-background-gray-default)' },
    '100%': { backgroundColor: 'var(--interactive-background-gray-highlighted)' },
  },
};

// Switch — a faithful port of `switch.module.css`. The `size-*` modifier means different dimensions
// on the track (bare), thumb and icon (compound); the track reacts to label hover and to the hidden
// input's focus via an adjacent-sibling selector; the thumb animates through compound pressed/checked
// states; the icon fill responds to a disabled ancestor; and a `@media` block supplies mobile sizing.
// None of this is expressible as single-element utilities, so it lives here as `.blade-switch-*`.
const switchComponents = {
  '.blade-switch': { display: 'inline-block' },
  '.blade-switch-label': {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    margin: '0',
    padding: '0',
    userSelect: 'none',
    '&[data-disabled]': { cursor: 'not-allowed' },
  },
  '.blade-switch-input': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: '0',
  },
  '.blade-switch-track': {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexShrink: '0',
    pointerEvents: 'none',
    margin: 'var(--spacing-1)',
    padding: 'var(--spacing-1)',
    borderRadius: 'var(--border-radius-max)',
    transitionProperty: 'background-color, outline',
    transitionTimingFunction: 'var(--easing-standard)',
    transitionDuration: 'var(--duration-2xquick)',
  },
  // Track sizes (desktop) — bare `size-*` targets the track.
  '.blade-switch-size-small': { width: '28px', height: 'var(--spacing-5)' },
  '.blade-switch-size-medium': { width: '36px', height: 'var(--spacing-6)' },
  '.blade-switch-track.blade-switch-checked': {
    backgroundColor: 'var(--interactive-background-primary-default)',
    '&[data-disabled]': { backgroundColor: 'var(--interactive-background-primary-faded)' },
  },
  '.blade-switch-track.blade-switch-unchecked': {
    backgroundColor: 'var(--interactive-background-gray-default)',
    '&[data-disabled]': { backgroundColor: 'var(--interactive-background-gray-disabled)' },
  },
  '.blade-switch-label:hover .blade-switch-track.blade-switch-checked:not([data-disabled])': {
    backgroundColor: 'var(--interactive-background-primary-highlighted)',
  },
  '.blade-switch-label:hover .blade-switch-track.blade-switch-unchecked:not([data-disabled])': {
    backgroundColor: 'var(--interactive-background-gray-highlighted)',
  },
  '.blade-switch-input:focus-visible + .blade-switch-track': {
    outline: '4px solid var(--surface-border-primary-muted)',
    outlineOffset: '1px',
  },
  '.blade-switch-thumb': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  '.blade-switch-thumb.blade-switch-size-small': {
    width: 'var(--spacing-4)',
    height: 'var(--spacing-4)',
  },
  '.blade-switch-thumb.blade-switch-size-medium': {
    width: 'var(--spacing-5)',
    height: 'var(--spacing-5)',
  },
  '.blade-switch-animated-thumb': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    position: 'relative',
    height: '100%',
    width: '100%',
    left: '0%',
    transform: 'translateX(0%)',
    borderRadius: 'var(--border-radius-max)',
    backgroundColor: 'var(--interactive-background-static-white-default)',
    transitionProperty: 'width, left, transform, background-color',
    transitionDuration: 'var(--duration-quick)',
    transitionTimingFunction: 'var(--easing-standard)',
    willChange: 'transform, left, width',
  },
  '.blade-switch-animated-thumb.blade-switch-checked': { transform: 'translateX(100%)' },
  '.blade-switch-animated-thumb.blade-switch-pressed.blade-switch-checked': {
    width: '125%',
    left: '-39%',
  },
  '.blade-switch-animated-thumb.blade-switch-pressed.blade-switch-unchecked': {
    width: '125%',
    left: '12.5%',
  },
  '.blade-switch-animated-thumb[data-disabled]': {
    backgroundColor: 'var(--interactive-background-static-white-disabled)',
  },
  '.blade-switch-thumb-icon': {
    opacity: '0',
    transitionProperty: 'opacity',
    transitionDuration: 'var(--duration-quick)',
    transitionTimingFunction: 'var(--easing-standard)',
    transitionDelay: '0ms',
  },
  '.blade-switch-thumb-icon.blade-switch-effective-checked': {
    opacity: '1',
    transitionDelay: 'var(--delay-2xquick)',
  },
  '.blade-switch-thumb-icon path': { fill: 'var(--interactive-icon-primary-subtle)' },
  '.blade-switch-label[data-disabled] .blade-switch-thumb-icon path': {
    fill: 'var(--interactive-icon-primary-disabled)',
  },
  '.blade-switch-thumb-icon.blade-switch-size-small': { width: '6px', height: '6px' },
  '.blade-switch-thumb-icon.blade-switch-size-medium': {
    width: 'var(--spacing-3)',
    height: 'var(--spacing-3)',
  },
  '@media (max-width: 767px)': {
    '.blade-switch-size-small': { width: '36px', height: 'var(--spacing-6)' },
    '.blade-switch-size-medium': { width: '44px', height: 'var(--spacing-7)' },
    '.blade-switch-thumb.blade-switch-size-small': {
      width: 'var(--spacing-5)',
      height: 'var(--spacing-5)',
    },
    '.blade-switch-thumb.blade-switch-size-medium': {
      width: 'var(--spacing-6)',
      height: 'var(--spacing-6)',
    },
    '.blade-switch-thumb-icon.blade-switch-size-small': {
      width: 'var(--spacing-3)',
      height: 'var(--spacing-3)',
    },
    '.blade-switch-thumb-icon.blade-switch-size-medium': { width: '10px', height: '10px' },
  },
};

// IconButton — a transparent icon button whose color/background shift across
// hover/focus-visible/active/disabled per emphasis, plus a true animated `outline` focus ring and
// highlighted/moderate square-container variants. Ported verbatim as `.blade-icon-button*`.
const iconButtonComponents = {
  '.blade-icon-button': {
    border: 'none',
    padding: '0',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: 'var(--border-radius-2xsmall)',
    transitionProperty: 'color, box-shadow',
    transitionDuration: 'var(--duration-xquick)',
    transitionTimingFunction: 'var(--easing-standard)',
    '&[disabled]': { cursor: 'not-allowed' },
    '&:focus-visible': {
      outline: '4px solid var(--surface-border-primary-muted)',
      outlineOffset: '1px',
      transitionProperty: 'outline-width',
      transitionDuration: 'var(--duration-2xquick)',
      transitionTimingFunction: 'var(--easing-standard)',
      zIndex: '2',
    },
  },
  '.blade-icon-button-emphasis-intense': {
    color: 'var(--interactive-icon-gray-muted)',
    '&:hover:not([disabled]), &:focus-visible:not([disabled]), &:active:not([disabled])': {
      color: 'var(--interactive-icon-gray-subtle)',
    },
    '&[disabled]': { color: 'var(--interactive-icon-gray-disabled)' },
  },
  '.blade-icon-button-emphasis-subtle': {
    color: 'var(--interactive-icon-static-white-muted)',
    '&:hover:not([disabled]), &:focus-visible:not([disabled]), &:active:not([disabled])': {
      color: 'var(--interactive-icon-static-white-subtle)',
    },
    '&[disabled]': { color: 'var(--interactive-icon-static-white-disabled)' },
  },
  '.blade-icon-button-highlighted': { borderRadius: 'var(--border-radius-small)' },
  '.blade-icon-button-highlighted-small': { width: '24px', height: '24px' },
  '.blade-icon-button-highlighted-medium': { width: '32px', height: '32px' },
  '.blade-icon-button-highlighted-intense': {
    '&:hover:not([disabled]), &:focus-visible:not([disabled])': {
      backgroundColor: 'var(--interactive-background-gray-faded-highlighted)',
    },
  },
  '.blade-icon-button-highlighted-subtle': {
    '&:hover:not([disabled]), &:focus-visible:not([disabled])': {
      backgroundColor: 'var(--interactive-background-static-white-faded)',
    },
  },
  '.blade-icon-button-emphasis-moderate': {
    borderRadius: 'var(--border-radius-small)',
    backgroundColor: 'var(--interactive-background-static-white-faded)',
    color: 'var(--interactive-icon-static-white-normal)',
    transitionProperty: 'color, background-color',
    '&:hover:not([disabled]), &:focus-visible:not([disabled]), &:active:not([disabled])': {
      color: 'var(--interactive-icon-static-white-subtle)',
      backgroundColor: 'var(--interactive-background-static-white-faded-highlighted)',
    },
    '&[disabled]': { color: 'var(--interactive-icon-static-white-disabled)' },
  },
  '.blade-icon-button-moderate-small': { width: '24px', height: '24px' },
  '.blade-icon-button-moderate-medium': { width: '32px', height: '32px' },
};

// BaseInput — a faithful port of `baseInput.module.css`. The border is a `box-shadow` ring whose
// color/width shift across hover / `:focus-within` (via a descendant from the focus-ring wrapper) /
// error / disabled; the element styles `::placeholder` per size and per `value-heading`, and several
// modifiers only make sense as compounds (`value-heading.size-*`). None of this reduces to
// single-element utilities, so it lives here as `.blade-input-*`. Pure layout/padding/text-align
// helpers stay atomic in the template classes.
const baseInputComponents = {
  '.blade-input-outer': { width: 'auto' },
  '.blade-input-field': {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
  },
  '.blade-input-field.blade-input-label-left': {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '.blade-input-label-row': {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  '.blade-input-label-row.blade-input-label-left': { flexDirection: 'column' },
  '.blade-input-focus-ring-wrapper': {
    width: '100%',
    borderRadius: 'var(--border-radius-small)',
    '&.blade-input-radius-medium': { borderRadius: 'var(--border-radius-medium)' },
    '&:focus-within': {
      outline: '4px solid var(--surface-border-primary-muted)',
      outlineOffset: '1px',
      transitionProperty: 'outline-width',
      transitionDuration: 'var(--duration-2xquick)',
      transitionTimingFunction: 'var(--easing-standard)',
    },
  },
  '.blade-input-wrapper': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    border: 'none',
    borderRadius: 'var(--border-radius-small)',
    backgroundColor: 'var(--surface-background-gray-intense)',
    boxShadow: 'var(--interactive-border-gray-default) 0px 0px 0px var(--border-width-thin)',
    transitionProperty: 'box-shadow, background-color',
    transitionDuration: 'var(--duration-xgentle)',
    transitionTimingFunction: 'var(--easing-emphasized)',
    '&.blade-input-radius-medium': { borderRadius: 'var(--border-radius-medium)' },
    '&:hover:not([data-disabled]):not(.blade-input-validation-error)': {
      boxShadow: 'var(--interactive-border-gray-highlighted) 0px 0px 0px var(--border-width-thin)',
    },
    '&.blade-input-validation-error': {
      boxShadow: 'var(--interactive-border-negative-default) 0px 0px 0px var(--border-width-thick)',
      zIndex: '1',
    },
    '&[data-disabled]': {
      backgroundColor: 'var(--surface-background-gray-moderate)',
      boxShadow: 'var(--interactive-border-gray-disabled) 0px 0px 0px var(--border-width-thin)',
    },
  },
  '.blade-input-focus-ring-wrapper:focus-within .blade-input-wrapper:not([data-disabled]):not(.blade-input-validation-error)':
    {
      boxShadow:
        'var(--interactive-border-primary-default) 0px 0px 0px var(--border-width-thick)',
    },
  '.blade-input-el': {
    flex: '1',
    width: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    resize: 'none',
    textAlign: 'inherit',
    fontFamily: 'var(--font-family-text)',
    fontSize: 'var(--font-size-100)',
    lineHeight: 'var(--line-height-100)',
    fontWeight: 'var(--font-weight-regular)',
    color: 'var(--interactive-text-gray-normal)',
    '&:focus': { outline: 'none' },
    '&[disabled]': {
      color: 'var(--surface-text-gray-disabled)',
      cursor: 'not-allowed',
      '-webkit-text-fill-color': 'var(--surface-text-gray-disabled)',
    },
    '&::placeholder': {
      color: 'var(--surface-text-gray-disabled)',
      fontFamily: 'var(--font-family-text)',
      fontSize: 'var(--font-size-100)',
      lineHeight: 'var(--line-height-100)',
      fontWeight: 'var(--font-weight-regular)',
    },
  },
  '.blade-input-text-left': { textAlign: 'left' },
  '.blade-input-text-center': { textAlign: 'center' },
  '.blade-input-text-right': { textAlign: 'right' },
  '.blade-input-size-xsmall': {
    height: '28px',
    minHeight: '28px',
    paddingTop: 'var(--spacing-2)',
    paddingBottom: 'var(--spacing-2)',
    fontSize: 'var(--font-size-75)',
    lineHeight: 'var(--line-height-75)',
    '&::placeholder': { fontSize: 'var(--font-size-75)', lineHeight: 'var(--line-height-75)' },
  },
  '.blade-input-size-small': {
    height: '32px',
    minHeight: '32px',
    paddingTop: 'var(--spacing-2)',
    paddingBottom: 'var(--spacing-2)',
    fontSize: 'var(--font-size-75)',
    lineHeight: 'var(--line-height-75)',
    '&::placeholder': { fontSize: 'var(--font-size-75)', lineHeight: 'var(--line-height-75)' },
  },
  '.blade-input-size-medium': {
    height: '36px',
    minHeight: '36px',
    paddingTop: 'var(--spacing-3)',
    paddingBottom: 'var(--spacing-3)',
    fontSize: 'var(--font-size-100)',
    lineHeight: 'var(--line-height-100)',
    '&::placeholder': { fontSize: 'var(--font-size-100)', lineHeight: 'var(--line-height-100)' },
  },
  '.blade-input-size-large': {
    height: '48px',
    minHeight: '48px',
    paddingTop: 'var(--spacing-4)',
    paddingBottom: 'var(--spacing-4)',
    fontSize: 'var(--font-size-200)',
    lineHeight: 'var(--line-height-200)',
    '&::placeholder': { fontSize: 'var(--font-size-200)', lineHeight: 'var(--line-height-200)' },
  },
  '.blade-input-value-heading': {
    fontFamily: 'var(--font-family-heading)',
    color: 'var(--interactive-text-gray-normal)',
    '&[disabled]': { color: 'var(--surface-text-gray-disabled)' },
  },
  '.blade-input-value-heading.blade-input-size-xsmall, .blade-input-value-heading.blade-input-size-small':
    {
      fontSize: 'var(--font-size-300)',
      lineHeight: 'var(--line-height-300)',
    },
  '.blade-input-value-heading.blade-input-size-medium': {
    fontSize: 'var(--font-size-400)',
    lineHeight: 'var(--line-height-400)',
  },
  '.blade-input-value-heading.blade-input-size-large': {
    fontSize: 'var(--font-size-500)',
    lineHeight: 'var(--line-height-500)',
  },
  '.blade-input-value-heading.blade-input-size-xsmall::placeholder, .blade-input-value-heading.blade-input-size-small::placeholder':
    {
      fontFamily: 'var(--font-family-heading)',
      fontSize: 'var(--font-size-300)',
      lineHeight: 'var(--line-height-300)',
    },
  '.blade-input-value-heading.blade-input-size-medium::placeholder': {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--font-size-400)',
    lineHeight: 'var(--line-height-400)',
  },
  '.blade-input-value-heading.blade-input-size-large::placeholder': {
    fontFamily: 'var(--font-family-heading)',
    fontSize: 'var(--font-size-500)',
    lineHeight: 'var(--line-height-500)',
  },
};

// FormLabel / FormHint — width, margins and layout depend on `position` × `size` compounds applied
// via template classes (no `cn` at the call site), so they're emitted here as `.blade-form-*` where
// the compound selectors win by specificity. Rules are scoped by base class (`.blade-form-label` vs
// `.blade-form-label-inner`) so the shared `label-left`/`size-*` modifiers don't cross-match.
const formComponents = {
  '.blade-form-label': { flexShrink: '0', width: '100%', marginRight: '0' },
  '.blade-form-label.blade-form-label-left': { width: '120px' },
  '.blade-form-label.blade-form-label-left.blade-form-size-xsmall, .blade-form-label.blade-form-label-left.blade-form-size-small':
    { marginRight: 'var(--spacing-3)' },
  '.blade-form-label.blade-form-label-left.blade-form-size-medium': {
    marginRight: 'var(--spacing-4)',
  },
  '.blade-form-label.blade-form-label-left.blade-form-size-large': {
    width: '176px',
    marginRight: 'var(--spacing-5)',
  },
  '.blade-form-label-inner': {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  '.blade-form-label-inner.blade-form-size-xsmall, .blade-form-label-inner.blade-form-size-small, .blade-form-label-inner.blade-form-size-medium':
    { marginBottom: 'var(--spacing-2)' },
  '.blade-form-label-inner.blade-form-size-large': { marginBottom: 'var(--spacing-3)' },
  // label-left rule comes after the size rules so it wins the margin-bottom for the left layout.
  '.blade-form-label-inner.blade-form-label-left': {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: '0',
  },
  '.blade-form-label-text-group': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 'var(--spacing-2)',
  },
  '.blade-form-label-text-group.blade-form-necessity-tight': { gap: '0' },
  '.blade-form-label-suffix': { display: 'flex' },
  '.blade-form-label-trailing': { marginLeft: 'auto' },
  '.blade-form-label-trailing.blade-form-label-left': { marginLeft: '0' },
  '.blade-form-hint': { marginTop: 'var(--spacing-2)' },
  '.blade-form-hint.blade-form-size-large': { marginTop: 'var(--spacing-3)' },
  '.blade-form-hint-wrapper': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 'var(--spacing-2)',
  },
  '.blade-form-hint-icon': { flexShrink: '0', marginTop: 'var(--spacing-1)', display: 'flex' },
  '.blade-form-hint-text-large-with-icon': { marginTop: 'var(--spacing-1)' },
};

// InputGroup — corner-rounds the group of stacked inputs by reaching into the InputRow / BaseInput
// literal global hooks (`.__blade-input-row`, `.__blade-base-input-wrapper`, `.__blade-focus-ring-wrapper`)
// with `:first-child`/`:last-child`/`:only-child`/`:not()` combinators, plus hover/focus z-index
// stacking, and a desktop-only left-label row layout using `:has()`. All scoped under `.blade-input-group`.
const RADIUS_SMALL = 'var(--border-radius-small)';
const inputGroupComponents = {
  // Field box lives here (not as a utility) so the desktop `-left` row override — same layer —
  // wins over this column base by source order instead of losing to a utilities-layer `flex-col`.
  '.blade-input-group-field': { display: 'flex', flexDirection: 'column' },
  '.blade-input-group .__blade-input-row .__blade-base-input-wrapper, .blade-input-group .__blade-input-row .__blade-focus-ring-wrapper':
    { borderRadius: '0' },
  '.blade-input-group .__blade-input-row': { position: 'relative', zIndex: '0' },
  '.blade-input-group .__blade-input-row:hover, .blade-input-group .__blade-input-row:focus-within':
    { zIndex: '1' },
  '.blade-input-group .__blade-input-row .__blade-base-input-wrapper': { zIndex: '0' },
  '.blade-input-group .__blade-input-row .__blade-base-input-wrapper:hover, .blade-input-group .__blade-input-row .__blade-base-input-wrapper:focus-within':
    { zIndex: '1' },
  // Multi-row corners.
  '.blade-input-group .__blade-input-row:first-child > div:first-child .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:first-child > div:first-child .__blade-focus-ring-wrapper':
    { borderTopLeftRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:first-child > div:last-child .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:first-child > div:last-child .__blade-focus-ring-wrapper':
    { borderTopRightRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:last-child > div:first-child .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:last-child > div:first-child .__blade-focus-ring-wrapper':
    { borderBottomLeftRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:last-child > div:last-child .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:last-child > div:last-child .__blade-focus-ring-wrapper':
    { borderBottomRightRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:first-child > div:only-child .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:first-child > div:only-child .__blade-focus-ring-wrapper':
    { borderTopLeftRadius: RADIUS_SMALL, borderTopRightRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:last-child > div:only-child .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:last-child > div:only-child .__blade-focus-ring-wrapper':
    { borderBottomLeftRadius: RADIUS_SMALL, borderBottomRightRadius: RADIUS_SMALL },
  // Single row.
  '.blade-input-group .__blade-input-row:only-child > div:only-child .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:only-child > div:only-child .__blade-focus-ring-wrapper':
    { borderRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:only-child > div:first-child:not(:only-child) .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:only-child > div:first-child:not(:only-child) .__blade-focus-ring-wrapper':
    { borderTopLeftRadius: RADIUS_SMALL, borderBottomLeftRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:only-child > div:last-child:not(:only-child) .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:only-child > div:last-child:not(:only-child) .__blade-focus-ring-wrapper':
    { borderTopRightRadius: RADIUS_SMALL, borderBottomRightRadius: RADIUS_SMALL },
  '.blade-input-group .__blade-input-row:only-child > div:not(:first-child):not(:last-child) .__blade-base-input-wrapper, .blade-input-group .__blade-input-row:only-child > div:not(:first-child):not(:last-child) .__blade-focus-ring-wrapper':
    { borderRadius: '0' },
  // Desktop-only left-label row layout.
  '@media (min-width: 768px)': {
    '.blade-input-group-field-left': { flexDirection: 'row' },
    '.blade-input-group-field-left:has(.blade-input-group-row:only-child)': {
      alignItems: 'center',
    },
  },
};

// CounterInput — a faithful port of `counterInput.module.css`: container border/size/emphasis with
// `[data-disabled]` overrides, buttons with hover/focus/disabled color states, a native number input
// with `::-webkit-*-spin-button` pseudo-elements, the `[data-keyboard-focus]` focus ring, a
// slide-in animation, and an oscillating loading bar. All `@keyframes` + selectors live here.
const counterInputComponents = {
  '.blade-counter-input': { display: 'inline-block' },
  '.blade-counter-input-layout': { display: 'flex', flexDirection: 'column' },
  '.blade-counter-input-container': {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    overflow: 'hidden',
    borderStyle: 'solid',
    borderWidth: 'var(--border-width-thin)',
    backgroundColor: 'var(--surface-background-gray-intense)',
    '&[data-disabled]': { backgroundColor: 'var(--surface-background-gray-subtle)' },
  },
  '.blade-counter-input-container-xsmall': {
    width: '78px',
    height: '30px',
    borderRadius: 'var(--border-radius-small)',
  },
  '.blade-counter-input-container-small': {
    width: '86px',
    height: '34px',
    borderRadius: 'var(--border-radius-small)',
  },
  '.blade-counter-input-container-medium': {
    width: '94px',
    height: '38px',
    borderRadius: 'var(--border-radius-small)',
  },
  '.blade-counter-input-container-large': {
    width: '122px',
    height: '50px',
    borderRadius: 'var(--border-radius-medium)',
  },
  '.blade-counter-input-container-subtle': {
    borderColor: 'var(--interactive-border-gray-default)',
  },
  '.blade-counter-input-container-intense': {
    borderColor: 'var(--interactive-border-primary-highlighted)',
    '&[data-disabled]': { borderColor: 'var(--interactive-border-primary-disabled)' },
  },
  '.blade-counter-input-controls': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  '.blade-counter-input-button': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: 'var(--duration-xquick)',
    transitionTimingFunction: 'var(--easing-standard)',
    '&:disabled': { cursor: 'not-allowed' },
    '&:focus-visible': {
      outline: '4px solid var(--surface-border-primary-muted)',
      outlineOffset: '-4px',
    },
  },
  '.blade-counter-input-button-xsmall, .blade-counter-input-button-small, .blade-counter-input-button-medium':
    { padding: 'var(--spacing-2)', borderRadius: 'var(--border-radius-xsmall)' },
  '.blade-counter-input-button-large': {
    padding: 'var(--spacing-3)',
    borderRadius: 'var(--border-radius-small)',
  },
  '.blade-counter-input-button-decrement': {
    margin: 'var(--spacing-2) var(--spacing-0) var(--spacing-2) var(--spacing-2)',
  },
  '.blade-counter-input-button-increment': {
    margin: 'var(--spacing-2) var(--spacing-2) var(--spacing-2) var(--spacing-0)',
  },
  '.blade-counter-input-button-subtle': {
    color: 'var(--interactive-icon-gray-subtle)',
    '&:disabled': { color: 'var(--interactive-icon-gray-disabled)' },
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--interactive-background-gray-faded-highlighted)',
      color: 'var(--interactive-icon-gray-normal)',
    },
  },
  '.blade-counter-input-button-intense': {
    color: 'var(--interactive-icon-primary-subtle)',
    '&:disabled': { color: 'var(--interactive-icon-primary-disabled)' },
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--interactive-background-primary-faded-highlighted)',
      color: 'var(--interactive-icon-primary-normal)',
    },
  },
  '.blade-counter-input-input-wrapper': {
    display: 'flex',
    flex: '1',
    minWidth: '0',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  '.blade-counter-input .blade-counter-input-input-wrapper:focus-within': { outline: 'none' },
  '.blade-counter-input[data-keyboard-focus] .blade-counter-input-input-wrapper:focus-within': {
    outline: '4px solid var(--surface-border-primary-muted)',
    outlineOffset: '-4px',
  },
  '.blade-counter-input-animate-slide-up': {
    animation: 'counter-input-slide-up var(--duration-quick) ease-out',
  },
  '.blade-counter-input-animate-slide-down': {
    animation: 'counter-input-slide-down var(--duration-quick) ease-out',
  },
  '@keyframes counter-input-slide-up': {
    '0%': { transform: 'translateY(30%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  '@keyframes counter-input-slide-down': {
    '0%': { transform: 'translateY(-30%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  '.blade-counter-input-input': {
    width: '100%',
    minWidth: '0',
    padding: 'var(--spacing-2)',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    textAlign: 'center',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-family-text)',
    fontWeight: 'var(--font-weight-semibold)',
    appearance: 'textfield',
    '-moz-appearance': 'textfield',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: '0',
    },
  },
  '.blade-counter-input-input-xsmall, .blade-counter-input-input-small': {
    fontSize: 'var(--font-size-75)',
    lineHeight: 'var(--line-height-75)',
  },
  '.blade-counter-input-input-medium': {
    fontSize: 'var(--font-size-100)',
    lineHeight: 'var(--line-height-100)',
  },
  '.blade-counter-input-input-large': {
    fontSize: 'var(--font-size-200)',
    lineHeight: 'var(--line-height-200)',
  },
  '.blade-counter-input-input-subtle': {
    color: 'var(--surface-text-gray-subtle)',
    '&:disabled': { color: 'var(--surface-text-gray-disabled)' },
  },
  '.blade-counter-input-input-intense': {
    color: 'var(--interactive-text-primary-subtle)',
    '&:disabled': { color: 'var(--interactive-text-primary-disabled)' },
  },
  '.blade-counter-input-progress-bar-wrapper': {
    position: 'absolute',
    left: '0',
    bottom: '0',
    width: '100%',
    height: '2px',
    overflow: 'hidden',
  },
  '.blade-counter-input-progress-bar': {
    position: 'absolute',
    top: '0',
    height: '100%',
    width: '40%',
    borderRadius: 'var(--border-radius-max)',
    animation:
      'counter-input-progress-oscillate var(--duration-2xgentle) var(--easing-linear) infinite',
  },
  '.blade-counter-input-progress-bar-subtle': {
    backgroundColor: 'var(--interactive-icon-gray-muted)',
  },
  '.blade-counter-input-progress-bar-intense': {
    backgroundColor: 'var(--interactive-background-primary-default)',
  },
  '@keyframes counter-input-progress-oscillate': {
    '0%': { left: '-40%' },
    '25%': { left: '50%' },
    '50%': { left: '100%' },
    '75%': { left: '50%' },
    '100%': { left: '-40%' },
  },
  '@media (min-width: 768px)': {
    '.blade-counter-input-layout-left': { flexDirection: 'row', alignItems: 'center' },
  },
};

// Tooltip — the dark bubble uses hsla colors, a backdrop blur, `[data-state]` open/closed
// transitions, per-side enter transforms (compound with `[data-state=closed]`), a dark-mode border,
// and an arrow whose fill/stroke change in dark mode — plus a portal that reads a z-index CSS var.
// All emitted here; the trigger + typography stay atomic in the template classes.
const tooltipComponents = {
  '.blade-tooltip-portal': {
    position: 'fixed',
    top: '0',
    left: '0',
    width: 'max-content',
    pointerEvents: 'none',
    zIndex: 'var(--tooltip-z-index, 1100)',
  },
  '.blade-tooltip-bubble': {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: 'var(--spacing-4)',
    gap: 'var(--spacing-2)',
    maxWidth: '200px',
    borderRadius: 'var(--border-radius-medium)',
    backgroundColor: 'hsla(0, 0%, 0%, 0.72)',
    boxShadow: '0 2px 4px 0 hsla(200, 10%, 18%, 0.06)',
    backdropFilter: 'blur(12px)',
    '-webkit-backdrop-filter': 'blur(12px)',
    pointerEvents: 'none',
    opacity: '0',
    transition: 'opacity var(--duration-quick) ease, transform var(--duration-quick) ease',
    "&[data-state='closed']": { opacity: '0' },
    "&[data-state='open']": { opacity: '1', transform: 'translate(0, 0)' },
  },
  "body[data-theme='dark'] .blade-tooltip-bubble, :root[data-blade-color-scheme='dark'] .blade-tooltip-bubble":
    { border: 'var(--border-width-thin) solid hsla(218, 9%, 30%, 1)' },
  ".blade-tooltip-side-top[data-state='closed']": { transform: 'translateY(4px)' },
  ".blade-tooltip-side-bottom[data-state='closed']": { transform: 'translateY(-4px)' },
  ".blade-tooltip-side-left[data-state='closed']": { transform: 'translateX(4px)' },
  ".blade-tooltip-side-right[data-state='closed']": { transform: 'translateX(-4px)' },
  '.blade-tooltip-arrow': {
    position: 'absolute',
    pointerEvents: 'none',
    fill: 'hsla(0, 0%, 0%, 0.72)',
    stroke: 'transparent',
    strokeWidth: '0',
  },
  "body[data-theme='dark'] .blade-tooltip-arrow, :root[data-blade-color-scheme='dark'] .blade-tooltip-arrow":
    { stroke: 'hsla(218, 9%, 30%, 1)', strokeWidth: '1' },
};

// Alert — full-width alerts swap their action layout (vertical ↔ horizontal) via ancestor descendant
// rules across a breakpoint, and align-items flips to center on desktop full-width. These display
// toggles must sit in the component layer (a utility `flex`/`items-start` would beat them), so the
// alert root's align-items + the action containers' display live here. Color×emphasis + everything
// else stays atomic (CVA compoundVariants / template utilities).
const alertComponents = {
  '.blade-alert': { alignItems: 'flex-start' },
  '.blade-alert-actions-vertical': {
    marginTop: 'var(--spacing-4)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  '.blade-alert-actions-horizontal': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  '.blade-alert-full-width .blade-alert-actions-horizontal': { display: 'none' },
  '.blade-alert-full-width .blade-alert-actions-vertical': { display: 'flex' },
  '@media (min-width: 768px)': {
    '.blade-alert.blade-alert-full-width': { alignItems: 'center' },
    '.blade-alert-full-width .blade-alert-actions-horizontal': { display: 'flex' },
    '.blade-alert-full-width .blade-alert-actions-vertical': { display: 'none' },
  },
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
  addComponents(spinnerComponents);
  addComponents(skeletonComponents);
  addComponents(switchComponents);
  addComponents(iconButtonComponents);
  addComponents(baseInputComponents);
  addComponents(formComponents);
  addComponents(inputGroupComponents);
  addComponents(counterInputComponents);
  addComponents(tooltipComponents);
  addComponents(alertComponents);
});
