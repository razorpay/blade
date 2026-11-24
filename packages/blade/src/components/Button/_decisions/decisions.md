# Button Decisions <!-- omit in toc -->

- [Design](#design)
- [Internal BaseButton Component](#internal-basebutton-component)
  - [BaseButton API](#basebutton-api)
- [Button Component](#button-component)
  - [Button API](#button-api)
- [AI Hovers (`aiHover`)](#ai-hovers-aihover)
- [Component Breakdown](#component-breakdown)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=5200%3A0) to all variants of the Button component

## Internal BaseButton Component

Internal component that exposes certain extra props to enable creation of Component Level Action Buttons like `positive`, `negative`, `neutral`

### BaseButton API

| Prop         | Type                                                      | Required | Default   | Description                                                                                                                                                                                                                                                                                                                                      |
| ------------ | --------------------------------------------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| variant      | `primary`, `secondary`, `tertiary`                        | No       | `primary` | - The variant of the button to be rendered.                                                                                                                                                                                                                                                                                                      |
| intent       | `positive`,`negative`, `notice`, `information`, `neutral` | No       | undefined | The intent of the button to be rendered.<br><br> Note: <br> - We will use this to set the intent for internal Blade components that have positive, negative, notice, info, or neutral buttons like an Alert component<br> - All the variants of the button will not be using any intent since it would only be required for internal components. |
| contrast     | `low`, `high`                                             | No       | `low`     | The contrast of the button to be rendered.<br><br> Note: We need this for internal Blade components since a `positive` intent could have a `high` as well as a `low` contrast button                                                                                                                                                             |
| size         | `large`, `medium`, `small`, `xsmall`                      | No       | `medium`  | The size of the button to be rendered.                                                                                                                                                                                                                                                                                                           |
| children     | `string`                                                  | No       | undefined | The text to be rendered within the button.                                                                                                                                                                                                                                                                                                       |
| icon         | `Icon`                                                    | No       | undefined | The Blade `Icon` component to be rendered within the button.                                                                                                                                                                                                                                                                                     |
| iconPosition | `left`, `right`                                           | No       | `right`   | The position of the rendered icon.                                                                                                                                                                                                                                                                                                               |
| isDisabled   | `boolean`                                                 | No       | `false`   | Control whether the button is disabled or not.                                                                                                                                                                                                                                                                                                   |
| isFullWidth  | `boolean`                                                 | No       | `false`   | Allows the button to take up the full width of its parent.                                                                                                                                                                                                                                                                                       |
| onClick      | `(event: SyntheticEvent) => void`                         | No       | undefined | The function to be called when the button is clicked. `onClick` will receive `SyntheticEvent` as a callback.                                                                                                                                                                                                                                     |
| type         | `button`, `submit`, `reset`                               | No       | `button`  | Specifies the type of button to be rendered.<br><br> Note: This prop will be ignored for React Native                                                                                                                                                                                                                                            |

## Button Component

This will be the Button component that is exposed to our consumers and will be a wrapper on top of `BaseButton` component

### Button API

| Prop         | Type                                 | Required | Default   | Description                                                                                                  |
| ------------ | ------------------------------------ | -------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| variant      | `primary`, `secondary`, `tertiary`   | No       | `primary` | - The variant of the button to be rendered.                                                                  |
| size         | `large`, `medium`, `small`, `xsmall` | No       | `medium`  | The size of the button to be rendered.                                                                       |
| children     | `string`                             | No       | undefined | The text to be rendered within the button.                                                                   |
| icon         | `Icon`                               | No       | undefined | The Blade `Icon` component to be rendered within the button.                                                 |
| iconPosition | `left`, `right`                      | No       | `right`   | The position of the rendered icon.                                                                           |
| isDisabled   | `boolean`                            | No       | `false`   | Control whether the button is disabled or not.                                                               |
| isFullWidth  | `boolean`                            | No       | `false`   | Allows the button to take up the full width of its parent.                                                   |
| onClick      | `(event: SyntheticEvent) => void`    | No       | undefined | The function to be called when the button is clicked. `onClick` will receive `SyntheticEvent` as a callback. |
| type         | `button`, `submit`, `reset`          | No       | `button`  | Specifies the type of button to be rendered.<br><br> Note: This prop will be ignored for React Native        |

- **Why are we not exposing `contrast` prop for the `Button` Component?**
  The Button component will only have a `variant` prop that would allow you to choose the kind of button you want. `contrast` is only required when we are using it along with `intent` for _internal_ Blade components like an `Alert` that could have a `low` as well as `high` contrast positive-intent button. Our assumption is that our products will not require a standalone low-contrast-positive-button (except a couple edge cases where we would encourage using custom buttons). We're doing this to ensure these different combinations of buttons don't get over-used within our products leading to breakage in the design language. But the fact that we have these capabilities built in the `BaseButton` itself would ensure that _we can_ expose these to our consumers when we see a massive demand for it.

## AI Hovers (`aiHover`)

- **One prop, one value per behaviour.** `aiHover="razorsense"` (the neutral primary button) or `aiHover="ray-<action>"` (a secondary button that widens for Ray), not separate switches: the hovers can never be combined, and a new Ray action is a new value.
- **Keyboard focus plays it as hovering does.** On `:focus-visible` it starts as the pointer coming onto the button does, and blur ends it as leaving does. A click's focus doesn't count (that hover is the pointer's: it ends as the pointer leaves), and hovered and focused at once is the one hover, on one canvas. Blade's focus ring stays visible on top of it.
- **The name stays `aiHover`, though focus plays it too.** It names the effect, the design's "AI hover", not the input that starts it. Keyboard focus is how a keyboard user gets that same effect, as an equivalent of hovering, not a second behaviour. A name such as `aiEffect` would say less about what the button does.
- **Few canvases at once.** A browser keeps only so many WebGL contexts on a page, so a hover's canvas is made only while the pointer is on or near its button, or it's focused from the keyboard (after 60 ms of focus, so holding Tab down a table makes none); at most 3 are held page-wide, the hovered or focused one first. On a device that can't hover (a phone), nothing of it is probed or downloaded until a keyboard focuses a button or link on the page (a tap on a text field is `:focus-visible` too, so it doesn't count), or a mouse or pen moves (a desktop that says it can't hover); the hover itself then waits for its own button's keyboard focus.
- **Disabled when Ray can't act.** When Ray is unavailable or the merchant is offline, disable the button (`isDisabled`); the AI hover doesn't play on a disabled button, nor on a loading one (`isLoading`). A button disabled or set loading mid-hover ends it at once, and Blade's own disabled or loading look shows. Blade doesn't disable a link Button (`href`), but its `isDisabled` still turns its AI hover off: an app that disables an AI action means it to stop inviting a hover, and the link keeps Blade's link rule otherwise.
- **It gives way rather than break.** With reduced motion, without a GPU drawing WebGL2, on a page already too slow, on touch, or where its rules don't hold (a ButtonGroup, a full-width button, and for Ray an icon-only button or one that can't widen), the button keeps its own hover and focus ring.

## Component Breakdown

<img src="./component-breakdown.png" width="300px"/>

## Open Questions

- ~Should we have `variant+contrast` props or `variant+action+contrast` props?~ We will go ahead with `variant+intent+contrast` props for now.
- ~What about small/large screen?~ This would be handled internally
- ~Component-level Actions look mostly like primary except Focus, what do we do?~ This was a Figma issue, it is intended to look exactly like the `primary` variant
- ~Should Plain/Link behave as `<a>` tag?~ We will have a `Link` variant but that would also be a `button`. We would have another `Link` component that will be an `<a>` tag. We do this to maintain the correct roles for button & link components.
- ~Should we expose a `type` prop for `button`, `reset`, `submit`?~ Yes, we should.
- ~Do we need `leadingIcon`/`leftIcon` `trailingIcon`/`rightIcon` props?~ Yes, we do. We'll control this with an `icon` & `iconPosition` prop.
- ~Should we call it onClick or onPress?~ We will call it onClick for more developer familiarity.
- Scope of A11y?
  - [WAI-ARI Button](https://www.w3.org/TR/wai-aria-practices-1.2/#button)
  - [WAI-ARI Link](https://www.w3.org/TR/wai-aria-practices-1.2/#link)
  - To be discussed further depending on [A11y RFC](https://github.com/razorpay/blade/pull/463) which is in progress
