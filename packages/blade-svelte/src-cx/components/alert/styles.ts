import type { AxisValue } from '../../axes';
import type { IconSource } from '../../runes/icon/source';
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
} from '../../icons';
import { INTENTS } from '../shared/intent';

/**
 * The parts of an Alert. Which looks are problems is decided here, so the
 * classes also say whether the alert interrupts a screen reader.
 */
export interface AlertClasses {
  root: string;
  /** Wraps the leading icon; the icon takes its colour. */
  icon: string;
  /** The icon's default per colour, when the caller passes none. */
  defaultIcon: IconSource;
  text: string;
  title: string;
  description: string;
  /** The dismiss button, and the glyph inside it. */
  close: string;
  closeIcon: IconSource;
  /** Problems interrupt (`alert`); everything else waits its turn. */
  role: 'alert' | 'status';
  /** `notice` is urgent but polite, as in Blade. */
  live: 'polite' | undefined;
  /** ms the alert takes to slide shut. */
  slide: number;
}

/** The second argument: whether the alert has a title, which Blade aligns the icon by. */
export type AlertStyleResolver<P> = (props: P, hasTitle?: boolean) => AlertClasses;

/** The blade taxonomy as data. */
export const ALERT_AXES = {
  color: [...INTENTS, 'primary'],
  emphasis: ['subtle', 'intense'],
} as const;

type Axis<K extends keyof typeof ALERT_AXES> = AxisValue<typeof ALERT_AXES, K>;
type Color = Axis<'color'>;
type Emphasis = Axis<'emphasis'>;

/** Derived from ALERT_AXES: add a value there, never here. */
export interface AlertStyleProps {
  /** @default 'neutral' */
  color?: Color;
  /** @default 'subtle' */
  emphasis?: Emphasis;
}

// Blade's alert fills (Alert/styles.ts): the colour's subtle or intense
// feedback background; `primary` uses the surface's primary pair.
const FILL: Record<Emphasis, Record<Color, string>> = {
  subtle: {
    neutral: 'bg-feedback-neutral-subtle',
    information: 'bg-feedback-information-subtle',
    positive: 'bg-feedback-positive-subtle',
    notice: 'bg-feedback-notice-subtle',
    negative: 'bg-feedback-negative-subtle',
    primary: 'bg-surface-primary-subtle',
  },
  intense: {
    neutral: 'bg-feedback-neutral-intense',
    information: 'bg-feedback-information-intense',
    positive: 'bg-feedback-positive-intense',
    notice: 'bg-feedback-notice-intense',
    negative: 'bg-feedback-negative-intense',
    primary: 'bg-surface-primary-intense',
  },
};

// On a subtle fill the icon takes the colour's intense feedback icon; on an
// intense fill everything is white.
const ICON_TONE: Record<Color, string> = {
  neutral: 'icon-feedback-neutral-intense',
  information: 'icon-feedback-information-intense',
  positive: 'icon-feedback-positive-intense',
  notice: 'icon-feedback-notice-intense',
  negative: 'icon-feedback-negative-intense',
  primary: 'icon-surface-primary-normal',
};

const DEFAULT_ICON: Record<Color, IconSource> = {
  neutral: InfoIcon,
  information: InfoIcon,
  positive: CheckCircleIcon,
  notice: AlertTriangleIcon,
  negative: AlertOctagonIcon,
  primary: InfoIcon,
};

const TEXT: Record<Emphasis, { title: string; description: string; close: string }> = {
  subtle: {
    title: 'text-surface-gray-normal',
    description: 'text-surface-gray-subtle',
    // Blade's intense IconButton: gray-muted, gray-subtle on hover and focus.
    close:
      'icon-interactive-gray-muted hover:icon-interactive-gray-subtle focus-visible:icon-interactive-gray-subtle active:icon-interactive-gray-subtle',
  },
  intense: {
    title: 'text-surface-static-white-normal',
    description: 'text-surface-static-white-subtle',
    close:
      'icon-interactive-static-white-normal hover:icon-interactive-static-white-subtle focus-visible:icon-interactive-static-white-subtle active:icon-interactive-static-white-subtle',
  },
};

// Blade's full-width alert, always: centred and 1px down beside a lone
// description, 2px down on the first line with a title.
const ICON_OFFSET = {
  lone: 'self-center mt-px',
  titled: 'self-start mt-0.5',
};

const URGENT: Color[] = ['negative', 'notice'];

export const resolveAlert: AlertStyleResolver<AlertStyleProps> = (props, hasTitle = true) => {
  const { color = 'neutral', emphasis = 'subtle' } = props;
  const text = TEXT[emphasis];
  return {
    // Blade's full-width alert: 12px in, a 12px radius, a fill and no
    // border; from 768px the content centres on the row.
    root: `flex items-start m:items-center rounded-medium p-3 text-start ${FILL[emphasis][color]}`,
    icon: `flex shrink-0 ${ICON_OFFSET[hasTitle ? 'titled' : 'lone']} ${
      emphasis === 'intense' ? 'icon-surface-static-white-normal' : ICON_TONE[color]
    }`,
    defaultIcon: DEFAULT_ICON[color],
    // Blade DSL's full-width Alert (Figma): the icon 8px before the text,
    // the text 12px before the dismiss button.
    text: 'flex min-w-0 flex-1 flex-col pl-2 pr-3',
    title: `m-0 mb-1 text-100 leading-100 font-semibold ${text.title}`,
    description: `m-0 text-75 leading-75 ${hasTitle ? '' : 'mt-0.5'} ${text.description}`.replace(
      /\s+/g,
      ' ',
    ),
    // The dismiss button stays at the top, as in Blade, while the row centres.
    close: `flex shrink-0 self-start items-center justify-center rounded-2xsmall border-none bg-transparent p-0 transition-colors duration-xquick ease-standard focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted ${
      hasTitle ? '' : 'mt-0.5'
    } ${text.close}`,
    closeIcon: CloseIcon,
    role: URGENT.includes(color) ? 'alert' : 'status',
    live: color === 'notice' ? 'polite' : undefined,
    slide: 200,
  };
};
