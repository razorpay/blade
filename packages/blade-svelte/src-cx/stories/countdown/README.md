# Countdown

`packages/blade/components/countdown/Countdown.svelte` over
`createCountdownClock` (`runes/base/countdown.svelte.ts`): each tick recomputes the time
left from a deadline, so throttled timers cannot stretch it.

| Prop | Notes |
| --- | --- |
| `seconds` | How long; a new number starts over |
| `isPaused` | Holds the clock and keeps the time left |
| `urgentBelow` | At or under it the urgent look applies (blade: red) |
| `onElapsed` | Once, at zero |
| `children({ remaining, progress })` | Replaces the `mm:ss` figure |
| `accessibilityLabel` | Names the `role="timer"`; a timer is not live, so it never interrupts |
| `variant` | Style axis: `text` inherits size and colour, `pill` is the session chip |

What zero means (close the checkout, offer a resend) is the caller's.
