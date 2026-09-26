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
| `icon`, `iconPosition` | Icon data and `leading` (default) or `trailing`; the link sizes the glyph |
| `onClick` | Before navigation; `event.preventDefault()` cancels it |
| `isDisabled` | The anchor loses its `href` and is announced as a disabled link |
| `color`, `size` | Style axes, shared with Button's link variant |
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
