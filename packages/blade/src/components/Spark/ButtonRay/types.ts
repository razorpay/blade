/**
 * Which Ray a button with `hasRay` plays. 'investigate': flow 9's "Investigate with Ray", he whips out his magnifying glass
 * and searches. More to come.
 */
type ButtonRayVariant = 'investigate';

type ButtonRayProps = {
  isEnabled: boolean;
  variant: ButtonRayVariant;
};

export type { ButtonRayVariant, ButtonRayProps };
