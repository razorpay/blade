import type React from 'react';
import type { RazorSenseDrawProps, RazorSenseStateProps } from '../RazorSenseEngine/drawProps';
import type { StringChildrenType } from '~utils/types';

/**
 * The props a RazorSenseChat draws for the RazorSenseThinking and RazorSenseBottomWave inside it: theirs are ignored there (the
 * chat's apply; it warns in development). Each one's own doc says so, so an editor shows it where it's set.
 */
type NestedDrawProps = {
  /**
   * Holds the animation where it is. Ignored inside a RazorSenseChat: set it on the chat.
   * @default false
   */
  isPaused?: boolean;
  /**
   * The whole effect bigger or smaller, bands included. Held between 0.75 and 1.25. Ignored inside a RazorSenseChat: set it on
   * the chat.
   * @default 1
   */
  scale?: number;
  /**
   * Called once it's showing: its first frame drawn on the GPU. Ignored inside a RazorSenseChat: the chat's `onLoad` is called.
   */
  onLoad?: () => void;
  /**
   * Called when it can't animate (see RazorSenseChat's `onError` for when): it shows its still frame instead. Ignored inside a
   * RazorSenseChat: the chat's `onError` is called.
   */
  onError?: (error: Error) => void;
};

type RazorSenseThinkingProps = {
  /**
   * What it's doing, shown as flow 9's thinking label: blue, with a shimmer running through it (held still with reduced motion,
   * and paused with `isPaused`). Text only (the shimmer paints the text itself), as Button's children: `Searching {count}
   * settlements…` is fine.
   * @default 'Thinking…'
   */
  children?: StringChildrenType;
  /**
   * Several labels, rolling from one to the next (as `RollingText`'s `texts`, and `ChatMessage`'s `loadingText` as an array).
   * Given, they're shown instead of `children` (pass one or the other: both, it warns in development).
   */
  texts?: string[];
} & NestedDrawProps &
  Omit<RazorSenseDrawProps, keyof NestedDrawProps>;

/** How the task an answer did ended: the chat's bottom strip plays its success (green) or error (red) wave */
type RazorSenseOutcome = 'success' | 'error';

/** What the chat's bottom strip shows once an answer is done */
type RazorSenseOutcomeProps = {
  /**
   * How the task the answer did ended: set it as the answer shows it (the ✓, or the failing step) and the bottom strip plays its
   * success (green) or error (red) wave once, ending back at its rest. Set while it's still thinking, it waits for the answer to
   * settle. Cleared or changed mid-way, it plays out quickly (never backwards), and a new one then plays from the strip's rest; the
   * next question plays it out quickly before the thinking comes back up. It plays once each time it's set, and once each answer:
   * clear it as the page sends the next question (a new color scheme or scale doesn't play it again).
   */
  outcome?: RazorSenseOutcome;
};

/** The states a lone RazorSenseBottomWave takes; inside a RazorSenseChat the chat's apply */
type NestedStateProps = {
  /**
   * While true, the wave drops below the page's edge (the app is offline); back to false, it comes back. Ignored inside a
   * RazorSenseChat: set it on the chat.
   * @default false
   */
  isOffline?: boolean;
  /**
   * While true, the wave listens: a row of blobs grows on its top edge, moving with `voiceStream`'s voice. Ignored inside a
   * RazorSenseChat: set it on the chat.
   * @default false
   */
  isListening?: boolean;
  /**
   * The page's own microphone stream while it listens (RazorSense only reads its levels and never opens the microphone). Ignored
   * inside a RazorSenseChat: set it on the chat.
   */
  voiceStream?: MediaStream;
  /**
   * How the task the answer did ended: the wave plays its success (green) or error (red) wave once, ending back at its rest (see
   * RazorSenseChat's `outcome`). Ignored inside a RazorSenseChat: set it on the chat.
   */
  outcome?: RazorSenseOutcome;
};

type RazorSenseBottomWaveProps = {
  /**
   * The chat input it settles under. Typing in it (any input, textarea or editable element inside) pulses the wave up into its
   * typing surge; it dies back down when the typing stops. What's typed is never read.
   */
  children: React.ReactNode;
} & NestedDrawProps &
  Omit<RazorSenseDrawProps, keyof NestedDrawProps> &
  NestedStateProps;

type RazorSenseChatProps = {
  /**
   * The chat: its messages, a `RazorSenseThinking` where the reply will go while the answer is worked out, and a
   * `RazorSenseBottomWave` round the chat input. It thinks while the `RazorSenseThinking` is shown; when that goes (the answer
   * takes its place), the thinking surges down into the bottom wave and settles there. A `RazorSenseThinking` shown again for the
   * next question brings the wave back up to it (the surge, backwards); changed mid-way, it turns round. RazorSenseChat draws both on one canvas over its whole box, behind everything in it (their own `scale`, `isPaused`,
   * `onLoad` and `onError` are ignored inside it: the chat's apply).
   */
  children: React.ReactNode;
  /**
   * Width of the chat panel it draws over.
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the chat panel it draws over.
   * @default '100%'
   */
  height?: string | number;
} & RazorSenseDrawProps &
  RazorSenseStateProps &
  RazorSenseOutcomeProps;

export type {
  RazorSenseThinkingProps,
  RazorSenseBottomWaveProps,
  RazorSenseChatProps,
  RazorSenseOutcomeProps,
  RazorSenseOutcome,
};
