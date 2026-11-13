import type React from 'react';
import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseThinkingProps = {
  /**
   * What it's doing, shown as flow 9's thinking label: blue, with a shimmer running through it (held still with reduced motion,
   * and paused with `isPaused`).
   * @default 'Thinking…'
   */
  children?: React.ReactNode;
  /**
   * Several labels, rolling from one to the next (as `RollingText`'s `texts`, and `ChatMessage`'s `loadingText` as an array).
   * Given, they're shown instead of `children`.
   */
  texts?: string[];
} & RazorSenseDrawProps;

type RazorSenseBottomWaveProps = {
  /**
   * The chat input it settles under. Typing in it (any input, textarea or editable element inside) pulses the wave up into its
   * typing surge; it dies back down when the typing stops. What's typed is never read.
   */
  children: React.ReactNode;
} & RazorSenseDrawProps;

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
} & RazorSenseDrawProps;

export type { RazorSenseThinkingProps, RazorSenseBottomWaveProps, RazorSenseChatProps };
