import type { Theme } from '../BladeProvider';
import type { DotNotationColorStringToken } from '../../_helpers/types';

type FeedbackColors = `feedback.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['icon']
>}`;
type SurfaceColors = `surface.icon.${DotNotationColorStringToken<
  Theme['colors']['surface']['action']['icon']
>}`;
type ActionColors = `action.icon.${DotNotationColorStringToken<Theme['colors']['action']['icon']>}`;

export type IconSize = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall' | 'xxsmall';
export type IconProps = {
  color: ActionColors | FeedbackColors | SurfaceColors;
  size: IconSize;
};

export { default as CloseIcon } from './CloseIcon';
export { default as ChevronDownIcon } from './ChevronDownIcon';
export { default as ChevronLeftIcon } from './ChevronLeftIcon';
export { default as ChevronRightIcon } from './ChevronRightIcon';
export { default as ChevronUpIcon } from './ChevronUpIcon';
export { default as CreditCardIcon } from './CreditCardIcon';
export { default as DollarIcon } from './DollarIcon';
export { default as EyeIcon } from './EyeIcon';
export { default as EyeOffIcon } from './EyeOffIcon';
export { default as RupeeIcon } from './RupeeIcon';
