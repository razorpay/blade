# Toast 🏷️

Toasts are used to provide feedback to the user after an important action has been performed. 
Toasts can also be used to provide feedback to the user when a system event occurs, such as when a file is saved.

<img width="426" alt="image" src="./toast-thumbnail.png" />

## Design

- [Toast - Figma Design](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=7665-27414&mode=design&t=UNInCMmP1iFCu9je-0)

## Features

- Stackable
- Auto dismissable / manual dismissable
- `informational` or `promotional` types

## Anatomy

### Informational Toast

<img src="./toast-anatomy.png" width="100%" alt="Toast anatomy" />

### Promotional Toast

<img src="./example-promotional-toast.png" width="380" alt="Promotional toast example" />

## Simple Usage

The blade toasts will use [react-hot-toast](https://react-hot-toast.com/) under the hood with a similar imperative API to show, dismiss and create new toasts without needing for consumer to handle positional or stacking logic. 

```jsx
import { BladeProvider, ToastContainer, useToast } from "@razorpay/blade/components"

const HomePage = () => {
  const toast = useToast();

  return (
    <Button
      onClick={() => {
        toast.show({
          type: 'informational',
          color: 'success',
          content: 'Payment Successful',
          leading: <DollarIcon />,
          autoDismiss: true,
          onDismissButtonClick: () => {
            console.log('Toast dismissed');
          },
          action: {
            text: 'View',
            onClick: () => {
              console.log('Toast action clicked');
            }
          }
        });
      }}
    >
      Show Toast
    </Button>
  );
};

const App = () => {
  return (
    <BladeProvider>
      <ToastContainer position="bottom-left" />
      <HomePage />
    </BladeProvider>
  )
}
```

## Props

```ts
type ToastProps = {
  /**
   * @default `informational`
   */
  type?: 'informational' | 'promotional';

  /**
   * @default `neutral`
   */
  color?: 'neutral' | 'positive' | 'negative' | 'notice' | 'information'

  /**
   * Content of the toast
   */
  content: React.ReactNode;

  /**
   * Can be used to render an icon or asset
   */
  leading?: React.ReactElement;

  /**
   * If true, the toast will be dismissed after few seconds
   * 
   * @default true - for informational toast
   * @default false - for promotional toast
   */
  autoDismiss?: boolean;

  /**
   * Duration after which the toast will be dismissed (in ms)
   * 
   * Duration for promotional toast is 8s
   * Duration for informational toast is 4s
   */
  duration?: 8000 | 4000;

  /**
   * Called when the toast is dismissed or duration runs out
   */
  onDismissButtonClick?: () => void;

  /**
   * Primary action of toast
   */
  action?: {
    text: string;
    onClick?: (e: Event) => void;
    isLoading? boolean;
  }

  /**
   * Forwarded to react-hot-toast
   * 
   * This can be used to programatically update toasts by providing an id
   */
  toastId?: string; 
}
```

### useToast

The useToast hook will return few modified methods from [react-hot-toast](https://react-hot-toast.com/docs/toast): 

```ts
type useToastReturnType = {
  /**
   * @returns id of the toast
   */
  show: (toast: Toast) => string;

  /**
   * id of the toast to be dismissed
   * 
   * if id is not provided, all the toasts will be dismissed
   */
  dismiss: (toastId?: string) => void;
}
```

## Examples

#### Removing a toast

react-hot-toast provides this functionality, for more info see [react-hot-toast docs](https://react-hot-toast.com/docs/toast#dismiss-toast-programmatically)

```jsx
import { BladeProvider, ToastContainer, useToast } from "@razorpay/blade/components"

const Example = () => {
  const toastId = React.useRef(null);
  const toast = useToast();

  return (
    <Box>
      <Button
        onClick={() => {
          toastId.current = toast.show({
            color: 'success',
            content: 'Payment Successful',
          });
        }}
      >
        Show Toast
      </Button>
      <Button onClick={() => toast.dismiss(toastId.current)}>Dismiss Toast</Button>
    </Box>
  );
};
```

### Promotional Toast

```jsx
import { BladeProvider, ToastContainer, useToast } from "@razorpay/blade/components"

const Example = () => {
  const toast = useToast();

  return (
    <Button
      onClick={() => {
        toast.show({
          type: 'promotional',
          content: (
            <Box>
              <Heading>Payment Successful</Heading>
              <Text>Amount: ₹100</Text>
            </Box>
          ),
          leading: <DollarIcon />,
          action: {
            text: 'Okay'
          }
        });
      }}
    >
      Do payment
    </Button>
  );
};
```

<img src="./example-promotional-toast.png" width="380" alt="Promotional toast example" />


## Motion

You can checkout the toast motion [here](https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75848-1063056&t=QZkki0ZrlcG4sKzw-0&scaling=min-zoom&page-id=7665%3A27414).

## Accessibility

- Toast components will follow the WAI-ARIA guidelines for [alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/examples/alert/). For error toast we will use the `alert` role and for informational toast we will use the `status` role.


## References

- https://react-hot-toast.com/docs
- https://chakra-ui.com/docs/components/toast/usage

## Open Questions

- Q. What should be the default duration for auto dismissable toasts?
  - A. 4s for informational toasts and 8s for promotional toasts

- Q. Should we call it `onDismissButtonClick` or `onDismiss`? 
  
- Q. Should the dismiss handler be called even when the toast is auto dismissed? Or should we have different handlers for auto dismiss and manual dismiss? (eg: `onAutoDismiss` `onDismissButtonClick`)
  - A. We will call it `onDismissButtonClick` and it will only be called when the user clicks on the dismiss button.

- Q. In the `useToast` hook should we call the returned functions `showToast`/`dismissToast` or `show`/`dismiss`?

  If we call them `show` & `dismiss` consumer can do this and might look more cleaner:

  ```jsx
  const App = () => {
    const toast = useToast();

    toast.show(); // <-- they will also get auto complete when writing `toast.`
    toast.dismiss();
  }
  ```
  - A. We will call them `show` & `dismiss`

- Q. In design we are restricting the Toast position to be bottom-left. In that case should we also do the same or should we allow all the positions & set the default to bottom-left? (If we allow all the positions, we will have to add some additional logic to handle stacking/animation of toasts coming from top instead of bottom)
  - A. We will only allow bottom-left position for now.

- Q. Should we keep the ToastContainer inside BladeProvider? 

  The problem is if we keep it inside BladeProvider, given our new light/dark mode setup where consumers will need to nest BladeProviders it would cause ToastContainer to render [multiple times](https://github.com/razorpay/blade/pull/1990#discussion_r1470796627).
  - A. We will expose ToastContainer, so that users can render it at the root level of their app regardless of where BladeProvider is.

---

## Promotional Toast: Timer, Progress Bar and Link Action

Promotional toasts get these additions on web. A promotional toast can play its own intro motion before its timer starts. It can show a thin progress bar for the time left. Its action can render as a `Button` or a `Link`. A promotional toast that auto dismisses pauses while the pointer is over it or focus is inside it.

### API

```jsx
import { ArrowRightIcon, Box, Heading, Text, useToast } from '@razorpay/blade/components';

const toast = useToast();

toast.show({
  type: 'promotional',
  content: (
    <Box display="flex" gap="spacing.2" flexDirection="column">
      <Heading size="small">Reports are now faster</Heading>
      <Text size="small">Download any report in a few seconds.</Text>
    </Box>
  ),
  autoDismiss: true,
  duration: 8000,
  introDuration: 2000,
  showProgressBar: true,
  action: {
    text: 'See what is new',
    variant: 'link',
    href: 'https://example.com/whats-new',
    target: '_blank',
    icon: ArrowRightIcon,
    iconPosition: 'right',
  },
});
```

- `introDuration` delays the auto dismiss timer and the progress bar. The consumer plays the intro motion inside `content`. Blade does not animate the content.
- With `introDuration`, Blade holds the action until the intro ends, then fades it in. The action keeps its space during the intro, so the toast height does not change. The dismiss button shows from the start.
- `showProgressBar` shows a 2px bar on the bottom edge of the toast. The bar shrinks from full width to zero over `duration` with linear easing.
- The timer and the bar pause when the pointer is over the toast or focus is inside it. They resume from where they stopped.
- `action.variant: 'link'` renders a `Link`. It renders an anchor when `href` is given, else a button element.

<details>
  <summary>Alternate APIs</summary>

#### Alternate API 1: `actions` with `primary` and `secondary`, like Alert

```jsx
toast.show({
  type: 'promotional',
  content: <Text>Reports are now faster</Text>,
  actions: {
    primary: { text: 'Try now', onClick: () => {} },
    secondary: { text: 'Learn more', href: 'https://example.com' },
  },
});
```

- Pros
  - Same shape as `Alert` and `Card` footer actions.
  - Allows a button and a link at the same time.
- Cons
  - Breaking change. `action` exists today and consumers use it.
  - The toast design has one call to action. Two actions add a layout that the design does not have.

#### Alternate API 2: `delay` as a motion token instead of `introDuration`

```jsx
toast.show({
  type: 'promotional',
  content: <IntroContent />,
  autoDismiss: true,
  delay: 'long',
});
```

- Pros
  - Uses the `motion.delay` token scale.
- Cons
  - The intro length belongs to the consumer's own motion. It is rarely a token value.
  - `delay` reads as a delay before the toast shows, not before the timer starts.
  - `duration` is a number in ms today. `introDuration` keeps the same unit and the same naming pattern. Consumers can still pass a token value, for example `theme.motion.delay.long`.

#### Alternate API 3: render the `ProgressBar` component instead of an internal bar

```jsx
<ProgressBar value={timeLeftPercent} size="small" showPercentage={false} />
```

- Pros
  - Reuses an existing component.
- Cons
  - `ProgressBar` takes a value from JS. A countdown needs a state update on every frame.
  - `ProgressBar` animates value changes with stepped easing, not linear.
  - `ProgressBar` has `role="progressbar"`. A screen reader then reads a countdown that has no meaning for the user.
  - A CSS keyframe with `animation-play-state` pauses and resumes the bar with no extra state.

</details>

### Props

#### ToastProps (additions)

```typescript
type ToastProps = {
  // ...existing props

  /**
   * Time in ms of the intro motion that `content` plays.
   * Blade holds the action until the intro ends, then fades it in.
   * With `autoDismiss`, the timer and the progress bar also start after the intro.
   *
   * Works only on promotional toasts.
   *
   * @platform web
   * @default 0
   */
  introDuration?: number;

  /**
   * Shows a progress bar for the time left before the toast dismisses.
   *
   * Works only on promotional toasts with `autoDismiss`.
   *
   * @platform web
   * @default false
   */
  showProgressBar?: boolean;

  /**
   * Primary action of toast
   */
  action?: ToastButtonAction | ToastLinkAction;
};
```

#### ToastAction

```typescript
type ToastActionCommon = {
  text: string;
  onClick?: ({
    event,
    toastId,
  }: {
    event: React.MouseEvent<HTMLButtonElement>;
    toastId: string;
  }) => void;
  /**
   * @platform web
   */
  icon?: IconComponent;
  /**
   * @platform web
   * @default 'left'
   */
  iconPosition?: 'left' | 'right';
};

type ToastButtonAction = ToastActionCommon & {
  /**
   * Renders the action as a `Button` or a `Link`
   *
   * @platform web
   * @default 'button'
   */
  variant?: 'button';
  isLoading?: boolean;
};

type ToastLinkAction = ToastActionCommon & {
  variant: 'link';
  /**
   * Renders an anchor when given, else a button element
   */
  href?: string;
  target?: string;
  /**
   * When `target` is `_blank`, `Link` sets this to `noreferrer noopener`
   */
  rel?: string;
};
```

### Examples

#### Promotional toast with a progress bar

The bar shows the time left. It pauses on hover and focus.

```jsx
toast.show({
  type: 'promotional',
  content: <Text size="small">Your settlement report is ready</Text>,
  autoDismiss: true,
  showProgressBar: true,
  action: { text: 'Download', onClick: ({ toastId }) => toast.dismiss(toastId) },
});
```

#### Promotional toast with a link action

The `Link` uses the `small` size. This matches the toast's `small` body text and the label size of the `xsmall` button.

```jsx
toast.show({
  type: 'promotional',
  content: <Text size="small">See the new reports page</Text>,
  action: {
    text: 'Learn more',
    variant: 'link',
    href: 'https://example.com',
    target: '_blank',
    icon: ArrowRightIcon,
    iconPosition: 'right',
  },
});
```

#### Promotional toast with an intro

The content shows an intro frame first, then the main frame. `introDuration` matches the intro, so the timer starts with the main frame. Both frames sit in one grid cell, so the toast height does not change.

```jsx
const IntroContent = ({ introDuration }) => {
  const [isIntroDone, setIsIntroDone] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setIsIntroDone(true), introDuration);
    return () => clearTimeout(timeout);
  }, [introDuration]);

  return (
    <Box display="grid">
      <Box gridArea="1 / 1" visibility={isIntroDone ? 'hidden' : 'visible'}>
        <IntroFrame />
      </Box>
      <Box gridArea="1 / 1" visibility={isIntroDone ? 'visible' : 'hidden'}>
        <MainFrame />
      </Box>
    </Box>
  );
};

toast.show({
  type: 'promotional',
  content: <IntroContent introDuration={2000} />,
  autoDismiss: true,
  introDuration: 2000,
  showProgressBar: true,
});
```

### Accessibility

- The progress bar has `aria-hidden`. It is decoration. The toast's `role="status"` stays the same.
- Focus inside the toast pauses the timer. A keyboard user can reach the action and the dismiss button before the toast dismisses.
- Pointer over the toast pauses the timer. The user gets more time to read the content.
- The link action renders `Link`. With `href` it is an anchor with link semantics. Without `href` it is a button element.
- `introDuration` adds no motion. The consumer owns the intro motion and its reduced motion behaviour.

### Open Questions

- Q. Which token fills the progress bar?
  - A. `interactive.background.neutral.default`. It is black in the light theme and white in the dark theme. `SliderInput` uses the same token for its filled track. Design to confirm.
- Q. Should the bar stop its animation when the user prefers reduced motion?
  - A. Open. The bar is a slow, linear change in width. The timer still runs. Design and accessibility to confirm.
- Q. Should React Native support these props?
  - A. Not now. The props are web only. Native ignores them.
- Q. Should informational toasts get the progress bar later?
  - A. Open. Informational toasts use react-hot-toast's timer. Their pause is global for the stack. A bar would need the Blade timer for informational toasts too.
- Q. Can multi-frame `content` change its height between frames?
  - A. Not now. `ToastContainer` measures the toast height once, at show. Keep every frame the same height, for example with one grid cell for all frames.
