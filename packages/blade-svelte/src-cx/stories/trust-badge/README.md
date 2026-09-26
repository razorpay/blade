# TrustBadge

The "Razorpay Trusted Business" marker. Style-only: no behaviour model
behind it, nothing in the core.

| Prop | Notes |
| --- | --- |
| `label` | Required: the library ships no copy, the app passes the translated line |
| `variant` | `default` — the shield and the line in a tinted pill. `icon-only` — the shield alone |
| `class`, `testID` | As everywhere |

Beside its line the shield is decoration (`aria-hidden`); alone it is an image
named by `label`. The shield keeps its own colours: a brand mark is not themed, so it is the
component's private asset and not part of `icons`, which is `currentColor`-only.
