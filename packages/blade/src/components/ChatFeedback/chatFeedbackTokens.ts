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
 * `feedbackIcons` is required, and this table carries everything *except* the icons.
 *
 * When a designed set does land it goes here, `feedbackIcons` becomes optional, and a `moodScale`
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
     * through `feedbackIcons` may pass something that cannot be tinted at all (a system emoji, a
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
    tags: ['Wrong answers', 'Too slow', 'Inaccurate', 'Other'],
    thanksLabel: "Thanks for flagging it — we'll look into this.",
  },
  dissatisfied: {
    question: 'Thanks. What could be better?',
    tags: ['Accuracy', 'Speed', 'Tone', 'Other'],
    thanksLabel: "Thanks — we'll work on this.",
  },
  satisfied: {
    question: 'Glad it helped! What worked well?',
    tags: ['Helpful', 'Fast', 'Clear', 'Other'],
    thanksLabel: 'Thanks for the feedback!',
  },
  'very-satisfied': {
    question: 'Love it! What stood out most?',
    tags: ['Nailed it', 'Super fast', 'Great tone', 'Other'],
    thanksLabel: 'Thanks — glad it helped!',
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

/**
 * Edge of the square a mood glyph is drawn in.
 *
 * Off the spacing scale, which stops at 24 and jumps to 32. A face is not an icon: an icon is one
 * shape read at a glance, while these carry eyes, a mouth and — on two of them — a thumb, and
 * every one has to survive the same pass. At the 20px this used to be, the faces landed around
 * 15px and read as coloured dots rather than as expressions.
 */
const chatFeedbackMoodGlyphSize = 28;

/**
 * Height of a mood button, and so of the tallest step the strip has to hold.
 *
 * The glyph plus `spacing[3]` of padding on each side.
 *
 * It is exported because the strip must reserve this much for *every* step, not just the mood
 * one. The three steps have different natural heights, and a strip that only reserves what the
 * current step needs changes height on each swap — pushing the composer below it up and down at
 * the exact moment someone is reading the step that just replaced the last one.
 *
 * Anything that sets the strip's height reads it from here so the two cannot drift, which they
 * did once already: the glyph grew from 20px and the reserved height was left behind, and the
 * composer started jumping 12px on every transition.
 */
const chatFeedbackMoodButtonSize = chatFeedbackMoodGlyphSize + 8 * 2;

/**
 * The tinted disc shown behind a glyph on hover, focus and selection.
 *
 * Smaller than the button on purpose. The button's size is a tap target and belongs at 44px; the
 * disc is decoration. Sizing the disc off the button would force a choice between a comfortable
 * target and a tidy circle — shrinking the target to tighten the circle is what let the
 * adjacent-rating mis-taps back in once already.
 *
 * At 36px it clears the 28px glyph by 4px on every side: enough to read as a halo behind the face
 * rather than as a chip around it, and still 4px inside the button it sits in.
 */
const chatFeedbackMoodDiscSize = 36;

/**
 * Space the tags step holds open for its submit control.
 *
 * Blade's `xsmall` icon-only `Button` measures 28px, plus `spacing[3]` of gap before it.
 *
 * It is reserved rather than occupied. The control is revealed on the first tag pick, and a button
 * that arrives *in* the flex row shoves every chip 36px to the left at the moment the user is
 * reading them — measured, not assumed. Holding the space and fading the control into it means the
 * row makes room instead of being pushed aside.
 */
const chatFeedbackSubmitRevealWidth = 28 + 8;

export {
  chatFeedbackMoods,
  chatFeedbackMoodTokens,
  chatFeedbackDefaultMoodConfig,
  chatFeedbackChipSize,
  chatFeedbackThanksDurationMs,
  chatFeedbackMoodGlyphSize,
  chatFeedbackMoodButtonSize,
  chatFeedbackMoodDiscSize,
  chatFeedbackSubmitRevealWidth,
};
