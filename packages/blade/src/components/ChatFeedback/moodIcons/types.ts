type MoodIconProps = {
  /**
   * Rendered size, in px unless a CSS length is given.
   *
   * Defaults to 28, which is what `ChatFeedbackMoodScale`'s slot gives it. The artwork is drawn
   * in a 24 unit box, so a face lands at 21px of that.
   */
  size?: string | number;
};

export type { MoodIconProps };
