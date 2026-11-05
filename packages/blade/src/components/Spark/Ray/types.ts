import type { TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

/**
 * What Ray is doing. `idle` is his own idle (see `idle`); the rest are the states he plays while an answer is being
 * worked on, each one his Ray Studio film: `searching` (the magnifying glass), `calling` (a tool or MCP call: the headset),
 * `writing` (writing a plan) and `working` (the laptop). Moving from one of these to the next hands him over mid-move.
 */
type RayState = 'idle' | 'searching' | 'calling' | 'writing' | 'working';

/**
 * His idle. `rotate` takes the next one of the cycle (coffee, look, cash, reading, sleep) on each page load, as the dashboard does.
 * `rest` keeps him at rest (breathing, blinking, the hover look): for a Ray between an answer's states, like the answer's row.
 * `time-of-day` picks one by the viewer's clock as each Ray appears: the nightcap (Sleep) only at night, 9pm–6am, and likeliest
 * then (half the time), never Coffee then; Coffee likeliest 7–10am (half the time); evenly otherwise, and not the last Ray's
 * idle again unless it's the hour's favourite. While he's up the clock's checked again every half minute: an idle the hour has
 * since ruled out (Coffee at 9pm, the nightcap at 6am) gives way to another.
 */
type RayIdle = 'rotate' | 'rest' | 'coffee' | 'look' | 'cash' | 'reading' | 'sleep' | 'time-of-day';

type RaySize = 'small' | 'medium';

type RayProps = {
  /**
   * How he arrives when he first appears. `dash`: the dashboard's landing: he dashes in along the surface from its left (from 200px
   * inside the input's left edge when `inputRef` is given), loads up, brakes, hops into place and starts his idle. It plays once, on
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
   * His width: `small` is 38px (a side panel), `medium` is 48px (the dashboard and chat).
   *
   * @default 'medium'
   */
  size?: RaySize;
  /**
   * Ray sits on a surface (a chat input, a card). Set to `false`, he hops up and drops behind it; `true` again, he comes
   * back up out of it and lands. His own box keeps its size either way, so the layout never moves.
   *
   * @default true
   */
  isVisible?: boolean;
  /**
   * The text field he watches: an `<input>` or a `<textarea>` (the ref Blade's ChatInput, TextArea or TextInput forwards
   * works as it is). While it has text and focus he leans out towards the caret and follows it with his body and eyes;
   * when it's cleared or loses focus he goes back to his idle.
   */
  inputRef?: React.RefObject<HTMLElement>;
  /**
   * Whether he reacts to the pointer: he looks at it wherever it is on the page, and a click on him flips a coin (click
   * again while it's up for another).
   *
   * @default true
   */
  isInteractive?: boolean;
  /**
   * When provided, Ray is exposed to assistive tech as an image with this label. Leave it unset when he is decorative
   * (the surrounding UI already says what's happening), so screen readers skip him.
   */
  accessibilityLabel?: string;
  /**
   * @private Every look in his films this many px of his box lower (− = higher): his eyes, and the glass that rides his open
   * eye. Button's `hasRay` lifts them, as flow 9's Investigate with Ray does.
   */
  _lookY?: number;
  /**
   * @private How much bigger than his box he's shown (a scale transform round him, as in Button's `hasRay`): his canvases are
   * drawn that much finer, so he stays sharp.
   */
  _scale?: number;
} & TestID &
  StyledPropsBlade;

export type { RayProps, RayState, RayIdle, RaySize };
