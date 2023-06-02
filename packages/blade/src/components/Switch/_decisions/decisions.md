# Switch API Decisions <!-- omit in toc -->

A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turn the switch on/off.

<img src="./switch-thumbnail.png" width="380" alt="" />

- [Design](#design)
- [`Switch` API](#switch-api)
  - [Examples:](#examples)
    - [Basic](#basic)
    - [Controlled, Uncontrolled](#controlled-uncontrolled)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=31366-831710&t=qzTLJeIDluL4Ps23-0) to all variants of the Switch component

## `Switch` API

| Prop               | Type                                    | Default     | Description                                                                                                                                                      | Required |
| ------------------ | --------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| isChecked          | `boolean`                               | `false`     | State of the switch, if explicitly set the switch will become [controlled component](https://reactjs.org/docs/forms.html#controlled-components)                  |          |
| defaultChecked     | `boolean`                               | `false`     | Default state of the switch, if isChecked is not provided the switch will become [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html) |          |
| onChange           | `({ event, isChecked, value }) => void` | `undefined` | The function to be called when the switch state changes.                                                                                                         |          |
| isDisabled         | `boolean`                               | `false`     | Control whether the switch is disabled or not.                                                                                                                   |          |
| accessibilityLabel | `string`                                | `undefined` | Provides accessible label for internal checkbox component that sets the aria-label prop for screen readers.                                                      | ✅       |
| size               | `small, medium`                         | `medium`    | Size of the switch component                                                                                                                                     |          |
| name (html)        | `string`                                | `undefined` | The name of the input field in a switch, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)                      |          |
| value (html)       | `string`                                | `undefined` | The value of the input field in a switch, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value)           |          |

### Examples:

#### Basic

```js
// basic
<Switch value="dark-mode" />
```

#### Controlled, Uncontrolled

```js
const Controlled = () => {
  const [chceked, setChecked] = React.useState(false);

  return (
    <Switch
      isChecked={checked}
      onChange={({ isChecked }) => setChecked(isChecked)}
      value="dark-mode"
    />
  );
};

const Uncontrolled = () => {
  return (
    <Switch
      defaultChecked={true}
      onChange={({ isChecked }) => console.log(isChecked)}
      value="dark-mode"
    />
  );
};
```

#### Custom Label

Switch by default doesn't render any `<label>` element internally, if users want they can provide it:

```js
<Box as="label" display="flex">
  Dark mode
  <Switch id="dark-mode" />
</Box>
```

## Motion

Check out the [motion guidelines](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=32964-635518&t=o6i2iy1dc6Xqv3aP-0) for Switch.

### Hover State Animations:

Off Hover:

<img alt="Off Hover Animation" src="./motion/off-hover-state.gif" width="30%"/>

On Hover:

<img alt="On Hover Animation" src="./motion/on-hover-state.gif" width="30%" />

### Switch On Off Animations:

On to Off:

<img alt="On to Off Animation" src="./motion/on-to-off.gif" width="30%" />

Off to On:

<img alt="Off to On Animation" src="./motion/off-to-on.gif" width="30%" />

## Accessibility

Switch will work similarly as Checkbox, where the hidden input field will follow the [Checkbox accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) pattern but will have `role=switch`.

WAI-ARIA Example: [Switch Example Using HTML Checkbox Input](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/)

## Open Questions

N/A
