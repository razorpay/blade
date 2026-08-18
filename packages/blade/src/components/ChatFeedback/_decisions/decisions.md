# ChatFeedback 🙂

A compact, inline feedback flow for conversational surfaces. It walks the user from a four-point
mood scale, to a quick tag follow-up, to a confirmation — and then leaves. It draws no surface of
its own and it never removes itself.

Currently **web only**; the native counterpart throws until it is implemented.

## Design

- Figma: `Agentic Dashboard — Working File`, node `380:81103`
- The attached-to-a-composer arrangement is `ChatInput`'s `feedback` prop, specified at the end of
  this document.

## States

Three steps, one direction of travel, and one way back.

```
        ┌────────────── goBackToMood ──────────────┐
        ▼                                          │
     ┌──────┐   selectMood   ┌──────┐  submitTags  ┴─────────┐   after 1.3s   ┌──────────┐
     │ mood │ ─────────────► │ tags │ ───────────► │ thanks  │ ─────────────► │ dismissed │
     └──────┘   (+200ms)     └──────┘              └─────────┘   autoDismiss  └──────────┘
```

`dismissed` is not a step. The component has no such state — it fires `onDismiss` and keeps
rendering the confirmation until the host stops rendering it. That is deliberate: a component that
removes itself cannot be animated out by whatever contains it.

### mood

| | |
|---|---|
| Shows | the question, and four buttons carrying `moodIcons` |
| Sub-states | nothing selected · one selected (200ms, then `tags`) |
| Emits | `onMoodSelect` |

The 200ms hold exists so the selection is seen before the step changes. It is a `theme.motion.duration.quick` beat, not a magic number.

### tags

| | |
|---|---|
| Shows | back control, follow-up question, up to four chips, and the submit |
| Sub-states | nothing selected · some selected · **only the free-text tag** · mixed |
| Emits | `onTagsChange` on **every** change, `onSubmit` on submit |

Selecting a mood, or going back, also clears the tags — and both report through `onTagsChange`.
This matters more than it looks: see *Reporting* below.

### thanks

| | |
|---|---|
| Shows | a filled check and one line, whose copy follows the mood |
| Held for | `chatFeedbackThanksDurationMs` (1300ms) when `autoDismiss` |
| Emits | `onDismiss` |

Copy resolution is `thanksLabel` prop → `moodConfig[mood].thanksLabel` → a generic default. The
per-mood defaults differ by sentiment: someone who has just said the assistant got it wrong is
acknowledged, not thanked for a lovely contribution.

### Orthogonal to the steps

- **`isDisabled`** — every control inert, at any step.
- **`isFullWidth`** — each step spreads edge to edge, or hugs its content.
- **`isSubmitHidden`** — the step keeps its state; only the tick goes.

## Invariants

These are the properties worth testing, and the ones that were broken at some point during the
build:

1. **A tap resolves to the mood it looks like.** Targets are 32px around a 20px glyph, butted
   together for a 32px pitch. On a four-point scale, landing on the neighbour is a wrong answer,
   not a near miss.
2. **Selection is visible without relying on the glyph.** Supplied artwork may be untintable and
   has no filled twin, so hover and selected are drawn on the *button*.
3. **The flow never traps the user.** Every state has a way forward or back. This is the invariant
   the free-text arrangement broke three separate times.
4. **The host is never told less than the truth.** Any change to the selection is reported.
5. **Nothing is announced twice.** The mood's name is the button's accessible name; supplied
   artwork is `aria-hidden`.

## Reporting

`onTagsChange` fires from a single setter inside the hook, not from the chip group. Every route
that mutates the selection — the chips, picking a new mood, going back — goes through it.

This was originally wired to the chip group alone, and the two internal clears were silent. A host
mirroring the selection then held tags that no longer existed and acted on them: `ChatInput` kept
its composer in feedback mode after the strip had walked back to the mood step, with no tag
selected and no way out. One reporting path makes that drift impossible rather than unlikely.

**Corollary for hosts:** read the mode you are driving from a ref, not from state. These callbacks
can be invoked from a memoised closure belonging to an earlier render, and a state copy read there
may be stale. That is the second way the same bug appeared.

## Proposed API

```jsx
<ChatFeedback
  question="How's Ray doing so far?"
  moodIcons={moodIcons}
  onSubmit={({ mood, tags, comment }) => record(mood, tags, comment)}
  onDismiss={() => setShowFeedback(false)}
/>
```

### Props

```ts
type ChatFeedbackMood = 'very-dissatisfied' | 'dissatisfied' | 'satisfied' | 'very-satisfied';
type ChatFeedbackStep = 'mood' | 'tags' | 'thanks';
type ChatFeedbackMoodIcons = Record<ChatFeedbackMood, React.ReactNode>;

type ChatFeedbackMoodConfig = {
  /** Follow-up question shown once this mood is picked. */
  question: string;
  /** Quick-select tags offered for this mood. */
  tags: string[];
  /** Closing line for this mood. Defaults differ by sentiment. */
  thanksLabel?: string;
};

type ChatFeedbackSubmitPayload = {
  mood: ChatFeedbackMood;
  /** Tags selected. Empty when submitted without picking any. */
  tags: string[];
  /** Free text, present only when the host collected some. */
  comment?: string;
};

/** The parts of a running flow a host may need to drive. */
type ChatFeedbackControls = {
  submit: () => void;
  setTags: (tags: string[]) => void;
};

type ChatFeedbackProps = {
  /** @default "How are we doing so far?" */
  question?: string;

  /**
   * Artwork for the scale, one entry per mood. **Required** — Blade ships no set for this yet.
   * Rendered as given, in a 20px box, hidden from assistive technology.
   */
  moodIcons: ChatFeedbackMoodIcons;

  /** Overrides follow-up copy, tags and closing line per mood. Partial: unlisted moods keep defaults. */
  moodConfig?: Partial<Record<ChatFeedbackMood, ChatFeedbackMoodConfig>>;

  /** Closing line for every mood. Unset, the copy follows the mood. */
  thanksLabel?: string;

  onMoodSelect?: ({ mood }: { mood: ChatFeedbackMood }) => void;
  /** Fires on **every** change to the selection, from any route. */
  onTagsChange?: ({ tags }: { tags: string[] }) => void;
  onSubmit?: (payload: ChatFeedbackSubmitPayload) => void;
  /** The flow is finished. It does **not** remove itself — stop rendering it here. */
  onDismiss?: () => void;

  /** Dismisses itself 1.3s after the confirmation. @default true */
  autoDismiss?: boolean;
  /** Steps spread edge to edge, or hug their content. @default true */
  isFullWidth?: boolean;
  /** @default false */
  isDisabled?: boolean;

  /** Hides this flow's own tick, when the host is showing one. @default false */
  isSubmitHidden?: boolean;
  /** Receives a handle on the running flow, for a host with controls of its own. */
  controlsRef?: React.MutableRefObject<ChatFeedbackControls | null>;
  /** Free text gathered by the host, folded into the submit payload. */
  comment?: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;
```

## Host contract: `ChatInput`'s `feedback`

```jsx
<ChatInput
  placeholder="Ask anything..."
  feedback={{
    question: "How's Ray doing so far?",
    moodIcons,
    onSubmit: ({ mood, tags, comment }) => record(mood, tags, comment),
    onDismiss: () => setShowFeedback(false),
  }}
/>
```

```ts
type ChatInputFeedbackProps = Pick<
  ChatFeedbackProps,
  'question' | 'moodConfig' | 'moodIcons' | 'isDisabled' | 'onMoodSelect' | 'onSubmit' | 'onDismiss'
> & {
  /** @default true */
  isVisible?: boolean;
  /** The tag that collects free text instead of standing alone. @default 'Other' */
  freeTextTag?: string;
  /** Placeholder while the composer is collecting that text. @default 'Anything else? (optional)' */
  commentPlaceholder?: string;
};
```

Passing the object is the switch — there is no `showFeedback` boolean, in the same way `Tooltip`
has no `showTitle`. Omit it and the composer renders byte-for-byte as it does without the feature;
the surface is only drawn while the prompt is showing.

`isFullWidth`, `isSubmitHidden`, `controlsRef`, `comment` and `onTagsChange` are deliberately **not**
forwarded: they describe how the flow is laid out and driven, which is the composer's business, not
the caller's.

### The composer takeover

Picking `freeTextTag` hands the composer over:

| | |
|---|---|
| Placeholder | becomes `commentPlaceholder` |
| Chat draft | stashed, and restored on the way out |
| Action bar | upload link replaced by a dismissable `Feedback` tag and an `esc to cancel` hint |
| Focus | moves to the composer |
| Enter | submits the feedback. The chat path is **blocked**, not redirected |
| The tick | hidden — the composer's send arrow is the submit |
| Exits | Esc · the tag's ✕ · submitting · deselecting the tag · the prompt going away |

Every exit also **releases the tag**. Leaving it selected strands the user: the tick stays hidden
because the only tag picked is the free-text one, and the composer has gone back to chatting — a
choice made with no way left to send it.

Enter is blocked rather than rerouted because sending someone's candid feedback to the assistant as
a prompt is not a recoverable mistake.

## Alternatives considered

**A slot for the whole strip** (`header?: ReactNode`) — smaller API, and it would have kept
`ChatFeedback` out of Blade entirely. Rejected because a `ReactNode` slot has no representation in
the Figma DSL: designers could neither toggle nor preview it, and code/design parity breaks. It
would also hand every consumer the a11y, hit targets and selected state — the three things that
were hardest to get right here.

**A slot for the scale.** Same objection at smaller scale, plus it hides a contract types cannot
express ("an SVG that inherits `currentColor`"). `moodIcons` swaps the glyphs, not the control.

**`moodScale: 'faces' | 'thumbs'`.** Built, then removed: both values depended on artwork that is
not shipping in the first pass. A switch with no working position is worse than no switch. When a
designed set lands, `moodIcons` becomes optional and `moodScale` returns — required → optional
breaks nobody, which is why the artwork is *missing* rather than provisional.

**Its own free-text step.** The component used to own a `comment` step behind an
"Add more feedback" link. Removed: two places to type stacked vertically, and the one that looks
like the composer was not the one with focus.

## Open questions

1. **The host coupling is four props** — `onTagsChange`, `isSubmitHidden`, `controlsRef`, `comment`
   — which together express one idea: *the surrounding surface is collecting the free text*. It
   works, and every piece is load-bearing, but a single higher-level prop would be harder to
   misuse. Worth revisiting once a second host exists; premature to design for one.
2. **`controlsRef` is a prop rather than a forwarded ref.** The handle itself is published from a
   layout effect and delegates through refs, so it is neither written during render nor ever stale.
   A forwarded ref with `useImperativeHandle` would be the more idiomatic shape, but it would make
   the flow's identity a ref — which `ChatInput` already spends on the composer's own input.
3. **`freeTextTag` fails silently** when it matches no tag in `moodConfig` — the composer simply
   never engages. A `__DEV__` warning would fail fast instead.
4. **Native.** The whole component throws. The mood scale and tags step have no platform-specific
   requirement; the composer takeover does.
5. **Standalone free-text.** With the comment step gone, a surface without a composer — a floating
   bar, say — cannot collect free text at all.
