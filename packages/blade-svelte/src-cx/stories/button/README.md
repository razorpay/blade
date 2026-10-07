# Button

Blade's Button over the press model (`runes/button/press.svelte.ts`). Its
styles own React's axes: `variant` (`primary` filled, `secondary`
outlined; Blade DSL deprecates `tertiary`, so it isn't ported), `color`
(`primary` — the default, blue — `white`, `neutral`, `positive`,
`negative`) and `size` (`xsmall` 28px to `large` 48px). The label is
`children`, Semi Bold and letter-spaced as Blade DSL's Button (Figma) sets it.

```svelte
<Button icon={WalletIcon}>Pay with wallet</Button>
<Button trailingIcon={ArrowRightIcon}>Continue</Button>
<Button icon={CloseIcon} accessibilityLabel="Close" />
```

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
| `icon`, `trailingIcon` | Glyphs before and after the label (Figma's leading and trailing icon), 12px up to small and 16px above; both may show. `icon` alone, with no `children`, makes an icon-only square button (28/32/36/48px, a 16px glyph) that `accessibilityLabel` names |
| `accessibilityLabel`, `testID`, `class` | The only escape hatches; `class` is merged last for layout |

## Why `icon` and `trailingIcon` are props

The button places its icons itself, because Figma spaces them differently
from the label. The label carries 4px on each side, which is the gap to an
icon and also the text's inset when there is none; the icons have no
spacing of their own and sit right at the padding.

| Size | Text only (left / right) | With icons (icon inset / gap) | Icon |
| --- | --- | --- | --- |
| xsmall, small | 12 / 12 | 8 / 4 | 12px |
| medium | 16 / 16 | 12 / 4 | 16px |
| large | 20 / 20 | 16 / 4 | 16px |

An icon in `children` would land inside the label's 4px and sit 4px too far
in, so it has its own prop.

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
