import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

/** The four points of the sentiment scale, worst to best. */
type ChatFeedbackMood = 'very-dissatisfied' | 'dissatisfied' | 'satisfied' | 'very-satisfied';

type ChatFeedbackStep = 'mood' | 'tags' | 'thanks' | 'comment';

type ChatFeedbackMoodConfig = {
  /** Follow-up question shown once this mood is picked */
  question: string;
  /** Quick-select tags offered for this mood */
  tags: string[];
};

/** One glyph per point of the scale. */
type ChatFeedbackMoodIcons = Record<ChatFeedbackMood, React.ReactNode>;

type ChatFeedbackSubmitPayload = {
  mood: ChatFeedbackMood;
  /** Tags the user selected. Empty when they submitted without picking any. */
  tags: string[];
  /** Free-text follow-up, present only when the user chose to add more. */
  comment?: string;
};

type ChatFeedbackProps = {
  /**
   * Question shown in the first step, alongside the mood scale.
   * @default 'How are we doing so far?'
   */
  question?: string;

  /**
   * Overrides the follow-up question and tags offered for each mood.
   * Only the moods you provide are overridden — the rest keep their defaults.
   */
  moodConfig?: Partial<Record<ChatFeedbackMood, ChatFeedbackMoodConfig>>;

  /**
   * Callback fired when the user picks a mood, before they submit.
   * Use this if you want to record the rating even when the flow is abandoned.
   */
  onMoodSelect?: ({ mood }: { mood: ChatFeedbackMood }) => void;

  /**
   * Callback fired when the user submits their feedback.
   *
   * Fires once when tags are submitted, and again with `comment` populated if the user
   * goes on to add a free-text follow-up.
   */
  onSubmit?: (payload: ChatFeedbackSubmitPayload) => void;

  /**
   * Callback fired when the flow finishes and the component should be taken away.
   * `ChatFeedback` does not remove itself — hide it in response to this.
   */
  onDismiss?: () => void;

  /**
   * Message shown on the thank-you step.
   * @default 'Thanks for the feedback!'
   */
  thanksLabel?: string;

  /**
   * Label of the link that opens the free-text follow-up.
   * @default 'Add more feedback'
   */
  addCommentLabel?: string;

  /**
   * Placeholder for the free-text follow-up field.
   * @default 'Anything else you would like to share?'
   */
  commentPlaceholder?: string;

  /**
   * Whether the flow dismisses itself shortly after the thank-you step.
   * When false, `onDismiss` is never fired automatically and you control removal.
   * @default true
   */
  autoDismiss?: boolean;

  /**
   * Whether the flow fills the width available to it.
   *
   * `true` spreads each step edge to edge, pushing the trailing control to the far right.
   * Use it when the flow sits inside a surface that already has a width — a strip attached
   * above a composer, for example.
   *
   * `false` makes each step only as wide as its own content, so the whole flow can be
   * dropped into a bar that hugs it. Pair it with `alignSelf="center"` on the wrapper to get
   * a floating bar that shrinks to fit.
   *
   * @default true
   */
  isFullWidth?: boolean;

  /**
   * Artwork for the rating scale, one entry per mood.
   *
   * Required, because Blade ships no set for this scale yet. Pass a product's own icons or plain
   * emoji characters; each is rendered as given, inside a 20px box and hidden from assistive
   * technology, since the button already carries the mood's name.
   *
   * Declare the set once in a module and import it, rather than inline — when Blade's own artwork
   * lands, deleting that one object is the whole migration.
   *
   * Hover and selected states are drawn on the button, not the glyph, so they read the same
   * whether what you pass can be tinted or not.
   */
  moodIcons: ChatFeedbackMoodIcons;

  /**
   * Disables every control in the flow.
   * @default false
   */
  isDisabled?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type {
  ChatFeedbackMoodIcons,
  ChatFeedbackProps,
  ChatFeedbackMood,
  ChatFeedbackMoodConfig,
  ChatFeedbackStep,
  ChatFeedbackSubmitPayload,
};
