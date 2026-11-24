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
  /**
   * Whether the reply is still streaming in. A reply whose opening paragraph turns out to be its
   * main title (a title follows it) would otherwise restyle that paragraph when the title
   * arrives, so while streaming the opening paragraph waits until the next block starts.
   *
   * @default false
   */
  isStreaming?: boolean;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute;

export type { RayChatOutputProps };
