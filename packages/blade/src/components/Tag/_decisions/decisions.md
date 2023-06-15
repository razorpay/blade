# Tag 🏷️

These are set of interactive keywords that help organise & categorise objects. Tags can be added or removed from an object by the users.

<img width="426" alt="image" src="https://github.com/razorpay/blade/assets/30949385/75d8068d-d6fc-47e7-aa75-21686ed1c27d">

## Proposed API

```jsx
<Tag
  size="medium"
  onDismiss={() => {
    console.log('Close Icon Clicked');
  }}
>
  Unpaid
</Tag>
```

### Props

```ts
type TagProps = {
  /**
   * Decides the size of Tag
   *
   * @default medium
   */
  size?: 'medium' | 'large';

  /**
   * Callback when close icon on Tag is clicked
   */
  onDismiss?: () => void;

  /**
   * Text that renders inside Tag
   */
  children: ReactText;
};
```
