import type { ActionStatesType, ColorType } from '../../../types';

type LinkColor =
  | 'primary'
  | 'white'
  | 'positive'
  | 'negative'
  | 'notice'
  | 'information'
  | 'neutral';
type LinkVariant = 'anchor' | 'button';

/**
 * Get color token based on state, variant, color, and element type
 */
export function getColorToken({
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
    focus: 'normal',
    disabled: 'disabled',
  };

  const stateKey = map[state];

  if (isDisabled && variant == 'button') {
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
 */
export function getTextSizes() {
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