# Tooltip API Decisions <!-- omit in toc -->

The tooltip typically provides additional context about the element or its function. A tooltip is always triggered by a `mouse hover` on desktop and `on tap` on mobile.

<img src="./tooltip-thumbnail.png" width="380" alt="" />

- [Design](#design)
- [`Tooltip` API](#tooltip-api)
  - [Examples:](#examples)
    - [Usage](#usage)
- [Library](#library)
  - [Bundle Size](#bundle-size)
- [Implementation detail nuances:](#implementation-detail-nuances)
- [Motion](#motion)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)
- [References](#references)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=40540-559304&t=tmTrf3xJU6oj59fM-0) to all variants of the Tooltip component

## `Tooltip` API

| Prop               | Type                                                                     | Default     | Description                                                                                                                                              | Required |
| ------------------ | ------------------------------------------------------------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| content            | `string`                                                                 | `undefined` | Content of the tooltip                                                                                                                                   | ✅       |
| placement          | `top, top-start, top-end, left, right, bottom, bottom-start, bottom-end` | `top`       | Placement of tooltip                                                                                                                                     | ✅       |
| shouldWrapChildren | `boolean`                                                                | `false`     | If set to true, the tooltip trigger will be wrapped in a interactive `<div>`, this is useful for making non-interactive elements work as tooltip trigger |          |
| children           | `React.ReactNode`                                                        | `undefined` | Trigger component for tooltip, Accepts any interactive element or icons                                                                                  | ✅       |
| onOpen             | `Callback`                                                               | `undefined` | Called when tooltip is opened                                                                                                                            |          |
| onClose            | `Callback`                                                               | `undefined` | Called when tooltip is closed                                                                                                                            |          |

### Examples:

#### Usage

```js
// basic example
<Tooltip content="Amount reversed to customer bank account" placement="top">
  <IconButton icon={InfoIcon} accessibilityLabel="Refund" />
</Tooltip>
```

### Working with non-interactive triggers

To make tooltip apear on hovering over non-interactive elements such as icons, badges, counters etc. We will provide `shouldWrapChildren` prop which will wrap the trigger component in a interactive div element with all the trigger props

```js
// non-interactive element as trigger
<Tooltip content="Amount reversed to customer bank account" shouldWrapChildren>
  <Counter value={100} />
</Tooltip>
```

> Note: If users don't wrap the non-interactive elements the tooltip won't apear

## Custom Triggers

Users will be able to use their own custom components as triggers:

To make custom elements work the components needs to expose:

- ref
- Web:
  - onBlur
  - onFocus
  - onMouseLeave
  - onMouseMove
  - onPointerDown
  - onPointerEnter
- Native:
  - onTouchStart
  - onTouchEnd

```jsx
import type { TooltipTriggerProps } from "@razorpay/blade/components";
type MyCustomButtonProps = {} & TooltipTriggerProps
const MyCustomButton = React.forwardRef(...);

// non-interactive element as trigger
<Tooltip content="Amount reversed to customer bank account" shouldWrapChildren>
  <MyCustomButton>Click me<MyCustomButton>
</Tooltip>
```

## Library

We will be using [FloatingUI](https://floating-ui.com/) to position the tooltip & handle the basic tooltip logic. Floating UI supports both Web & ReactNative.

### Bundle Size

With all the neccessary middlewares and features included for our usecase FloatingUI will be around **10kb** gzip.

Check the [BundleJS Analysis](https://bundlejs.com/?q=%40floating-ui%2Freact&treeshake=%5B%7B%0A++arrow%2Cflip%2CFloatingArrow%2Coffset%2CuseFloating%2CuseFocus%2CuseHover%2CuseInteractions%2CuseTransitionStyles%2C%7D%5D&config=%7B%22esbuild%22%3A%7B%22external%22%3A%5B%22react%22%2C%22react-dom%22%5D%7D%7D)

This is worth the size becaue:

- FloatingUI supports both react / react-native
- It handles
  - Animations (mount/unmount)
  - Automatic collision aware placements
  - Interactions (hover, focus)
  - Tooltip Arrow
  - Middlewares

<details>
  <summary> 

  ## Implementation detail nuances: 

  </summary>

To make FloatingUI work with Blade components seamlessly there are few things we need to modify:

1. Expose interaction props in all the trigger components

- Web:
  - onBlur
  - onFocus
  - onMouseLeave
  - onMouseMove
  - onPointerDown
  - onPointerEnter
- Native:
  - onTouchStart
  - onTouchEnd

2. Expose the actual DOM node from ref instead of only exposing [certain methods via our useBladeInnerRef](https://github.com/razorpay/blade/blob/69a1bcef2f09ceaf6f910eaaca3076055fb059a2/packages/blade/src/hooks/useBladeInnerRef.web.ts#L26-L27) hook which we used to prevent component styling misuses. We need to expose the actual DOM node because FloatingUI internally does this [isElement() check](https://github.com/floating-ui/floating-ui/blob/b8990250568043b876e1c8fe42358fe337847ede/packages/react/src/hooks/useFloating.ts#L59) on the tooltip trigger element.

</details>

## Motion

TBD

## Accessibility

- Tooltip will have [`role=tooltip`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role)
- `Esc` should close the tooltip
- When using keyboard tooltip will apear when target element is focused
- Tooltip's must not contain interactive elements

Resources:

- https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role
- https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
- https://techservicesillinois.github.io/accessibility/aria-examples/tooltip.html
- https://dequeuniversity.com/library/aria/tooltip

## Open Questions

- Q1: Which components should and should not be qualify as trigger?
- A1: Discussed with designers, we will allow all elements interactive, non-interactive to be used as triggers (eg, badge, counter, icons) because there can be many genuine usecases which we can't predict.

## References

- https://chakra-ui.com/docs/components/tooltip/props
- https://ariakit.org/examples/tooltip
- https://atlassian.design/components/tooltip/examples
