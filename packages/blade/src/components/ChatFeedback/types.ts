import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

/** The four points of the sentiment scale, worst to best. */
type ChatFeedbackMood = 'very-dissatisfied' | 'dissatisfied' | 'satisfied' | 'very-satisfied';

type ChatFeedbackStep = 'mood' | 'tags' | 'thanks';

type ChatFeedbackMoodConfig = {
  /** Follow-up question shown once this mood is picked */
  question: string;
  /** Quick-select tags offered for this mood */
  tags: string[];
  /**
   * Closing line for this mood.
   *
   * A single thank-you across all four points rings false at the unhappy end: someone who has
   * just said the assistant got it wrong is told their feedback was lovely to receive. The
   * negative moods acknowledge and commit to something instead.
   */
  thanksLabel?: string;
};

/** One glyph per point of the scale. */
type ChatFeedbackIcons = Record<ChatFeedbackMood, React.ReactNode>;

/** The parts of a running flow a host may need to drive. */
type ChatFeedbackControls = {
  /** Submits the current mood and tags, as the flow's own tick would. */
  submit: () => void;
  /** Replaces the selected tags. */
  setTags: (tags: string[]) => void;
};

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
   * Callback fired whenever the selected tags change.
   *
   * Use it to react to a particular tag being picked — a host that wants to collect free text in
   * its own input rather than this component's, for example.
   */
  onTagsChange?: ({ tags }: { tags: string[] }) => void;

  /**
   * Hides this flow's own submit control.
   *
   * Set it when the surrounding surface is showing a submit of its own — a composer collecting
   * the free-text comment, say. Two ticks on screen doing the same thing is worse than one in the
   * place the user is already looking.
   */
  isSubmitHidden?: boolean;

  /**
   * Receives a handle on this flow, so a surrounding surface can drive it.
   *
   * Set when the host has controls of its own that must act on the same state — a composer that
   * collects the free-text comment needs to submit the flow from its own send button, and to
   * release the tag again when the user backs out of typing.
   */
  controlsRef?: React.MutableRefObject<ChatFeedbackControls | null>;

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
   * Message shown on the thank-you step, for every mood.
   *
   * Leave it unset to use the per-mood copy from `moodConfig`, which differs by sentiment.
   */
  thanksLabel?: string;

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
   * Optional — Blade ships an animated set and uses it when this is omitted, so the component
   * renders properly on install. Supply your own to use a product's icon set, or plain emoji
   * characters; each is rendered as given, in a fixed box and hidden from assistive technology,
   * since the button already carries the mood's name.
   *
   * Declare a replacement once in a module and import it, rather than inline — swapping the scale
   * should be one edit rather than one per surface.
   *
   * Hover and selected states are drawn on the button, not the glyph, so they read the same
   * whether what you pass can be tinted or not.
   */
  feedbackIcons?: ChatFeedbackIcons;

  /**
   * Disables every control in the flow.
   * @default false
   */
  isDisabled?: boolean;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type {
  ChatFeedbackControls,
  ChatFeedbackIcons,
  ChatFeedbackProps,
  ChatFeedbackMood,
  ChatFeedbackMoodConfig,
  ChatFeedbackStep,
  ChatFeedbackSubmitPayload,
};
