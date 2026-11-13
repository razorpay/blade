import React from 'react';
import type { RazorSenseThinkingProps } from './types';

type ChatPart = 'thinking' | 'bottomWave';

type RazorSenseChatContextValue = {
  /** a part's element, where the chat draws it; the returned function lets it go */
  register: (part: ChatPart, element: HTMLElement) => () => void;
  /** a key typed in the chat input */
  keystroke: () => void;
  /** the chat's own isPaused (its parts follow it: the thinking label's shimmer holds too) */
  isPaused: boolean;
  /**
   * RazorSenseThinking, handed down so a ChatMessage that's loading inside the chat can show its loading text as the thinking
   * label (and drive the chat's thinking) without importing RazorSense's code itself
   */
  Thinking: React.ComponentType<Pick<RazorSenseThinkingProps, 'children'>>;
};

/** Set by RazorSenseChat: its parts register with it and it draws them, instead of drawing themselves. */
const RazorSenseChatContext = React.createContext<RazorSenseChatContextValue | null>(null);

export { RazorSenseChatContext };
export type { ChatPart, RazorSenseChatContextValue };
