# Tooltip API Decisions <!-- omit in toc -->

The tooltip typically provides additional context about the element or its function. A tooltip is always triggered by a `mouse hover` on desktop and `on tap` on mobile.

<img src="./tooltip-thumbnail.png" width="380" alt="" />

- [Design](#design)
- [`Tooltip` API](#tooltip-api)
  - [Examples:](#examples)
    - [Basic](#basic)
- [Library](#library)
- [Motion](#motion)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=40540-559304&t=tmTrf3xJU6oj59fM-0) to all variants of the Tooltip component

## `Tooltip` API

| Prop          | Type                                                                     | Default     | Description                                                               | Required |
| ------------- | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------- | -------- |
| content       | `string`                                                                 | `undefined` | Content of the tooltip                                                    | ✅       |
| placement     | `top, top-start, top-end, left, right, bottom, bottom-start, bottom-end` | `top`       | Placement of tooltip                                                      | ✅       |
| children      | `React.ReactNode`                                                        | `undefined` | Trigger component for tooltip, Accepts any interactive element            | ✅       |
| isOpen        | `boolean`                                                                | `undefined` | Controls the tooltip state                                                |          |
| defaultIsOpen | `boolean`                                                                | `undefined` | If true, the tooltip will be visible initially                            |          |
| onDismiss     | `Callback`                                                               | `undefined` | Called when tooltip is closed, either by mouseout or users pressing `Esc` |          |

### Examples:

#### Usage

```js
// basic, uncontrolled
<Tooltip content="Amount reversed to customer bank account" placement="top">
  <IconButton icon={InfoIcon} accessibilityLabel="Refund" />
</Tooltip>;

// controlled
const [isOpen, setIsOpen] = React.useState(false);

<Tooltip
  onDismiss={() => setIsOpen(false)}
  isOpen={isOpen}
  content="Amount reversed to customer bank account"
>
  <IconButton icon={InfoIcon} accessibilityLabel="Refund" />
</Tooltip>;

// default open
<Tooltip defaultIsOpen={true} content="Amount reversed to customer bank account">
  <IconButton icon={InfoIcon} accessibilityLabel="Refund" />
</Tooltip>;
```

## Library

We will be using [FloatingUI](https://floating-ui.com/) to position the tooltip & handle the basic tooltip logic. Floating UI supports both Web & ReactNative.

## Motion

Check out the [motion guidelines] for Tooltip.

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

N/A

## References

- https://chakra-ui.com/docs/components/tooltip/props
- https://ariakit.org/examples/tooltip
- https://atlassian.design/components/tooltip/examples
