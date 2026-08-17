import type { ChatFeedbackMood, ChatFeedbackMoodConfig } from './types';
import type { IconProps } from '~components/Icons';

/** Worst to best. Drives render order of the scale. */
const chatFeedbackMoods: ChatFeedbackMood[] = [
  'very-dissatisfied',
  'dissatisfied',
  'satisfied',
  'very-satisfied',
];

/**
 * ## Blade ships no artwork for this scale yet
 *
 * The four points, their colours and their names are settled; the glyphs are not. Rather than
 * ship a placeholder set and have products build on it, the component asks for the artwork:
 * `moodIcons` is required, and this table carries everything *except* the icons.
 *
 * When a designed set does land it goes here, `moodIcons` becomes optional, and a `moodScale`
 * prop picks between the sets. That direction is safe — a required prop becoming optional breaks
 * no one, which is why the artwork is missing rather than provisional.
 *
 * Blade's feedback ramp has three usable sentiments, so `satisfied` and `very-satisfied` share
 * `positive`; the design distinguished them with a yellow-green, which has no token equivalent.
 */
/** `currentColor` excluded so the value can also be resolved against the theme for CSS. */
type ChatFeedbackMoodColor = Exclude<IconProps['color'], 'currentColor' | undefined>;

/** The three sentiments the four moods map onto, as background tokens. */
type ChatFeedbackMoodSurfaceColor = `feedback.background.${
  | 'positive'
  | 'negative'
  | 'notice'}.subtle`;

const chatFeedbackMoodTokens: Record<
  ChatFeedbackMood,
  {
    color: ChatFeedbackMoodColor;
    /**
     * Filled behind the button when the mood is hovered or picked.
     *
     * Selection used to be carried entirely by the glyph — recoloured, and swapped for its filled
     * twin. That only works while Blade owns the artwork. A consumer supplying its own icons
     * through `moodIcons` may pass something that cannot be tinted at all (a system emoji, a
     * raster), and then two of the three selected cues silently vanish, leaving a 12% scale as the
     * only sign that an answer registered. Putting the state on the button instead means it reads
     * the same whatever is sitting on top of it.
     */
    surfaceColor: ChatFeedbackMoodSurfaceColor;
    label: string;
  }
> = {
  'very-dissatisfied': {
    color: 'feedback.icon.negative.intense',
    surfaceColor: 'feedback.background.negative.subtle',
    label: 'Terrible',
  },
  dissatisfied: {
    color: 'feedback.icon.notice.intense',
    surfaceColor: 'feedback.background.notice.subtle',
    label: 'Bad',
  },
  satisfied: {
    color: 'feedback.icon.positive.intense',
    surfaceColor: 'feedback.background.positive.subtle',
    label: 'Good',
  },
  'very-satisfied': {
    color: 'feedback.icon.positive.intense',
    surfaceColor: 'feedback.background.positive.subtle',
    label: 'Love it!',
  },
};

/**
 * Default follow-up copy. Deliberately product-agnostic — consumers override via `moodConfig`.
 */
const chatFeedbackDefaultMoodConfig: Record<ChatFeedbackMood, ChatFeedbackMoodConfig> = {
  'very-dissatisfied': {
    question: 'Sorry to hear that. What went wrong?',
    tags: ['Wrong answers', 'Too slow', 'Missed the point', 'Other'],
  },
  dissatisfied: {
    question: 'Thanks. What could be better?',
    tags: ['Accuracy', 'Speed', 'Tone', 'Other'],
  },
  satisfied: {
    question: 'Glad it helped! What worked well?',
    tags: ['Helpful', 'Fast', 'Clear', 'Other'],
  },
  'very-satisfied': {
    question: 'Love it! What stood out most?',
    tags: ['Nailed it', 'Super fast', 'Great tone', 'Other'],
  },
};

/**
 * Chip size used by the tags step. Exported so the alignment fix in `ChatFeedback` can read
 * the matching `chipGroupGapTokens` entry instead of hardcoding a value that would silently
 * drift if this size ever changes.
 */
const chatFeedbackChipSize = 'xsmall' as const;

/**
 * How long the thank-you step is held before the flow dismisses itself.
 *
 * Long enough to be read — the previous value came from `motion.delay.xgentle` (960ms), and on a
 * strip that is also fading out the confirmation was gone before it registered. Short enough that
 * nobody waits on it: this sits above a composer someone is trying to type in.
 *
 * A literal rather than a delay token because the scale steps 960 → 2000 with nothing between,
 * and both ends are wrong here. If a token lands in that gap, this should become it.
 */
const chatFeedbackThanksDurationMs = 1300;

export {
  chatFeedbackMoods,
  chatFeedbackMoodTokens,
  chatFeedbackDefaultMoodConfig,
  chatFeedbackChipSize,
  chatFeedbackThanksDurationMs,
};
