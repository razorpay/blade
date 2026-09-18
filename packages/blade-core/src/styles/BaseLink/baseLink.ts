import { cva } from 'class-variance-authority';
import { cn } from '~utils/cx';

export type BaseLinkVariants = {
  variant?: 'anchor' | 'button';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  isDisabled?: boolean;
};

// Color and interaction types for color token generation
export type LinkColor =
  | 'primary'
  | 'white'
  | 'positive'
  | 'negative'
  | 'notice'
  | 'information'
  | 'neutral';

export type LinkVariant = 'anchor' | 'button';

export type ActionStatesType = 'default' | 'hover' | 'focus' | 'disabled';
export type ColorType = 'normal' | 'subtle' | 'disabled';

/**
 * Get color token based on state, variant, color, and element type
 * This generates the color token string that BaseText CVA uses for colors
 */
export function getLinkColorToken({
  variant,
  color,
  currentInteraction,
  isDisabled,
  element,
}: {
  variant: LinkVariant;
  color: LinkColor;
  currentInteraction: ActionStatesType;
  isDisabled: boolean;
  element: 'icon' | 'text';
}): string {
  let state = currentInteraction;
  const map: Record<ActionStatesType, ColorType> = {
    default: 'normal',
    hover: 'subtle',
    focus: 'subtle',
    disabled: 'disabled',
  };

  const stateKey = map[state];

  if (isDisabled && variant === 'button') {
    state = 'disabled';
  }

  if (color && color !== 'primary') {
    if (color !== 'white') {
      return `interactive.${element}.${color}.${stateKey}`;
    }
    return `interactive.${element}.staticWhite.${stateKey}`;
  }
  return `interactive.${element}.primary.${stateKey}`;
}

/**
 * Get text size mapping for fontSize and lineHeight
 * These values correspond to BaseText utility classes (font-size-25, font-size-75, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 */
export function getLinkTextSizes(): {
  fontSize: Record<'xsmall' | 'small' | 'medium' | 'large', 25 | 75 | 100 | 200>;
  lineHeight: Record<'xsmall' | 'small' | 'medium' | 'large', 25 | 75 | 100 | 200>;
} {
  return {
    fontSize: {
      xsmall: 25,
      small: 75,
      medium: 100,
      large: 200,
    },
    lineHeight: {
      xsmall: 25,
      small: 75,
      medium: 100,
      large: 200,
    },
  };
}

/**
 * Maps link size to icon size based on Figma design specs.
 * Matches React's linkSizeToIconSizeMap in BaseLink.tsx.
 */
export function getLinkIconSizeMap(): Record<
  'xsmall' | 'small' | 'medium' | 'large',
  'small' | 'medium'
> {
  return {
    xsmall: 'small',
    small: 'small',
    medium: 'medium',
    large: 'medium',
  } as const;
}

/**
 * CVA-based BaseLink styles (Tailwind).
 *
 * The base is a reset-ish anchor/button. The only irreducible bit — the `& *` descendant
 * transition that animates color/fill on the link's children — lives in the `.blade-link`
 * plugin component class (referenced here by name). `cursor` is driven by the `isDisabled`
 * variant (was the `&[disabled]` selector).
 */
export const baseLinkStyles = cva(
  'blade-link inline-block p-spacing-0 bg-transparent border-none no-underline outline-none rounded-small transition-shadow ease-standard duration-2xquick',
  {
    variants: {
      isDisabled: {
        true: 'cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      isDisabled: false,
    },
  },
);

// Export content and icon classes for use in component templates (literal so the JIT scanner sees them).
export const baseLinkContentClass = 'flex flex-row items-center w-max rounded-small';
export const baseLinkIconClass = 'flex items-center';

/**
 * Get all BaseLink component template classes as an object.
 * Use this function in Svelte components to prevent tree-shaking from removing
 * class imports that are only used in templates.
 *
 * @example
 * const linkClasses = getBaseLinkTemplateClasses();
 * // Use: linkClasses.content, linkClasses.icon, linkClasses.iconLeft, linkClasses.iconRight
 */
export function getBaseLinkTemplateClasses(): Record<string, string> {
  return {
    content: baseLinkContentClass,
    icon: baseLinkIconClass,
    iconLeft: 'pr-spacing-2',
    iconRight: 'pl-spacing-2',
  } as const;
}

/**
 * Generate all classes for BaseLink component
 * This is the single source of truth for all BaseLink styling
 * Everything is class-based - no data attributes or inline styles
 */
export function getBaseLinkClasses(props: BaseLinkVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  return cn(baseLinkStyles(cvaProps), className);
}

/**
 * Map an opacity number to its corresponding Tailwind opacity utility.
 * Uses a LITERAL lookup (not string interpolation) so every producible class appears verbatim in
 * source for the JIT scanner — no safelist entry needed. Supported steps mirror the original
 * `utilities.module.css` Opacity Utilities section (0, 0.25, 0.5, 0.56, 0.64, 0.75); `undefined`/`1`
 * fall back to no class (full opacity / inherited).
 */
const opacityUtilityClasses: Record<number, string> = {
  0: 'opacity-0',
  25: 'opacity-25',
  50: 'opacity-50',
  56: 'opacity-56',
  64: 'opacity-64',
  75: 'opacity-75',
};

function getOpacityUtilityClass(opacity: number | undefined): string | undefined {
  if (opacity === undefined || opacity === 1) return undefined;
  const percent = Math.round(opacity * 100);
  return opacityUtilityClasses[percent];
}

/**
 * Classes for the inner content wrapper of a BaseLink (the span that wraps
 * icon + text). Accepts an optional `opacity` so consumers like Breadcrumb
 * can dim inactive items without affecting the focus ring on the outer
 * anchor/button element.
 *
 */
export function getBaseLinkContentClasses({ opacity }: { opacity?: number } = {}): string {
  return [baseLinkContentClass, getOpacityUtilityClass(opacity)].filter(Boolean).join(' ');
}
