# Checkbox Decisions <!-- omit in toc -->

- [Design](#design)
- [Anatomy](#anatomy)
- [`Checkbox` API](#checkbox-api)
  - [Examples:](#examples)
    - [Basic](#basic)
    - [Validations](#validations)
- [`CheckboxGroup` API](#checkboxgroup-api)
  - [Examples:](#examples-1)
    - [Basic](#basic-1)
    - [Controlled, Uncontrolled](#controlled-uncontrolled)
  - [Note on CheckboxGroup](#note-on-checkboxgroup)
- [Component Architecture](#component-architecture)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026) to all variants of the Checkbox component

## Anatomy

- **Checkbox**
  - **CheckboxInput** - Hidden native <input \/> element
  - **CheckboxIcon** - Checked/Unchecked & indeterminate icon
  - **CheckboxLabel** - The Checkbox's <label \/> element
  - **CheckboxLabelText** - The cross-platform Text component
  - **CheckboxHelpText** - The helper text component
- **CheckboxGroup**
  - **CheckboxGroupFieldset** - Would render a native <fieldset \/>
  - **CheckboxGroupLegend** - Would render a native <legend \/>
  - **CheckboxGroupHelpeText** - The helper text component

Checkbox Component's Internal Anatomy:

```tsx
const Checkbox = () => {
  return (
    <>
      <CheckboxLabel>
        <CheckboxIcon />
        <VisuallyHidden>
          <CheckboxInput />
        </VisuallyHidden>
        <CheckboxLabelText />
      </CheckboxLabel>
      <CheckboxHelpText />
    </>
  );
};
```

CheckboxGroup Component's Internal Anatomy:

```tsx
const CheckboxGrop = () => {
  return (
    <CheckboxGroupFieldset>
      <CheckboxGroupLegend>title</CheckboxGroupLegend>
      {children}
      <CheckboxGroupHelpeText type="default | negative" />
    </CheckboxGroupFieldset>
  );
};
```

## `Checkbox` API

| Prop                | Type       | Required | Default   | Description                                                                                                                                              |
| ------------------- | ---------- | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children            | `string`   | No       | undefined | The text to be rendered as CheckboxLabel                                                                                                                 |
| helpText          | `string`   | No       | undefined | The helper text to be rendered                                                                                                                           |
| isChecked           | `boolean`  | No       | false     | state of the checkbox, if explicitly set the checkbox will be controlled                                                                                 |
| defaultChecked      | `boolean`  | No       | false     | default state of the checkbox, if isChecked is not provided the checkbox will be uncontrolled                                                            |
| onChange            | `Function` | No       | undefined | The function to be called when the checkbox state changes.                                                                                               |
| isIndeterminate     | `boolean`  | No       | false     | mixed state of the checkbox                                                                                                                              |
| name (html native)  | `string`   | No       | undefined | The name of the input field in a checkbox, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name)            |
| value (html native) | `string`   | No       | undefined | The value of the input field in a checkbox, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value) |
| isDisabled          | `boolean`  | No       | `false`   | Control whether the checkbox is disabled or not.                                                                                                         |
| hasError           | `boolean`  | No       | `false`   | Control whether the checkbox is invalid or not.                                                                                                          |
| isOptional          | `boolean`  | No       | `false`   | Control whether the checkbox is optional or not.                                                                                                         |

### Examples:

#### Basic

```tsx
// Label text
<Checkbox>is blade awesome?</Checkbox>
// Helper text
<Checkbox helpText="Hint: yes">is blade awesome?</Checkbox>
// uncontrolled
<Checkbox defaultChecked={true}>is blade awesome?</Checkbox>
// controlled
<Checkbox isChecked={true | false} onChange={isChecked => {}}>is blade awesome?</Checkbox>
```

#### Validations

By default checkboxes will have `required` prop but if users want the checkbox to be optional they can pass `isOptional` prop. 

And `hasError` will pass `aria-invalid` attributes to indicate invalid state.

```tsx
<Checkbox isRequired>is blade awesome?</Checkbox>
<Checkbox hasError={true | false}>is blade awesome?</Checkbox>
```

## `CheckboxGroup` API

| Prop          | Type                        | Required | Default     | Description                                                                                                                        |
| ------------- | --------------------------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| children      | `React.ReactNode`             | Yes       | `undefined` | Accepts multiple Checkboxes                                                                                                        |
| label         | `string`                    | Yes       | `undefined` | The label of the group                                                                                                             |
| labelPosition | `top, left`                 | No       | `top`       | The position of the rendered label                                                                                                 |
| helpText    | `string`                    | No       | `undefined` | The helper text to be rendered                                                                                                     |
| errorText    | `string`                    | No       | `undefined` | The error text to be rendered                                                                                                     |
| defaultValue  | `string[]`                  | No       | `[]`        | The initial value of the checkbox group                                                                                            |
| value         | `string[]`                  | No       | `[]`        | The value of the checkbox, if present will act as controlled component                                                             |
| onChange      | `(value: string[]) => void` | No       | `undefined` | The function to be called when any checkbox's state changes                                                                        |
| name          | `string`                    | No       | `undefined` | The name of the checkbox group, [useful in form submissions](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name) |
| isDisabled    | `boolean`                   | No       | `false`     | Control whether the checkbox group is disabled or not.                                                                             |
| hasError     | `boolean`                   | No       | `false`     | Control whether the checkbox group is invalid or not.                                                                              |
| isOptional    | `boolean`                   | No       | `false`     | Control whether the checkbox group is optional or not.                                                                             |

### Examples:

#### Basic

```tsx
<CheckboxGroup
  label="Developers"
  helpText="Pick blade developers"
  defaultValue={['anurag', 'kamlesh']}
>
  <Checkbox value="anurag">Anurag</Checkbox>
  <Checkbox value="kamlesh">Kamlesh</Checkbox>
  <Checkbox value="chaitanya">Chaitanya</Checkbox>
</CheckboxGroup>
```

#### Controlled, Uncontrolled

```tsx
const Controlled = () => {
  const [selected, setSelected] = React.useState(['anurag', 'kamlesh']);

  return (
    <CheckboxGroup 
      label="Developers (controlled)" 
      value={selected} 
      onChange={setSelected}
    >
      <Checkbox value="anurag">Anurag</Checkbox>
      <Checkbox value="kamlesh">Kamlesh</Checkbox>
      <Checkbox value="chaitanya">Chaitanya</Checkbox>
    </CheckboxGroup>
  );
};

const Uncontrolled = () => {
  return (
    <CheckboxGroup
      label="Developers (uncontrolled)"
      defaultValue={['anurag', 'chaitanya']}
    >
      <Checkbox value="anurag">Anurag</Checkbox>
      <Checkbox value="kamlesh">Kamlesh</Checkbox>
      <Checkbox value="chaitanya">Chaitanya</Checkbox>
    </CheckboxGroup>
  );
};
```

### Note on CheckboxGroup

For properties `isDisabled`, `hasError`, `isOptional` we want the CheckboxGroup to pass down these props to all the Checkboxes inside of it, but there is a gotcha.

#### Case 1: Atleast one checkbox should be checked 

We will pass isOptional to all the childrens.
Note that we can't pass `isOptional` in the CheckboxGroup itself because it will cause it to render `(optional)` tag.

```tsx
// Atleast one checkbox should be checked
<CheckboxGroup hasError={checked.length < 1}>
   <Checkbox isOptional />
   <Checkbox isOptional />
   <Checkbox isOptional />
</CheckboxGroup
```


#### Case 2: All checkboxes should be checked

Since all checkboxes by default will be `required` we can just set `hasError` to control the error state of the group

```tsx
// All checkboxes should be checked
<CheckboxGroup hasError={checked.length < 2}>
   <Checkbox />
   <Checkbox />
   <Checkbox />
</CheckboxGroup
```

#### Case 3: The whole group is optional

For this case the `CheckboxGroup` will pass down `isOptional` prop and render the `(optional)` tag.

```tsx
// The whole group is optional
<CheckboxGroup isOptional> // <-- will pass down this prop
   <Checkbox />
   <Checkbox />
   <Checkbox />
</CheckboxGroup
```

The consumer will provide proper validation logic and depending on their use case and requirements they will pass `hasError` in conjunction with `isOptional` and they should also use `helpText` to convey the correct intent and extra information to the user.

**Example of user managed validation**

Example of only one checkbox needs to be checked:

```tsx
function AnyOneHasToBeSelected() {
  const [selected, setSelected] = React.useState([]);

  return (
    <CheckboxGroup
      label="Do you love any of the fruites?"
      helpText="You can select multiple"
      value={selected}
      onChange={setSelected}
      isRequired
      hasError={selected.length === 0 ? true : false}
    >
      <Checkbox value="apple">apple</Checkbox>
      <Checkbox value="mango">mango</Checkbox>
      <Checkbox value="orange">orange</Checkbox>
      <Checkbox value="banana">banana</Checkbox>
    </CheckboxGroup>
  );
}
```

Example of every checkboxes needs to be checked:

```tsx
function AllOfThemHasToBeSelected() {
  const [selected, setSelected] = React.useState([]);

  return (
    <CheckboxGroup
      label="Do you agree to all the terms?"
      helpText="Select all"
      value={selected}
      onChange={setSelected}
      isRequired
      hasError={selected.length === 3 ? true : false}
    >
      <Checkbox value="use-ts">I will use TS</Checkbox>
      <Checkbox value="no-any">I won't use any</Checkbox>
      <Checkbox value="use-js">I won't use JS</Checkbox>
    </CheckboxGroup>
  );
}
```

And lastly users can also individually set `isRequired`, `hasError` props on the <Checkbbox \/> components instead of the parent CheckboxGroup for greater fine control.

```tsx
function IndividualCheckboxValidation() {
  return (
    <CheckboxGroup label="Do you agree to all the terms?" helpText="Select all">
      <Checkbox value="use-ts" isRequired>
        I will use TS
      </Checkbox>
      <Checkbox value="no-any">I won't use any (you can use it)</Checkbox>
      <Checkbox value="use-js" isRequired>
        I won't use JS
      </Checkbox>
    </CheckboxGroup>
  );
}
```

## Accessibility

- Checkbox - https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
- CheckboxGroup - The group's accessibility is bit tricky to get right, thus I'll implement and refine it and then document it here. 

## Open Questions

1. Currently we only have `helpText` in Checkbox & CheckboxGroup and when we set `hasError` it becomes the `negative` variant. The problem is the content of the `helpText` should also change in certain scenarios to convey the exact error. 

With this approach users will have to handle the logic

```tsx
const [hasError, setInvalid] = React.useState(false);

<Checkbox 
  hasError={hasError}
  helpText={
    hasError
    ? 'Invalid username provided, contains special chars' 
    : 'Enter valid username'
  }
/>
```

Will it be better to have a `errorText` prop instead which will automatically be switched internally is `hasError` is true? 

```tsx
const [hasError, setInvalid] = React.useState(false);

<Checkbox 
  hasError={hasError}
  helpText={'Enter valid username'}
  errorText={'Invalid username provided, contains special chars'}
/>
```

**Conclusion:** No errorText on the `Checkbox` itself, we will only have it on `CheckboxGroup`.