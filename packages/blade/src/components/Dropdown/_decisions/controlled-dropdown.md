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

|                          | ✅ `onChange` + `isSelected`                                                                                                                                                                                                                                | `onChange` + `value`                                                                                                                                                                                                                                                                                                                                    | `useSelect`                                                                                                                                                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| State Management         | ✅ Independent of how state is manged (consumers can store value of item in state as shown in example above, they can store selectedIndex, they might also have entire ActionList data as array somewhere and they can use `selected` prop from their data) | Consumer can store `currentSelectionValue` in state and handle on basis of that                                                                                                                                                                                                                                                                         | Handles state internally. Requires FE Core to export appropriate methods. E.g. If consumer is storing selected data in some object, they have to transform that data to our input format and then call `selectItem`                                                      |
| Usage in other libraries | ✅ Primer, A little similar to Radix, and Polaris                                                                                                                                                                                                           | ✅ Very close to Radix, and Polaris                                                                                                                                                                                                                                                                                                                     | downshift-js                                                                                                                                                                                                                                                             |
| DX (Opinion)             | ✅ Similar to ``tag in HTML. Also we already have`isDefaultSelected`so might be intuitive to have`isSelected` as well                                                                                                                                       | Also intuitive because we support similar thing in other Inputs. My concerns was `value={['mango', 'apple']}` with multiselect. Passing array to `value` might seem a bit strange. Also this approach will only make sense if we overall [decide to make "ActionList" non-selectable items on consumer end](#are-actionlistitem--selectable-components) | This forces you to write selection logic outside of JSX which might not be as intuitive when you want to do something like fetching initial data from API and set selected values while rendering the ActionList. More info at [why not `useSelect`](#why-not-useselect) |

#### Why not `useSelect`?

Throughout initial discussions we mostly talked about creating this hook so noting down things here which made me change my opinion-

- The hooks pattern for controlled inputs is not very common in ecosystem. Didn't find this being used anywhere apart from downshift-js (in their case, everything is hook). Most popular libraries follow something along the lines of `onChange` + `isSelected`.
- Initial assumption was that there will be too much of state management on user's end with `onChange` + `isSelected` type of approach but now that I look at the [overall example](#onchange--isselected-), it doesn't seem too complex. It also covers most usecases I could think of like `reset`, reading currently selected options, etc.
- Additional learning curve of `useSelect` API. Explaining `isSelected` is a lot more easier.
- Since `useSelect` will return `selectOption` method, consumers have to hook this into their state management.

```jsx
const { values } = useFormik();
const { selectOption } = useSelect();

const doSomethingComplex = () => {
  // ... bunch of code that updates `values`
  selectOption(values.status);
};

// As opposed to in `onChange` it will just look like this -
const { values } = useFormik();

<ActionListItem isSelected={values.status === 'pending'} title="Pending" />;
```

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

## Open Questions

### Are `<ActionListItem />` "selectable" components?

**Context:** We support `isDefaultSelected` on ActionList and plan to support `isSelected` now so that means we are treating ActionList as selectable items. When we have `Button` as trigger, we turn ActionList into menu which is not "selectable" but rather a list of "clickable" items.

- **Pros of keeping ActionList selectable**

  - Selection logic is still applicable in `<AutoComplete />`, or any selectable trigger we plan to add in future
  - Here we are only talking about "selection" logic on consumer-facing props but selection logic on our end will anyway always be there irrespective of this call as we have single component that acts as `<MenuOption />` and `<SelectOption />`, both. Normally I have seen libraries tackle this in separate components.

- **Cons**
  - Not applicable in Button trigger so `isSelected` would do nothing in that case
  - Will be a breaking change (We'll move to using `defaultValue` and `value` on `<SelectInput />` instead of `isDefaultSelected` and `isSelected` on `<ActionListItem />`)

## TODOs

- [ ] Do a code POC to see if implementation is not too complex
