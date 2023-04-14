# Controlled Dropdown API

Checkout [Dropdown API Decision](./decisions.md) if you're looking for decisions behind the initial API.

## Problem

### Problem Statement 1: State and City Dropdowns

Imagine a usecase where someone has "State" and "City" dropdown and when you select City, the default "State" automatically gets selected.

Currently there is no ([legal](https://codesandbox.io/s/state-fill-usecase-42u1ev?file=/App.tsx)) way to achieve this because we only support Uncontrolled Dropdown where you can set default selection on first render, but every other selection is handled internally only.

### Problem Statement 2: Reset SelectInput value

If you have a "Reset" button in your form, there isn't way to de-select an already selected item ([legally](https://razorpay.slack.com/archives/C01H13RTF8V/p1681287510398639?thread_ts=1681286843.013449&cid=C01H13RTF8V)). For such usecases as well we need controlled Dropdown

## Solutions

### `onChange` + `isSelected` ✅

Slightly similar to primer and closest to HTML's `<select>`.

```jsx
const [currentSelection, setCurrentSelection] = React.useState();

const onSomeAction = () => {
  setCurrentSelection('mumbai');
};

const onResetClick = () => {
  setCurrentSelection(undefined);
};

const onSelectChange = ({ values }) => {
  setCurrentSelection(values[0]);
};

<Dropdown>
  <SelectInput label="City" onChange={onSelectChange} />
  <DropdownOverlay>
    <ActionList>
      <ActionListItem
        // New Prop 👇🏼
        isSelected={currentSelection === 'mumbai'}
        title="Mumbai"
        value="mumbai"
      />
      <ActionListItem
        isSelected={currentSelection === 'bangalore'}
        title="Bangalore"
        value="bangalore"
      />
    </ActionList>
  </DropdownOverlay>
</Dropdown>;
```

### Alternate Approach

<details>
<summary><code>onChange</code> + <code>value</code></summary>

### `onChange` + `value`

```jsx
const [currentSelection, setCurrentSelection] = React.useState();

const onSomeAction = () => {
  setCurrentSelection('mumbai');
};

const onResetClick = () => {
  setCurrentSelection(undefined);
};

const onSelectChange = ({ values }) => {
  setCurrentSelection(values[0]);
};

<Dropdown>
  <SelectInput
    label="City"
    // New Prop 👇🏼
    value={currentSelection}
    onChange={onSelectChange}
  />
  <DropdownOverlay>
    <ActionList>
      <ActionListItem title="Mumbai" value="mumbai" />
      <ActionListItem title="Bangalore" value="bangalore" />
    </ActionList>
  </DropdownOverlay>
</Dropdown>;
```

</details>

<details>
<summary><code>useSelect</code> hook</summary>

```jsx
const { selectItem, reset, dropdownRef } = useSelect();

const onSomeAction = () => {
  selectItem('mumbai');
};

const onResetClick = () => {
  reset();
};

<Dropdown ref={dropdownRef}>
  <SelectInput />
  <DropdownOverlay>
    <ActionList>
      <ActionListItem title="Mumbai" value="mumbai" />
      <ActionListItem title="Bangalore" value="bangalore" />
    </ActionList>
  </DropdownOverlay>
</Dropdown>;
```

Inspirations

</details>

### Approach Comparison

|                          | ✅ `onChange` + `isSelected`                                                                                                                                                                                                                                | `onChange` + `value`                                                                                                                                                                    | `useSelect`                                                                                                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State Management         | ✅ Independent of how state is manged (consumers can store value of item in state as shown in example above, they can store selectedIndex, they might also have entire ActionList data as array somewhere and they can use `selected` prop from their data) | Consumer can store `currentSelectionValue` in state and handle on basis of that                                                                                                         | Handles state internally. Requires FE Core to export appropriate methods. E.g. If consumer is storing selected data in some object, they have to transform that data to our input format and then call `selectItem` |
| Usage in other libraries | ✅ Primer, A little similar to Radix, and Polaris                                                                                                                                                                                                           | ✅ Very close to Radix, and Polaris                                                                                                                                                     | downshift-js                                                                                                                                                                                                        |
| DX (Opinion)             | ✅ Similar to `<options selected>` tag in HTML. Also we already have `isDefaultSelected` so might be intuitive to have `isSelected` as well                                                                                                                 | Also intuitive because we support similar thing in other Inputs. My only concerns was `value={['mango', 'apple']}` with multiselect. Passing array to `value` might seem a bit strange. | This forces you to write selection logic outside of JSX which might not be as intuitive when you want to do something like fetching initial data from API and set selected values while rendering the ActionList.   |

#### Why not `useSelect`?

Throughout initial discussions we mostly talked about creating this hook so noting down things here which made me change my opinion-

-

### Referrences

- Primer
  - [ActionMenu](https://primer.style/react/ActionMenu#with-selection) (Closest to our approach. Uses `selected` and `onSelect`)
    ```jsx
    <ActionList.Item
      key={index}
      selected={index === selectedIndex}
      //
      onSelect={() => setSelectedIndex(index)}
    />
    ```
- Radix [[CodeSandbox Example](https://codesandbox.io/p/sandbox/holy-cache-5kwcgm?selection=%5B%7B%22endColumn%22%3A1%2C%22endLineNumber%22%3A28%2C%22startColumn%22%3A1%2C%22startLineNumber%22%3A24%7D%5D&file=%2FApp.jsx)]
- [Polaris](https://polaris.shopify.com/components/selection-and-input/autocomplete) (They have `selected` object with `onSelect` on top component itself)
- [downshift-js](https://github.com/downshift-js/downshift/tree/master/src/hooks/useSelect#actions) (`useSelect` hook)

## Existing Solutions in Ecosystem

<details>
<summary>Combination of <code>isSelected</code> + <code>onChange</code> Props</summary>

```jsx
const [selectValue, setSelectValue] = React.useState(undefined);

const onSomeAction = () => {
  setSelectValue('mango');
};

return (
  <Select.Root
    value={selectValue}
    onChange={(values) => {
      setSelectValue(values);
    }}
  ></Select.Root>
);
```

</details>

[Open Example in CodeSandbox]()
