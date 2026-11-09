## Component Name

Ray

## Description

Ray is Razorpay's AI mascot, an animated character drawn on a canvas. On a chat input he idles, watches the caret while the user types (and nudges when typing stops), looks at the pointer and flips a coin when clicked; he hops off the input while an answer is being worked on. A second Ray in the answer's row plays the answer's states (`searching`, `calling`, `writing`, `working`) and hands over between them mid-move. Use it for AI assistant surfaces such as chat inputs and answer rows.

## Important Constraints

- `Ray` is **web only**; on React Native it throws "not yet implemented".
- His box is his rest footprint (48px or 38px wide) and never changes size, but what he does draws outside it (props, a coin in the air, the hop). Don't put him inside a parent that clips its overflow.
- `inputRef` must point at the actual `<input>` or `<textarea>` he watches (Blade's `ChatInput` forwards its textarea).

## TypeScript Types

The following types represent the props that the Ray component accepts.

```typescript
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
   * When provided, Ray is exposed to assistive tech as an image with this label while he's visible (with `isVisible={false}`
   * he's hidden from it too). Leave it unset when he is decorative (the surrounding UI already says what's happening), so screen
   * readers skip him.
   */
  accessibilityLabel?: string;
} & TestID &
  StyledPropsBlade;
```

## Usage Guidelines

**Do**

- Sit the Ray on the chat input's top edge, near its right end (absolutely positioned above it), and pass the input as `inputRef` so he watches what's typed.
- Set `isVisible={false}` on the input's Ray while an answer is being worked on, and show a second Ray in the answer's row with `state` stepping through `searching`, `calling`, `writing` and `working`.
- Give the answer row's Ray `idle="rest"` and `isInteractive={false}`, so he rests between states and when the answer is done.
- Use `entrance="dash"` only on the Ray that's on screen as the page lands (the chat input's).
- Use `idle="rotate"` or `idle="time-of-day"` on the dashboard's chat input to vary his idle across visits; leave a named idle where he should look the same every time (tests, docs, screenshots).
- Use `size="small"` in side panels and `size="medium"` on the dashboard and full-page chat.
- Leave `accessibilityLabel` unset when the surrounding UI already says what's happening; set it only when Ray carries meaning on his own.

**Don't**

- Don't render him inside a container with `overflow: hidden`; give him room above and around his box instead.
- Don't set `entrance="dash"` on an answer row's Ray; it's for the landing only.
- Don't drive `state` on the chat input's Ray; hide it with `isVisible={false}` and use a separate Ray in the answer's row.
- Don't use Ray as a loading spinner for non-AI work; use `Spinner` or `ProgressBar`.

## Example

### Chat Input With Ray

Ray sits on the chat input: he dashes in on landing, idles by the time of day, watches the caret while the user types and hops off while the question is being answered.

```jsx
import React, { useRef, useState } from 'react';
import { Box, ChatInput, Ray } from '@razorpay/blade/components';

const ChatInputWithRay = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);

  return (
    <Box position="relative" width="100%" maxWidth="720px" marginTop="spacing.11">
      <Box position="absolute" bottom="100%" right="spacing.10" zIndex={2}>
        <Ray entrance="dash" idle="time-of-day" inputRef={inputRef} isVisible={!isAnswering} />
      </Box>
      <Box position="relative" zIndex={1}>
        <ChatInput
          ref={inputRef}
          value={value}
          onChange={({ value: next }) => setValue(next ?? '')}
          onSubmit={() => {
            setValue('');
            setIsAnswering(true);
            setTimeout(() => setIsAnswering(false), 8000);
          }}
          placeholder="Ask Ray anything…"
        />
      </Box>
    </Box>
  );
};

export default ChatInputWithRay;
```

### Answer Row States

A second Ray in the answer's row plays the answer's states as it's worked on, rests when it's done, and drops out of the row with `isVisible={false}`.

```jsx
import React, { useEffect, useState } from 'react';
import type { RayState } from '@razorpay/blade/components';
import { Box, Ray, Text } from '@razorpay/blade/components';

const LABELS: Record<RayState, string> = {
  idle: 'Done',
  searching: 'Searching your settlements…',
  calling: 'Fetching your settlements…',
  writing: 'Writing a plan…',
  working: 'Putting things together',
};

const STEPS: RayState[] = ['searching', 'calling', 'writing', 'working', 'idle'];

const AnswerRow = () => {
  const [step, setStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (step < STEPS.length - 1) {
      const timer = setTimeout(() => setStep((s) => s + 1), 3000);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setIsDone(true), 2000);
    return () => clearTimeout(timer);
  }, [step]);

  const state = STEPS[step];

  return (
    <Box display="flex" alignItems="flex-end" gap="spacing.4" marginTop="spacing.8">
      <Ray
        state={state}
        idle="rest"
        isVisible={!isDone}
        isInteractive={false}
        accessibilityLabel={LABELS[state]}
      />
      <Text size="small" color="surface.text.gray.muted">
        {LABELS[state]}
      </Text>
    </Box>
  );
};

export default AnswerRow;
```

### Side Panel Ray

A smaller Ray for a side panel, with a fixed idle and no pointer reactions.

```jsx
import React from 'react';
import { Box, Ray, Text } from '@razorpay/blade/components';

const SidePanelRay = () => {
  return (
    <Box display="flex" alignItems="flex-end" gap="spacing.3" paddingTop="spacing.8">
      <Ray size="small" idle="look" isInteractive={false} testID="side-panel-ray" />
      <Text size="small">Ray is here to help</Text>
    </Box>
  );
};

export default SidePanelRay;
```
