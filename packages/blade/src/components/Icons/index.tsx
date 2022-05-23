import type { Theme } from '../BladeProvider';
import type { DotNotationColorStringToken } from '../../_helpers/types';

type FeedbackColors = `feedback.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['icon']
>}`;

// TODO: Figure out a better way to handle Feedback**Colors types without having to repeat them

type FeedbackPositiveColors = `feedback.positive.action.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['positive']['action']['icon']
>}`;

type FeedbackNegativeColors = `feedback.negative.action.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['negative']['action']['icon']
>}`;

type FeedbackInformationColors = `feedback.information.action.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['information']['action']['icon']
>}`;
type FeedbackNoticeColors = `feedback.notice.action.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['notice']['action']['icon']
>}`;

type FeedbackNeutralColors = `feedback.neutral.action.icon.${DotNotationColorStringToken<
  Theme['colors']['feedback']['neutral']['action']['icon']
>}`;

type ActionColors = `action.icon.${DotNotationColorStringToken<Theme['colors']['action']['icon']>}`;

export type IconSize = 'large' | 'medium' | 'small' | 'xlarge' | 'xsmall' | 'xxsmall';
export type IconProps = {
  color:
    | ActionColors
    | FeedbackColors
    | FeedbackPositiveColors
    | FeedbackNegativeColors
    | FeedbackInformationColors
    | FeedbackNoticeColors
    | FeedbackNeutralColors;
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
