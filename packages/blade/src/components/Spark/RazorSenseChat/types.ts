import type React from 'react';
import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';

type RazorSenseThinkingProps = {
  /**
   * What it's doing, shown as flow 9's thinking label: blue, with a shimmer running through it (held still with reduced motion).
   * @default 'Thinking…'
   */
  children?: string;
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
   * True while the answer is being worked out: RazorSense loops on the `RazorSenseThinking` label. When it turns false the
   * thinking surges down into the `RazorSenseBottomWave` under the chat input and settles there. True again for the next
   * question: the wave rises back up to the label (the surge, backwards) and thinks on. Changed mid-way, it turns round.
   * @default false
   */
  isThinking?: boolean;
  /**
   * The chat: its messages, a `RazorSenseThinking` where the thinking shows and a `RazorSenseBottomWave` round the chat input. RazorSenseChat draws both on one canvas over its whole box, behind everything in it (their own `scale`, `isPaused`,
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
