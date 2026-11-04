import type React from 'react';
import type { TestID } from '~utils/types';

type FreshLLMProps = {
  /**
   * `thinking`: while the answer is being worked out, RazorSense loops its thinking near the top. `idle`: the answer is in;
   * the thinking surges down to the chat input and settles there, idle (typing in the chat input brings in its typing surge).
   * Back to `thinking` for the next question: thinking starts again while idle fades.
   * @default 'thinking'
   */
  variant?: 'thinking' | 'idle';
  /**
   * The text in the chat input. While idle, every change is a keystroke: it pulses into its typing surge and dies back down to
   * idle after.
   */
  inputValue?: string;
  /**
   * Holds the animation where it is.
   * @default false
   */
  isPaused?: boolean;
  /**
   * The whole effect bigger or smaller, bands included. Held between 0.75 and 1.25.
   * @default 1
   */
  scale?: number;
  /**
   * The chat input: idle sits under it, centred, and follows it as it moves. Without it, FreshLLM lays itself out as flow 9's
   * chat (an input centred across the panel near its bottom).
   */
  chatInputRef?: React.RefObject<HTMLElement>;
  /**
   * The thinking row's spot (where an assistant's avatar sits before its "Thinking…" label): thinking loops on it, and follows it.
   * Without it, flow 9's chat layout.
   */
  thinkingRef?: React.RefObject<HTMLElement>;
  /**
   * Width of the chat panel it fills (thinking and idle are placed in it by `thinkingRef` and `chatInputRef`).
   * @default '100%'
   */
  width?: string | number;
  /**
   * Height of the chat panel.
   * @default '100%'
   */
  height?: string | number;
} & TestID;

export type { FreshLLMProps };
