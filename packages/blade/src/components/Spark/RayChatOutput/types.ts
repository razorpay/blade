import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type RayChatOutputProps = {
  /**
   * RAY's reply: one chat message, in Markdown. Empty or left out while a stream hasn't started.
   *
   * It's tidied before it's drawn: RAY's JSON wrapper is unwrapped (also while it streams),
   * a literal `\n` becomes a line break, and emoji are left out.
   */
  children?: string;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

export type { RayChatOutputProps };
