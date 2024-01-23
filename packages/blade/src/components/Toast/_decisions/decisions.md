# Toast 🏷️

Toasts are used to provide feedback to the user after an important action has been performed. 
Toasts can also be used to provide feedback to the user when a system event occurs, such as when a file is saved.

<img width="426" alt="image" src="./toast-thumbnail.png" />

## Design

- [Toast - Figma Design](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=7665-27414&mode=design&t=UNInCMmP1iFCu9je-0)

## Features

- Stackable
- Auto dismissable / manual dismissable
- Positioning
- `informational` or `promotional` types

## Anatomy

<img src="./toast-anatomy.png" width="100%" alt="Toast anatomy" />

## Simple Usage

```jsx
import { BladeProvider, ToastContainer, useToast } from "@razorpay/blade/components"

const HomePage = () => {
  const { showToast } = useToast();

  return (
    <Button
      onClick={() => {
        showToast({
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

### ToastContainer

```ts
type ToastContainer = {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
```

```ts
type Toast = {
  /**
   * @default `informational`
   */
  type: 'informational' | 'promotional';
  /**
   * @default `neutral`
   */
  color: 'neutral' | 'positive' | 'negative' | 'warning' | 'information'
  /**
   * If the type is `promotional`, the content will be `React.ReactNode`
   */
  content: string | React.ReactNode;
  /**
   * Can be used to render an icon
   */
  leading?: IconComponent;
  /**
   * If true, the toast will be dismissed after few seconds
   * 
   * Duration for promotional toast is 6s
   * Duration for informational toast is 4s
   * 
   * @default false
   */
  autoDismiss?: boolean;
  /**
   * Called when the toast is dismissed or duration runs out
   */
  onDismissButtonClick?: () => void;
  /**
   * Primary action of toast
   */
  action?: {
    text: string;
    onClick?: () => void;
    isLoading? boolean;
  }
  /**
   * Forwarded to react-hot-toast
   * 
   * This can be used to programatically update toasts by providing an id
   */
  id?: string; 
}
```

### useToast

The useToast hook will return few modified methods from [react-hot-toast](https://react-hot-toast.com/docs/toast): 

```ts
type useToastReturnType = {
  /**
   * @returns id of the toast
   */
  showToast: (toast: Toast) => string;
  /**
   * id of the toast to be dismissed
   * 
   * if id is not provided, all the toasts will be dismissed
   */
  dismissToast: (id?: string) => void;
}
```

## Examples

#### Removing a toast

react-hot-toast provides this functionality, for more info see [react-hot-toast docs](https://react-hot-toast.com/docs/toast#dismiss-toast-programmatically)

```jsx
import { BladeProvider, ToastContainer, useToast } from "@razorpay/blade/components"

const Example = () => {
  const toastId = React.useRef(null);
  const { showToast, dismissToast } = useToast();

  return (
    <Box>
      <Button
        onClick={() => {
          toastId.current = showToast({
            color: 'success',
            content: 'Payment Successful',
          });
        }}
      >
        Show Toast
      </Button>
      <Button onClick={() => dismissToast(toastId.current)}>Dismiss Toast</Button>
    </Box>
  );
};
```

### Promotional Toast

```jsx
import { BladeProvider, ToastContainer, useToast } from "@razorpay/blade/components"

const Example = () => {
  const { showToast } = useToast();

  return (
    <Button
      onClick={() => {
        showToast({
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


## Accessibility

- Toast components will follow the WAI-ARIA guidelines for [alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/examples/alert/). For error toast we will use the `alert` role and for informational toast we will use the `status` role.


## References

- https://react-hot-toast.com/docs
- https://chakra-ui.com/docs/components/toast/usage

## Open Questions

- What should be the default duration for auto dismissable toasts?
