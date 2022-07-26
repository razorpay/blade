# Checkbox Decisions <!-- omit in toc -->

- [Design](#design)
- [`Radio` API](#radio-api)
  - [Examples:](#examples)
    - [Basic](#basic)
    - [Validations](#validations)
- [`RadioGroup` API](#radiogroup-api)
  - [Examples:](#examples-1)
    - [Basic](#basic-1)
    - [Controlled, Uncontrolled](#controlled-uncontrolled)
- [Accessibility](#accessibility)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13133%3A160709) to all variants of the Checkbox component

## `Radio` API

| Prop                | Type                                    | Default     | Description                                                                                                                                                    | Required |
| ------------------- | --------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| children            | `string`                                | `undefined` | The text to be rendered as RadioLabel                                                                                                                          | ✅       |
| children            | `string`                                | `undefined` | The text to be rendered as RadioLabel                                                                                                                          | ✅       |
| isChecked           | `boolean`                               | `false`     | state of the radio, if explicitly set the radio will become [controlled component](https://reactjs.org/docs/forms.html#controlled-components)                  |          |
| defaultChecked      | `boolean`                               | `false`     | default state of the radio, if isChecked is not provided the radio will become [uncontrolled component](https://reactjs.org/docs/uncontrolled-components.html) |          |
| onChange            | `({ event, isChecked, value }) => void` | `undefined` | The function to be called when the radio state changes.                                                                                                        |          |
| isDisabled          | `boolean`                               | `false`     | Control whether the radio is disabled or not.                                                                                                                  |          |
| isRequired          | `boolean`                               | `false`     | Control whether the radio is required or not.                                                                                                                  |          |
| helpText            | `string`                                | `undefined` | The helper text to be rendered                                                                                                                                 |          |
| validationState     | `none' \| 'error'`                      | `none`      | Control whether the radio is invalid or not.                                                                                                                   |          |
| name (html native)  | `string`                                | `undefined` | The name of the input field in a radio, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)                     |          |
| value (html native) | `string`                                | `undefined` | The value of the input field in a radio, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio#value)             |          |

### Examples:

#### Basic

```tsx
// Label text
<Radio>is blade awesome?</Radio>
// Helper text
<Radio helpText="Hint: yes">is blade awesome?</Radio>
// uncontrolled
<Radio defaultChecked={true}>is blade awesome?</Radio>
// controlled
<Radio isChecked={true | false}>is blade awesome?</Radio>
```

#### Validations

And `validationState` will pass `aria-invalid` attributes to indicate invalid state.

```tsx
<Radio validationState={'error' | 'none'}>is blade awesome?</Radio>
```

## `RadioGroup` API

| Prop               | Type                                    | Default     | Description                                                                                                                      | Required |
| ------------------ | --------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| children           | `React.ReactNode`                       | `undefined` | Accepts multiple radios                                                                                                          | ✅       |
| label              | `string`                                | `undefined` | The label of the group                                                                                                           | ✅       |
| labelPosition      | `top \| left`                           | `top`       | The position of the rendered label                                                                                               |          |
| defaultValue       | `string`                                | `undefined` | The initial value of the radio group                                                                                             |          |
| value              | `string`                                | `undefined` | The value of the radio, if present will act as [controlled component](https://reactjs.org/docs/forms.html#controlled-components) |          |
| onChange           | `(value: string) => void`               | `undefined` | The function to be called when any radio's state changes                                                                         |          |
| name               | `string`                                | `undefined` | The name of the radio group, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)  |          |
| isDisabled         | `boolean`                               | `false`     | Control whether the radio group is disabled or not.                                                                              |          |
| helpText           | `string`                                | `undefined` | The helper text to be rendered                                                                                                   |          |
| errorText          | `string`                                | `undefined` | The error text to be rendered                                                                                                    |          |
| validationState    | `'none' \| 'error'`                     | `none`      | Control whether the radio group is invalid or not.                                                                               |          |
| necessityIndicator | `'optional' \| 'required' \| undefined` | `undefined` | Renders `${label} (optional)` for `optional` and `${label} *` for `required`. if set to undefined renders nothing                |          |

### Examples:

#### Basic

```tsx
<RadioGroup
  name="developers"
  label="Developers"
  helpText="Pick preferred blade developer"
  defaultValue="anurag"
>
  <Radio value="anurag">Anurag</Radio>
  <Radio value="kamlesh">Kamlesh</Radio>
  <Radio value="chaitanya">Chaitanya</Radio>
</RadioGroup>
```

#### Controlled, Uncontrolled

```tsx
const Controlled = () => {
  const [selected, setSelected] = React.useState('kamlesh');

  return (
    <RadioGroup
      name="developers"
      label="Developers (controlled)"
      value={selected}
      onChange={setSelected}
    >
      <Radio value="anurag">Anurag</Radio>
      <Radio value="kamlesh">Kamlesh</Radio>
      <Radio value="chaitanya">Chaitanya</Radio>
    </RadioGroup>
  );
};

const Uncontrolled = () => {
  return (
    <RadioGroup name="developers" label="Developers (uncontrolled)" defaultValue="chaitanya">
      <Radio value="anurag">Anurag</Radio>
      <Radio value="kamlesh">Kamlesh</Radio>
      <Radio value="chaitanya">Chaitanya</Radio>
    </RadioGroup>
  );
};
```

**Example of user managed validation**

Example of form validation with libraries.

```tsx
function ValidationWithFormLibraries() {
  const { errors } = useFormLibrary();
  const [selected, setSelected] = React.useState(undefined);

  return (
    <CheckboxGroup
      name="fruits"
      label="Do you love any of the fruits?"
      helpText="Select atleast one"
      errorText="You must select atleast one"
      validationState={!!errors.fruits}
    >
      <Checkbox value="apple">apple</Checkbox>
      <Checkbox value="mango">mango</Checkbox>
      <Checkbox value="orange">orange</Checkbox>
      <Checkbox value="banana">banana</Checkbox>
    </CheckboxGroup>
  );
}
```

## Accessibility

- Radio - https://www.w3.org/WAI/ARIA/apg/patterns/radio/