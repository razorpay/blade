# Link

**Link goes somewhere; Button does something.** A `Link` is always an `<a>`
with an `href`. An action that should read as a link is
`<Button variant="link">` — a real `<button>` with all of Button's behaviour
(async press, busy state, `type`), inline in the text.

Both wear the same look, from one style module
(`components/link/styles.ts`): `resolveLink` and Button's `link` variant
call the same `linkLook(color, size)`, and a test asserts every Link class is
on the button.

| Prop | Notes |
| --- | --- |
| `href` | Required |
| `target`, `rel` | `noopener noreferrer` is added for `_blank`; caller tokens are kept |
| `download` | As on `<a>` |
| `icon`, `trailingIcon` | Glyphs before and after the text (Figma's leading and trailing icon), 12px at xsmall and small, 16px above; both may show. `icon` alone is an icon-only link, which `accessibilityLabel` names |
| `onClick` | Before navigation; `event.preventDefault()` cancels it |
| `isDisabled` | The anchor loses its `href` and is announced as a disabled link |
| `color`, `size` | Style axes, shared with Button's link variant: Blade DSL's Link (Figma) colours `primary`, `white`, `neutral`, `positive`, `negative`, and sizes `xsmall` to `large` (10/13 to 16/24, Medium, letter-spaced) |
| `accessibilityLabel`, `class`, `testID` | As everywhere |

On `Button variant="link"`, an icon goes in the children (`<Icon>`), as with
every Button.

## Router

An app router plugs in through the `navigate` adapter
(`provideAdapters({ navigate: (href, event) => boolean })`). Link calls it
only for a click the router may own — primary button, no modifier, no
`target`, no `download`, an internal `href`, not already prevented
(`isRoutableClick` in `runes/link`) — and cancels the browser's navigation when it
returns `true`. New tabs, downloads and other origins stay the browser's.
Because a Link is always a real anchor, a router that intercepts anchor
clicks at the document works too.

## Why `icon` and `trailingIcon` are props

Figma's Link is one row: the leading icon, the text and the trailing icon,
4px apart. The icons carry that gap; the text has no inset of its own, so a
text-only link is exactly its words and sits flush in a sentence.

| Size | Icon | Gap to the text |
| --- | --- | --- |
| xsmall, small | 12px | 4px |
| medium, large | 16px | 4px |

The link places the icons, sized and spaced for its size and set on the
text's midline, which an icon in `children` would not be.

