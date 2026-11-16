/**
 * What Ray does on a button with `aiHover="ray-<action>"`. 'investigate': flow 9's "Investigate with Ray", he whips out his magnifying glass
 * and searches. More to come.
 */
const BUTTON_RAY_VARIANTS = ['investigate'] as const;
type ButtonRayVariant = typeof BUTTON_RAY_VARIANTS[number];

type ButtonRayProps = {
  isEnabled: boolean;
  variant: ButtonRayVariant;
  /** the button's size: the gap between its label and Ray is tuned per size */
  size: 'xsmall' | 'small' | 'medium' | 'large';
};

export { BUTTON_RAY_VARIANTS };
export type { ButtonRayVariant, ButtonRayProps };
