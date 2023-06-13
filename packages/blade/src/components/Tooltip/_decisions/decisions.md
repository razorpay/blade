# Tooltip API Decisions <!-- omit in toc -->

The tooltip typically provides additional context about the element or its function. A tooltip is always triggered by a `mouse hover` on desktop and `on tap` on mobile.

<img src="./assets/tooltip-thumbnail.png" width="380" alt="Tooltip Thumbnail" />

- [Design](#design)
- [`Tooltip` API](#tooltip-api)
  - [Examples:](#examples)
    - [Usage](#usage)
  - [Working with non-interactive triggers](#working-with-non-interactive-triggers)
  - [Custom Triggers](#custom-triggers)
- [Library](#library)
  - [Bundle Size](#bundle-size)
- [Motion](#motion)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)
- [References](#references)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=40540-559304&t=tmTrf3xJU6oj59fM-0) to all variants of the Tooltip component

## `Tooltip` API

| Prop         | Type                                                                     | Default     | Description                                                                                                                             | Required |
| ------------ | ------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| content      | `string`                                                                 | `undefined` | Content of the tooltip                                                                                                                  | ✅       |
| children     | `React.ReactNode`                                                        | `undefined` | Trigger component for tooltip, Accepts any interactive element or icons                                                                 | ✅       |
| placement    | `top, top-start, top-end, left, right, bottom, bottom-start, bottom-end` | `top`       | Placement of tooltip, the tooltip avoid collision with the edge of the screen and flip to the oppisite side even when placement is set. |          |
| onOpenChange | `({ isOpen }) => void`                                                   | `undefined` | Called when tooltip isOpen state is changed, this can be used to detect when tooltip opens or closed                                    |          |

### Examples:

#### Usage

```js
// basic example
<Tooltip content="Amount reversed to customer bank account" placement="top">
  <IconButton icon={InfoIcon} accessibilityLabel="Refund" />
</Tooltip>
```

### Working with non-interactive triggers

To make tooltip apear on hovering over non-interactive elements such as icons, badges, counters etc. We will provide a `TooltipInteractiveWrapper` component which will work as a minimal trigger:

```js
import { Tooltip, TooltipInteractiveWrapper } from '@razorpay/blade';

// non-interactive element as trigger
<Tooltip content="Amount reversed to customer bank account">
  <TooltipInteractiveWrapper>
    <Counter value={100} />
  </TooltipInteractiveWrapper>
</Tooltip>;
```

> Note: If users don't wrap the non-interactive elements the tooltip won't apear

### Custom Triggers

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

type MyCustomButtonProps = { 
  children: React.ReactNode 
} & TooltipTriggerProps

const MyCustomButton = React.forwardRef<
  HTMLDivElement,
  MyCustomButtonProps
>(({ children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      tabIndex={0}
      // you can either spread the props
      // or pick the onFocus, onMouse.. etc events and add them individually
      {...props}
    >
       {children}
    </button>
  );
});

// custom trigger
<Tooltip content="Amount reversed to customer bank account">
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
  <summary>Implementation detail nuances:</summary>

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

https://github.com/razorpay/blade/assets/35374649/6ad26074-dad7-4076-95e3-c0ae073afcc8

You can check the [Tooltip motion here](https://www.figma.com/proto/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=629-881474&scaling=min-zoom&page-id=175%3A811766).

And give relavant feedback for [motion in this thread](https://razorpay.slack.com/archives/C0274H7QRC1/p1686043668193769).

## Accessibility

- Tooltip will have [`role=tooltip`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role)
- `Esc` should close the tooltip
- When using keyboard tooltip will apear when target element is focused
- Tooltip's must not contain interactive elements
- Tooltip trigger will also have aria-labelledby property which will be set to the TooltipContent's id

Resources:

- https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tooltip_role
- https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html
- https://techservicesillinois.github.io/accessibility/aria-examples/tooltip.html
- https://dequeuniversity.com/library/aria/tooltip

## Open Questions

<details>
  <summary>Q1: Which components should and should not be qualify as trigger?</summary>

Discussed with designers, we will allow all elements interactive, non-interactive to be used as triggers (eg, badge, counter, icons) because there can be many genuine usecases which we can't predict.

</details>

<details>
  <summary>Q2: Mobile UX</summary>

Should tooltips on mobile have open delay? eg: long press to open?

There are certain cases where long press makes sense and certain places where immediate.

**Long press example:**

Google interactive icons, a search icon button might be clickable which shows a search input on clicked, but on long pressing it shows a tooltip.

https://github.com/razorpay/blade/assets/35374649/51b8db65-7c46-4d7b-b388-61ab4fae8727

**Immediately press (Razorpay icon tooltip):**

Immediately shows tooltip on clicking on the icon for more info.

https://github.com/razorpay/blade/assets/35374649/612a96b9-34e1-492b-8e81-e04b896d79db

Immediate tooltips makes sense when the tooltip trigger doesn't do any extra action on clicking, for example imagine in that search icon button if an immediate tooltip is used the tooltip will never have a chance to show up since the screen changes and it opens a new dialog/page.

**Auto dismissal:**

Another UX we need to think about is,

In the long press example, once you release the press the tooltip automatically dismisses after 1s.

But with the immediate example, the tooltip never dismisses automatically. Users are required to click outside to dismiss.

**Answer:**

We will go ahead with Immediate press, because long pressing to open will have discoverability issues. And we will have guidelines in design side about when/where to use Tooltip and the tooltip UX on mobile so that designers use tooltips sparingly/accordingly based on usecases.

</details>

<details>
  <summary>Q3: Why do we need <b>TooltipInteractiveWrapper</b>? Can't we automatically wrap the children internally?</summary>


We did a POC on this, it's quite tricky to get right. 

### Problem 1: Refs

To detect if an element is interactive or not we need to expose refs on all the components, and it includes interactive, non-interactive both elements. 

Now imagine this: 

```jsx
<Tooltip>
  <InfoIcon size="2xlarge" color="action.icon.link.visited" />
</Tooltip>
```

To check if InfoIcon is an interactive element it needs to expose the DOM ref, and that means in all of our 260 icon components we will need to expose the ref.
And same goes for custom trigger components if users don't expose ref we won't know the DOM element it's using. 
 
### Problem 2: Double render 

Let's say we solve the ref problem, now internally we need to check if the element is an interactive element, then swap the rendered element with the TooltipInteractiveWrapper. This method is quite hacky and fragile could lead to hydration mismatches (tho haven't tests) & flicker. 

```jsx
const Tooltip = () => {
  const [isTriggerInteractive, setIsTriggerInteractive] = useState(true);
  
  React.useEffect(() => {
    if (!triggerRef.current) return;
    
    // once we have the trigger ref, after the first render, we can detect the DOM element
    // and swap the flag to render the trigger wrapper as needed
    if (triggerRef.current.tagName === 'button | a ... etc') {
      setIsTriggerInteractive(true)
    } else {
      setIsTriggerInteractive(false)
      }
  }, [])

  return (
    <>
      {isTriggerInteractive 
       // on first render isTriggerInteractive is true so that we get the children's ref by rendering the element atleast once.
        ?  React.cloneElement(children, { ref, onClick })
        : <TooltipInteractiveWrapper>{children}</TooltipInteractiveWrapper>
       }
    </>
  )
}
```


### Problem 3: Trigger wrapper styles

Previously we had an API to just pass a prop to internally wrap the trigger with TooltipInteractiveWrapper

```jsx
<Tooltip shouldWrapChildren>
    <InfoIcon size="2xlarge" color="action.icon.link.visited" />
</Tooltip>
```

But this caused an issue where now there will be an additional `div` wrapper in the rendered HTML which could interfere with layouting the elements since users won't have control over the styles for that internal `div`, thus we switched to TooltipInteractiveWrapper so users can pass Box props and styles as needed. 

```jsx
<Tooltip>
  <TooltipInteractiveWrapper width="" margin="" padding="" whatever="">
    <InfoIcon size="2xlarge" color="action.icon.link.visited" />
  </TooltipInteractiveWrapper>
</Tooltip>
```

This is much more predictable and users will have the control over the internal wrapper. 
If we go ahead with automatically wrapping the tooltip trigger users won't be able to pass props to it, unless we explicitly have another prop say `triggerProps={{ ... }}`. 

### Conclusion: 

Thats why we decided to go ahead with manual wrapping: 

- It's much more predictable 
- Less hacky
- And customizable

</details>


## References

- https://chakra-ui.com/docs/components/tooltip/props
- https://ariakit.org/examples/tooltip
- https://atlassian.design/components/tooltip/examples
