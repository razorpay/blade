# Button

The component is `packages/blade/components/button/Button.svelte` over the
`createButton` model. Its styles (`components/button/index.ts`) own the
`variant`, `color` and `size` axes and the loading snippet.

## Behaviour props

| Prop | Notes |
| --- | --- |
| `type` | The HTML type: `submit` (default, as HTML's; the button mirrors the form's submission) or `button`. An invalid form shakes a submit and reports to the Form's `onValidationFailed` |
| `validateForm` | A `button` that validates the Form first, shaking and reporting without submitting |
| `onClick` | Return a promise to drive the `press` busy cause |
| `isLoading` | Host-driven busy (`host` cause) |
| `isDisabled` | Real `disabled`; busy never sets it, so focus is preserved |
| `loadingAnnouncement` | Live-region copy while busy; pass the app's localized string |
| `accessibilityLabel`, `testID`, `class` | The only escape hatches; `class` is merged last for layout |

## Busy is derived, never wired

A submit button mirrors the form's `submitting` (Enter-key submissions
included) on top of its own press settling and the host's `isLoading`. While
busy the button stays enabled with `aria-busy` and swallows presses itself.

## Auto press

`autoPressAfter={seconds}` (fixed at mount): the button clicks itself when the
time is up — a real click, so `type` and `onClick` run as for a hand's —
and a press by hand ends the wait. A disabled or busy button does not count.
While it counts the core renders the `autoFill` part with
`--progress` (the elapsed share); blade sweeps a tint across. To show the
seconds, put a `Countdown` in the label.
