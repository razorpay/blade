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

type TextIconColors = `surface.text.${DotNotationColorStringToken<
  Theme['colors']['surface']['text']
>}`;

type SurfaceActionIconColors = `surface.action.icon.${DotNotationColorStringToken<
  Theme['colors']['surface']['action']['icon']
>}`;

type BadgeIconColors = `badge.icon.${DotNotationColorStringToken<
  Theme['colors']['badge']['icon']
>}`;

export type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
export type IconProps = {
  /**
   * Color token (not to be confused with actual hsla value)
   */
  color:
    | ActionIconColors
    | SurfaceActionIconColors
    | FeedbackIconColors
    | FeedbackActionIconColors
    | TextIconColors
    | BadgeIconColors
    | 'currentColor'; // currentColor is useful for letting the SVG inherit color property from its container
  size: IconSize;
};
export type IconComponent = React.ComponentType<IconProps>;

export { default as ArrowDownIcon } from './ArrowDownIcon';
export { default as ArrowLeftIcon } from './ArrowLeftIcon';
export { default as ArrowRightIcon } from './ArrowRightIcon';
export { default as ArrowUpRightIcon } from './ArrowUpRightIcon';
export { default as ArrowUpIcon } from './ArrowUpIcon';
export { default as CheckIcon } from './CheckIcon';
export { default as ChevronDownIcon } from './ChevronDownIcon';
export { default as ChevronLeftIcon } from './ChevronLeftIcon';
export { default as ChevronRightIcon } from './ChevronRightIcon';
export { default as ChevronUpIcon } from './ChevronUpIcon';
export { default as CloseIcon } from './CloseIcon';
export { default as CreditCardIcon } from './CreditCardIcon';
export { default as DollarIcon } from './DollarIcon';
export { default as DownloadIcon } from './DownloadIcon';
export { default as EditIcon } from './EditIcon';
export { default as EyeIcon } from './EyeIcon';
export { default as EyeOffIcon } from './EyeOffIcon';
export { default as FileTextIcon } from './FileTextIcon';
export { default as HistoryIcon } from './HistoryIcon';
export { default as HomeIcon } from './HomeIcon';
export { default as InfoIcon } from './InfoIcon';
export { default as LinkIcon } from './LinkIcon';
export { default as PauseIcon } from './PauseIcon';
export { default as PlusIcon } from './PlusIcon';
export { default as RupeeIcon } from './RupeeIcon';
export { default as SearchIcon } from './SearchIcon';
export { default as TrashIcon } from './TrashIcon';
export { default as AlertTriangleIcon } from './AlertTriangleIcon';
export { default as AlertOctagonIcon } from './AlertOctagonIcon';
export { default as CheckCircleIcon } from './CheckCircleIcon';
export { default as RefreshLeftIcon } from './RefreshLeftIcon';
export { default as MinusIcon } from './MinusIcon';
export { default as RotateCounterClockWiseIcon } from './RotateCounterClockWiseIcon';
export { default as TrendingUpIcon } from './TrendingUpIcon';
export { default as TrendingDownIcon } from './TrendingDownIcon';
export { default as HelpCircleIcon } from './HelpCircleIcon';
export { default as ExternalLinkIcon } from './ExternalLinkIcon';
