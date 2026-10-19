# ProgressBar

Blade's ProgressBar. A `progress` bar shows how far along something is, and a
`meter` shows where a value sits in a range. Either one draws as a linear bar
or as a ring.

| Prop                  | Notes                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `variant`             | `linear` (default) or `circular`                                                                                                    |
| `type`                | `progress` (default: `role="progressbar"`, pulses, shows its floored percentage) or `meter` (`role="meter"`, static, no percentage) |
| `size`                | `small` (default) or `medium`: a 2px or 4px track. Circular adds `large`: 24, 48 or 72px across, with a 3, 5 or 7px stroke          |
| `color`               | A feedback colour (`neutral`, `information`, `positive`, `notice`, `negative`); unset, the primary surface's                        |
| `value`, `min`, `max` | Defaults 0, 0, 100. The value is clamped to the range                                                                               |
| `label`               | Above a linear bar and below a ring; also the default `accessibilityLabel`                                                          |
| `accessibilityLabel`  | Names the bar for assistive tech                                                                                                    |
| `isIndeterminate`     | Progress only: a short fill slides across and no value is reported. A ring ignores it                                               |
| `showPercentage`      | Progress only (default `true`): beside a linear bar's label; inside a ring above small, below a small one                           |
| `class`, `testID`     | As everywhere; a linear bar fills the width it is given                                                                             |

The component stays style-only. It sets `--progress` (0–100), and a CSS
transition moves the fill over 2xgentle with emphasized easing. A value
present at mount draws in place. To react when the bar completes, use an
`$effect` in the caller.
