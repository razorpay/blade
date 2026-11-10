# Ray

Ray is Razorpay's AI mascot: a small character that sits on the chat input, idles, watches what's typed, looks at the pointer, flips a coin when clicked, and plays the states of an answer while it's being worked on (searching, calling a tool, writing a plan, working). It's drawn by Ray Studio's engine, the same code the dashboard prototype (flow 9) and the Ray Studio films page play, so what's tuned there is what ships here.

## Design

- Ray Studio (ray-spec): the engine, the canon scripts and the films. The user-tuned values every film reads are exported with it.
- Figma: watch frames 45:805, nudge 53:918, hide 46:851 (the typing and hop moves), the films' frames (searching 360:673, cash 521:1033, reading box 521:1113, …).

## API

```jsx
import { Ray, ChatInput } from '@razorpay/blade/components';

const inputRef = useRef(null);

// on the chat input: dashes in on the landing, idles, watches the caret while typing (and nudges when it stops), hops off when a question is sent
<Box position="relative">
  <Box position="absolute" bottom="100%" right="spacing.10">
    <Ray entrance="dash" idle="rotate" watchedInputRef={inputRef} isVisible={!isAnswering} />
  </Box>
  <ChatInput ref={inputRef} … />
</Box>

// in the answer's row: its states, handing over mid-move; at rest between them; drops out when it's done, and the row closes up
<Ray state={step} idle="rest" isVisible={!isDone} shouldUnmountWhenHidden isInteractive={false} />
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `entrance` | `'none' \| 'dash'` | `'none'` | How he arrives on mount. `dash` is the dashboard's landing: he dashes in along the surface from its left (from 200px inside the input's left edge when `watchedInputRef` is given), brakes, hops into place and starts his idle. Typing, the hop or an answer cuts it short. Skipped when he starts hidden, with reduced motion, and when his idle is Sleep (he's found asleep). |
| `state` | `'idle' \| 'searching' \| 'calling' \| 'writing' \| 'working'` | `'idle'` | What he's doing. The four answer states are his films; going from one to the next hands him over mid-move. |
| `idle` | `'rotate' \| 'rest' \| 'coffee' \| 'look' \| 'cash' \| 'reading' \| 'sleep' \| 'time-of-day'` | `'look'` | His idle while `state` is `idle`. A named idle renders the same every time; `rotate` and `time-of-day` are opt-in (they choose for him and use `localStorage`). `rotate` takes the next of coffee → look → cash → reading → sleep on each page load (as the dashboard does). `rest` keeps him at rest. `time-of-day` picks one by the viewer's clock as each Ray appears, and checks it again every half minute while he's up (an idle the hour has since ruled out gives way to another): the nightcap (Sleep) only 9pm–6am and likeliest then (half the loads), never Coffee then; Coffee likeliest 7–10am (half the loads); evenly otherwise, and not the last load's idle again unless it's the hour's favourite (the last pick is remembered in `localStorage`, `blade-ray-idle-time`). `sleep` is the sleep cycle: found asleep with the nightcap on, he wakes himself after about 10 s, looks around awake, and nods off again after a minute with nobody near; a pointer near him or a click wakes him, and the cap stays on for the visit (his flip is then the toss). |
| `size` | `'small' \| 'medium'` | `'medium'` | 38px (a side panel) or 48px (the dashboard and chat). |
| `isVisible` | `boolean` | `true` | `false`: he hops up and drops behind the surface he sits on; `true` again brings him back up out of it (as Blade's other animated surfaces, `isVisible`). Whatever he's playing finishes its bit first. |
| `shouldUnmountWhenHidden` | `boolean` | `false` | With `isVisible={false}`, his box is removed too once he has hopped off, so the row he sat in closes up (as Fade and Move); `isVisible` back lays it out again and he comes up out of the surface. Off by default because the layout shifts (the PR review, 2026-11-10: a hidden answer-row Ray left an empty box). |
| `watchedInputRef` | `RefObject<HTMLElement>` | – | The field he watches (named for that, not `inputRef`, which in Blade is a component's own input, as TimePicker's; the PR review): with text and focus he leans out to the caret and follows it (body along the four watch frames, eyes on the caret). After 10 s with no typing he nudges (canon Nudge: a look straight out, then back to the caret); typing during it takes him straight back to watching. There's no prop for the nudge: it comes with `watchedInputRef`. |
| `isInteractive` | `boolean` | `true` | The hover look (he looks at the pointer anywhere on the page) and the coin flip on click (click again while a coin is up for another). It works on every idle, and while he watches what's typed (the click takes the field's focus: he flips from where he is and settles back into his idle). Look around and Cash flip at once. Reading box and Coffee first finish what they're doing; Coffee's sip and Cash's reload always play out first. Sleep wakes him first. |
| `accessibilityLabel` | `string` | – | Exposes him as an image with this label; leave unset when he's decorative. |
| `testID`, styled props | | | As other Blade components. |

His box is his rest footprint and never changes size (unless `shouldUnmountWhenHidden` removes it once he's hidden). Everything he does around it (props, a coin in the air, the hop) draws outside it without affecting layout, so the parent must not clip it. To the right of his box and below it, his drawing stops 1 and 0.75 of his widths out (what he draws there reaches 0.38 and 0.27, measured over every idle, flip, film, the hop and the dash). So in a scrolling parent (a chat's message list) he adds at most that much scroll room, not his films' whole stage (the PR review, 2026-11-10). Above him and to his left it runs on, since nothing scrolls there.

## How it's built

- `engine/` is **generated** by `ray-spec/studio/blade/export.mjs` from Ray Studio: the engine (`rayCore.ts`), its stateful helpers (flip, nightcap, wardrobe, tour), the canon scripts, the films and the tunes. Never edit it here: change Ray Studio and export again.
- Each film keeps its page's own code and runs against `FilmHost`, a stand-in page: its canvases, a message channel for the `ready / start / leave / left / done / …` protocol, its saved tune, the stage's size. No iframes.
- `RayPlayer` is his own Ray for what has no film: rest, Look around, the hop (canon Hide), the typing watch, the hover look, and the coin flip.
- `RayEntrance` is the landing dash, on a canvas of its own wide enough for the run; his own Ray takes him from rest on the frame it ends.
- `RayMount` directs. Answer films hand over mid-move, and while the next film hasn't drawn yet, his own Ray holds the pose the last one left him in. A film takes him from rest and gives him back at rest, where both draw the same frame. An idle film plays its exit first (1.6× quick for typing and the hop). The flip always plays out. One loop draws everything, and it pauses while he's off-screen.
- His floor is the top of what he sits on. The stage is cut there only while something should go behind it: the hop down and a coin falling past. The rest of the time nothing's cut, so a prop he holds out over the box's edge (Coffee's cup) or below the answer's line (the magnifier's handle) stays whole.
- The coin flip's physics are made once per page in idle time (`flipPrepare`), from his rest; the pose he's really in is carried in as a gap that dies away on a critically damped spring as he squashes, and the gap from the flick's pose dies away the same way as his idle takes him back. Simulating it on the click cost 11–26 ms, one to three dropped frames at 120 Hz.
- Nothing heavy loads up front: the director, his own Ray, the engine and canon (about 57 KB gzipped) load with his first render (`import()`), so an app that imports Blade's components without rendering him never downloads them (the PR review, 2026-11-10); his box is laid out meanwhile from `rayBox.ts`, which a test keeps equal to the engine's sizes. Films load when first used: 13 KB of shared film helpers with the first film, then 5–15 KB per film. A film he's done with is freed (an answer's past states, an idle he's moved on from), so at most his idle's film and the answer's now and next are loaded.

## Accessibility

- Decorative by default (`aria-hidden`). `accessibilityLabel` makes him `role="img"`.
- The coin flip is a pointer delight with no keyboard equivalent, since it carries no information.
- `prefers-reduced-motion`: one still frame of him at rest, no animation. Turned on or off while he's up, he follows it (a new director takes over, still or moving).

## Platform

Web only. `Ray.native.tsx` throws "not yet implemented", like RazorSense.

## Open questions

- **Bundle size.** Films are loaded on demand now (130 KB gzipped if every film is used, 57 KB with his first render, none before). Stripping each film's Studio-only panel, undo and keyboard code during export would cut more.
- **A click mid-sip or mid-cash-run** costs one or two frames at the click: those films re-plan their bit then (a re-simulation). Moving the engine's physics to a worker would remove it.
- **`size` tokens.** Two sizes match today's dashboard (48) and sidekick (38). Investigate's 49.5px button isn't covered.
- **Not in v1:**
  - the wardrobe
  - the "Thinking (drop)" film
  - the Success state (the dashboard currently skips it)
- **`idle="rotate"` stores a counter** in `localStorage` (`blade-ray-idle`) to step the cycle per page load. Without storage, it starts at a random idle.
