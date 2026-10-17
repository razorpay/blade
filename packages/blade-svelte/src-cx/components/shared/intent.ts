// The intent colours Badge, Card and EmptyState share. Semantic tokens only:
// Blade's feedback pairs — `feedback.background.{intent}.{subtle|intense}` —
// with Badge's text on them (`feedback.text.{intent}.intense` on the subtle
// fill, `surface.text.staticWhite.normal` on the intense one). The hairline
// is the intent's subtle border, for the parts that draw one.
export const INTENTS = ['neutral', 'information', 'positive', 'notice', 'negative'] as const;

export type Intent = typeof INTENTS[number];

/** A tinted surface with readable text and a matching hairline. */
export const INTENT_SUBTLE: Record<Intent, string> = {
  neutral:
    'border-feedback-neutral-subtle bg-feedback-neutral-subtle text-feedback-neutral-intense',
  information:
    'border-feedback-information-subtle bg-feedback-information-subtle text-feedback-information-intense',
  positive:
    'border-feedback-positive-subtle bg-feedback-positive-subtle text-feedback-positive-intense',
  notice: 'border-feedback-notice-subtle bg-feedback-notice-subtle text-feedback-notice-intense',
  negative:
    'border-feedback-negative-subtle bg-feedback-negative-subtle text-feedback-negative-intense',
};

/** A filled surface with light text. */
export const INTENT_INTENSE: Record<Intent, string> = {
  neutral: 'border-transparent bg-feedback-neutral-intense text-surface-static-white-normal',
  information:
    'border-transparent bg-feedback-information-intense text-surface-static-white-normal',
  positive: 'border-transparent bg-feedback-positive-intense text-surface-static-white-normal',
  notice: 'border-transparent bg-feedback-notice-intense text-surface-static-white-normal',
  negative: 'border-transparent bg-feedback-negative-intense text-surface-static-white-normal',
};
