# Button

Blade's Button over the press model (`runes/button/press.svelte.ts`). Its
styles own React's axes: `variant` (`primary` filled, `secondary` and
`tertiary` outlined; tertiary takes `primary` or `white` only), `color`
(`primary` — the default, blue — `white`, `neutral`, `positive`,
`negative`) and `size` (`xsmall` 28px to `large` 48px). The label and any
icons are `children`: size an icon there (12px up to small, 16px above,
as in Blade).

## Behaviour props

| Prop | Notes |
| --- | --- |
| `type` | `button` (default, as Blade's) or `submit`, which presses the enclosing Form and mirrors its submission. An invalid form shakes a submit and reports to the Form's `onValidationFailed` |
| `href`, `target`, `rel` | An anchor that looks like the button; `isDisabled` does not apply, as in Blade |
| `validateForm` | A `button` that validates the Form first, shaking and reporting without submitting |
| `onClick` | Return a promise to drive the `press` busy cause |
| `isLoading` | Host-driven busy (`host` cause): Blade's DotLoader over the faded label, and the disabled look |
| `isDisabled` | Real `disabled`; busy never sets it, so focus is preserved |
| `loadingAnnouncement` | Live-region copy while busy; pass the app's localized string |
| `accessibilityLabel`, `testID`, `class` | The only escape hatches; `class` is merged last for layout |

## Busy is derived, never wired

A submit button mirrors the form's `submitting` (Enter-key submissions
included) on top of its own press settling and the host's `isLoading`. While
busy the button wears the disabled look (`aria-disabled`, which the
`disabled:` variant also matches) but keeps focus, with `aria-busy`, and
swallows presses itself. Blade disables it outright, which drops focus.

## Auto press

`autoPressAfter={seconds}` (fixed at mount): the button clicks itself when the
time is up — a real click, so `type` and `onClick` run as for a hand's —
and a press by hand ends the wait. A disabled or busy button does not count.
While it counts the core renders the `autoFill` part with
`--progress` (the elapsed share); blade sweeps a tint across. To show the
seconds, put a `Countdown` in the label.

API parity with Blade React: see `src-cx/API-PARITY.md`.
