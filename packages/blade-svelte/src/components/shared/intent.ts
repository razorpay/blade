// The feedback intents Alert, Badge, ProgressBar and Toast share, as Blade
// names them (`feedback.*.{intent}`).
export const INTENTS = ['neutral', 'information', 'positive', 'notice', 'negative'] as const;

export type Intent = typeof INTENTS[number];
