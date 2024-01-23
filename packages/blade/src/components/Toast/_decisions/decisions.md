# Toast 🏷️

Toasts are used to provide feedback to the user after an important action has been performed. 
Toasts can also be used to provide feedback to the user when a system event occurs, such as when a file is saved.

<img width="426" alt="image" src="" />

## Design

- [Toast - Figma Design](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=7665-27414&mode=design&t=UNInCMmP1iFCu9je-0)

## Features

- Stackable
- Auto dismissable / manual dismissable
- Positioning
- `Informational` or `Promotional` toasts

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
          type: 'presentational',
          color: 'success',
          content: 'Payment Successful',
          leading: <DollarIcon />,
          autoDismiss: true,
          onDismiss: () => {
            console.log('Toast dismissed');
          },
          onAction: () => {
            console.log('Toast action clicked');
          },
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

## Accessibility

## References

## Open Questions
