import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

/**
 * What Ray is doing. `idle` is his own idle (see `idle`); the rest are the states he plays while an answer is being
 * worked on, each one his Ray Studio film: `searching` (the magnifying glass), `thinking` (the same magnifying glass, for
 * an answer whose steps are named thinking), `reading` (the box with the papers coming out), `calling` (a tool or MCP call:
 * the headset), `writing` (writing a plan) and `working` (the laptop). Moving from one of these to the next hands him over
 * mid-move. A Ray that appears in one of them (an answer's row) comes up out of his surface first.
 */
type RayState = 'idle' | 'searching' | 'thinking' | 'reading' | 'calling' | 'writing' | 'working';

/**
 * His idle. `rotate` takes the next one of the cycle (coffee, look, cash, reading, sleep) on each page load, as the dashboard does.
 * `rest` keeps him at rest (breathing, blinking, the hover look): for a Ray between an answer's states, like the answer's row.
 * `time-of-day` picks one by the viewer's clock as each Ray appears: the nightcap (Sleep) only at night, 9pm–6am, and likeliest
 * then (half the time), never Coffee then; Coffee likeliest 7–10am (half the time); evenly otherwise, and not the last Ray's
 * idle again unless it's the hour's favourite. While he's up the clock's checked again every half minute: an idle the hour has
 * since ruled out (Coffee at 9pm, the nightcap at 6am) gives way to another. He wears the nightcap only while Sleep is his idle
 * (asleep or dozing, and through an answer meanwhile): the idle after it starts without it.
 */
type RayIdle = 'rotate' | 'rest' | 'coffee' | 'look' | 'cash' | 'reading' | 'sleep' | 'time-of-day';

type RaySize = 'small' | 'medium';

/** How an answer ended (`outcome`): his success, or his error (sad). */
type RayOutcome = 'success' | 'error';

type RayProps = {
  /**
   * How he arrives when he first appears. `dash`: the dashboard's landing: he dashes in along the surface from its left (from 200px
   * inside the input's left edge when `watchedInputRef` is given), loads up, brakes, hops into place and starts his idle. It plays once, on
   * mount; typing, the hop or an answer cuts it short. It's skipped when he starts hidden, with reduced motion, and when his idle is
   * Sleep (he's found asleep).
   *
   * @default 'none'
   */
  entrance?: 'none' | 'dash';
  /**
   * What Ray is doing.
   *
   * @default 'idle'
   */
  state?: RayState;
  /**
   * Which idle he plays while `state` is `idle`. A named idle renders the same every time; `rotate` and `time-of-day` choose
   * for him (per page load, or by the clock) and remember the last pick in `localStorage` (`blade-ray-idle`,
   * `blade-ray-idle-time`), so they're opt-in.
   *
   * @default 'look'
   */
  idle?: RayIdle;
  /**
   * His box, the room he takes in your layout: `small` is 38 × 31.51px (a side panel), `medium` is 48 × 39.8px (the dashboard and
   * chat). It's his rest footprint and stays that size whatever he does; what he does around it draws outside it.
   *
   * @default 'medium'
   */
  size?: RaySize;
  /**
   * Ray sits on a surface (a chat input, a card). Set to `false`, he hops up and drops behind it; `true` again, he comes
   * back up out of it and lands. His own box keeps its size either way, so the layout never moves (unless
   * `shouldUnmountWhenHidden` is set).
   *
   * @default true
   */
  isVisible?: boolean;
  /**
   * By default, with `isVisible={false}` his box stays (empty) so the layout never moves. When this is set, his box is removed
   * as well once he has hopped off (whatever he was playing finishes first), so the row he sat in closes up. With
   * `isVisible` back, his box comes back and he comes up out of the surface again.
   *
   * **Warn:** the layout shifts when his box is removed, so check the container it's in.
   *
   * @default false
   */
  shouldUnmountWhenHidden?: boolean;
  /**
   * The text field he watches (not an input of his own): an `<input>` or a `<textarea>` (the ref Blade's ChatInput, TextArea
   * or TextInput forwards works as it is, and so does a `useRef<HTMLTextAreaElement>(null)` under React 18's or 19's types).
   * While it has text and focus he leans out towards the caret and follows it with his body and eyes; when it's cleared or
   * loses focus he goes back to his idle.
   */
  watchedInputRef?: React.RefObject<HTMLElement | null>;
  /**
   * Whether he reacts to the pointer: he looks at it wherever it is on the page, and a click on him flips a coin (click
   * again while it's up for another). It's a delight with nothing for the app to do, so it has no handler and no keyboard
   * equivalent; turn it off where he only shows what's happening (an answer's row).
   *
   * @default true
   */
  shouldReactToPointer?: boolean;
  /**
   * When provided, Ray is exposed to assistive tech with this label while he's visible (with `isVisible={false}` he's hidden
   * from it too): while `state` is an answer state, as a `status` region (as DotLoader is), so a label that changes with the
   * state can be announced (screen readers announce a live region's text more reliably than its label); at rest, as an image.
   * Leave it unset when he is decorative (the surrounding UI already says what's happening), so screen readers skip him.
   */
  accessibilityLabel?: string;
  /**
   * While `true`, he's offline: he goes grey, his eyes twitch and every few seconds he glitches. Back to `false`, he jumps back
   * online (his colour floods back) and goes on with his idle. It wins over everything else he's doing: an answer's states, the
   * mic, typing. The same prop as on RazorSense, so a page passes one value to both.
   *
   * @default false
   */
  isOffline?: boolean;
  /**
   * While `true`, he's listening: a mic whips out round his side and he holds it out, nodding along while you talk. Back to
   * `false`, the mic whips back in. Its level comes from `voiceStream`; without one he still holds the mic out, he just doesn't
   * react to talking. The same prop as on RazorSense.
   *
   * @default false
   */
  isListening?: boolean;
  /**
   * The voice he listens to while `isListening`: the `MediaStream` your page got from `getUserMedia` for its own voice input.
   * He only reads its level, once a frame; he never opens the mic himself and never records. The same prop as on RazorSense.
   */
  voiceStream?: MediaStream;
  /**
   * How the answer ended, played once when it's set: `success`, a jump with confetti and a little dance; `error`, a sigh and a
   * slow shake of his eyes. It waits for an answer's states to end, and for him to be back on his surface (`isVisible`), so set
   * it as the answer finishes; clear it (`undefined`) with the next question. Set it again after clearing it to play it again.
   * The same prop as on RazorSense.
   */
  outcome?: RayOutcome;
  /**
   * @private Every look in his films this many px of his box lower (− = higher): his eyes, and the glass that rides his open
   * eye. Button's Ray hover (`aiHover="ray-…"`) lifts them, as flow 9's Investigate with Ray does.
   */
  _lookY?: number;
  /**
   * @private How much bigger than his box he's shown (a scale transform round him, as in Button's Ray hover): his canvases are
   * drawn that much finer, so he stays sharp.
   */
  _scale?: number;
  /**
   * @private A state whose film stays loaded while he's idle, so it starts at once when asked (Button's Ray hover: his search
   * the moment the button is hovered).
   */
  _preloadState?: RayState;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

export type { RayProps, RayState, RayIdle, RaySize, RayOutcome };
