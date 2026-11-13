/**
 * Which Ray a button with `hasRay` plays. 'investigate': flow 9's "Investigate with Ray", he whips out his magnifying glass
 * and searches. More to come.
 */
type ButtonRayVariant = 'investigate';

type ButtonRayProps = {
  isEnabled: boolean;
  variant: ButtonRayVariant;
  /** the button's size: the gap between its label and Ray is tuned per size */
  size: 'xsmall' | 'small' | 'medium' | 'large';
};

export type { ButtonRayVariant, ButtonRayProps };
