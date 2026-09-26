import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';
import { close } from '../icons';
import { INTENTS, type Intent } from '../shared/intent';

/**
 * The parts of an Alert. Which looks are problems is decided here, so the
 * classes also say whether the alert interrupts a screen reader.
 */
export interface AlertClasses {
  root: string;
  icon: string;
  text: string;
  title: string;
  description: string;
  actions: string;
  /** The dismiss button, and the glyph inside it. */
  close: string;
  closeIcon: IconSource;
  /** Problems interrupt (`alert`); everything else waits its turn. */
  role: 'alert' | 'status';
  /** ms the alert takes to slide open and shut. */
  slide: number;
}

export type AlertStyleResolver<P> = (props: P) => AlertClasses;

/** The blade taxonomy as data. */
export const ALERT_AXES = {
  color: INTENTS,
} as const;

/** Derived from ALERT_AXES: add a value there, never here. */
export interface AlertStyleProps {
  color?: AxisValue<typeof ALERT_AXES, 'color'>;
}

const URGENT: Intent[] = ['negative', 'notice'];

// Blade's subtle alert (Alert/styles.ts, alert.module.css): the intent's
// subtle feedback fill with no border of its own, the icon in the intent's
// intense feedback colour, and gray text on it.
const FILL: Record<Intent, string> = {
  neutral: 'bg-feedback-neutral-subtle',
  information: 'bg-feedback-information-subtle',
  positive: 'bg-feedback-positive-subtle',
  notice: 'bg-feedback-notice-subtle',
  negative: 'bg-feedback-negative-subtle',
};

const ICON: Record<Intent, string> = {
  neutral: 'icon-feedback-neutral-intense',
  information: 'icon-feedback-information-intense',
  positive: 'icon-feedback-positive-intense',
  notice: 'icon-feedback-notice-intense',
  negative: 'icon-feedback-negative-intense',
};

export const resolveAlert: AlertStyleResolver<AlertStyleProps> = (props) => {
  const { color = 'neutral' } = props;
  return {
    root: `flex w-full items-start gap-2 overflow-hidden rounded-small border-thin border-solid border-transparent p-3 text-surface-gray-normal ${FILL[color]}`,
    icon: `flex shrink-0 items-center pt-0.5 ${ICON[color]}`,
    text: 'flex min-w-0 flex-1 flex-col gap-0.5',
    title: 'text-100 leading-100 font-semibold text-surface-gray-normal',
    description: 'text-75 leading-50 text-surface-gray-subtle',
    actions: 'mt-2 flex flex-wrap items-center gap-3',
    // Blade's dismiss is an intense (gray) IconButton on a subtle alert.
    close:
      'flex w-5 h-5 shrink-0 items-center justify-center rounded-xsmall bg-transparent icon-interactive-gray-muted outline-none transition-colors hover:icon-interactive-gray-subtle active:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle focus-visible:shadow-focus',
    closeIcon: close,
    role: URGENT.includes(color) ? 'alert' : 'status',
    slide: 200,
  };
};
