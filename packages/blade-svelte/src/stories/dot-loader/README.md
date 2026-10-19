# DotLoader

Blade's indefinite three-dot loader: the dots rise in turn and settle back,
never dipping below the rest line.

| Prop                 | Notes                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `size`               | `small` (18px square, 3px dots), `medium` (24px, 4px, default), `large` (36px, 6px): medium scaled 0.75x and 1.5x            |
| `color`              | Icon's colours: `muted` (default), `default`, `subtle`, `primary`, `negative`, `positive`, `white`, `inherit` (the host's text) |
| `accessibilityLabel` | Announces the wait as `role="status"`. Without it the dots are `aria-hidden`, right where the host already announces it      |
| `class`, `testID`    | As everywhere                                                                                                                |

Each loop is 1.2s, and each dot starts 150ms after the one before it. Under
reduced motion the dots hold Figma's static pose, with the middle dot at its
peak. Button draws a DotLoader over its label while it is loading.
