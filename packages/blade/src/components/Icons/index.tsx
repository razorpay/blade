import type { Theme } from '~components/BladeProvider';
import type { DotNotationColorStringToken } from '~src/_helpers/types';
import type { Feedback } from '~tokens/theme/theme';

type FeedbackIconColors = `feedback.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['icon']
>}`;

type FeedbackActionIconColors = `feedback.${Feedback}.action.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback'][Feedback]['action']['icon']
>}`;

type ActionIconColors = `action.icon.${DotNotationColorStringToken<
  Theme['colors']['action']['icon']
>}`;

export type IconSize = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall' | 'xxsmall';
export type IconProps = {
  color: ActionIconColors | FeedbackIconColors | FeedbackActionIconColors;
  size: IconSize;
};
export type IconComponent = React.ComponentType<IconProps>;

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
