import type { TestID } from '~utils/types';

type FreshChatBackgroundProps = {
  /**
   * `idle`: the soft fluted strip behind the chat input, drifting and breathing. `typing-surge`: held in its typing surge, as
   * while someone types, with its rhythm. Either way, every change to `inputValue` is a keystroke: the typing surge pulses in
   * with it and dies back down to idle after.
   * @default 'idle'
   */
  variant?: 'idle' | 'typing-surge';
  /**
   * The text in the chat input it sits behind, as a typing signal: only its changes are read (each one counts as a keystroke).
   * The text itself is never read or shown.
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
   * The chat input's width: lay the chat background over the chat input (its box is the input's). The strip stretches across to
   * fit it, the bands keeping their size, and its glow spills outside the box. Fits chat inputs 504-1260 px wide (0.6-1.5x flow
   * 9's 840 px); wider or narrower, it stretches as for the nearest end, centred on the input.
   * @default '100%'
   */
  width?: string | number;
  /**
   * The chat input's height. The strip stretches down to fit it. Fits chat inputs 58-146 px tall (0.6-1.5x flow 9's 97 px).
   * @default '100%'
   */
  height?: string | number;
} & TestID;

export type { FreshChatBackgroundProps };
