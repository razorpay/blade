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

#### `onChange` + `value`

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

#### useSelect

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

As displayed above, there are 3 approaches we can take

- `onChange` Prop-Based
  - [`onChange` + `value`](#onchange--value)
  - [`onChange` + `isSelected`](#onchange--isselected-)
- Hook-Based ([`useSelect`](#useselect))

#### Hook-Based vs `onChange` Prop-Based

First we'll discuss Prop-Based vs Hook-Based because throughout initial discussion we talked about creating hook-based API but following points made me change my opinion-

|                             | Hooks-Based Approach                                                                    | ✅ `onChange` Prop Based Approach                                                     |
| --------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Occurences in Ecosystem** | Rare (only seen in downshift-js)                                                        | ✅ Common (Almost all libraries use some form of this approach for controlled select) |
| **Learning Curve**          | More (Introduces new hook so need documentation on input type, output type, usage, etc) | ✅ Less (Only adds one prop on top of existing implementation)                        |
| **API Verbosity**           | ✅ Less verbose                                                                         | Comparitively more verbose but not too complex ([Example](#onchange--isselected-))    |

**Conclusion**: We are going with `onChange` prop-based approach ✅

#### `onChange` + `value` vs `onChange` + `isSelected`

Lets compare 2 `onChange` prop-based approaches now-

| `onChange` + `isSelected`                                                                    | `onChange` + `value`                                                       |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Preferred Approach if we say `ActionListItem` is selectable component independent of trigger | Preferred Approach if only `SelectInput` trigger has selectable components |

**Reasoning:**

- If ActionListItem is individually selectable, then having `isSelected` makes more sense so that everywhere we use `ActionList`, we'll be able to mark item as selected irrespective of trigger
- If ActionListItem is not selectable in itself, then having `value` prop on `SelectInput` makes more sense because it's consistent with other Inputs, and we'll likely need something like this in `AutoComplete` eventually.

Thus, deciding factor now is whether the ActionListItem is selectable or not.

Which takes us to next conversation,

### Is `ActionListItem` a selectable component?

well... yes and no.

#### Problem

We cover 2 components in one component, SelectMenu and ActionMenu.

<details>

<summary>Libraries usually prefer building these separately</summary>

- Primer
  - [SelectPanel](https://primer.style/react/SelectPanel)
  - [ActionMenu](https://primer.style/react/ActionMenu)
- Radix
  - [Select](https://www.radix-ui.com/docs/primitives/components/select#select)
  - [DropdownMenu](https://www.radix-ui.com/docs/primitives/components/dropdown-menu)
- Material UI
  - [Select](https://mui.com/material-ui/react-select/)
  - [Menu](https://mui.com/material-ui/react-menu/)

</details>
<br />

To solve this problem, irrespective of whether we build this as separate component or not, we have to think of it as separate component from implementation end.

#### Differences between a Menu and Select

When you click on item inside Select,

- It gets selected
- The value gets added to SelectInput

E.g. A city selection menu that shows list of cities.

[TODO: add gif of select]

When you click on item inside Menu,

- It performs it's onClick / href action

[TODO: add gif of menu]

E.g. A profile menu that shows options of going to different page, logging out of profile, etc

Easy! So in select the items are selectable and in menu they are not... welll... **nope**.

Think of a usecase where you have a profile icon that allows you to switch profile. You would want your current profile to have "selected" styles in this case.

<details>

<summary>Some libraries support selected prop in their MenuItem components for this reason</summary>

- [MUI](https://mui.com/material-ui/react-menu/#selected-menu)
- [Primer](https://primer.style/react/ActionMenu#with-selection)

</details>

[TODO: add gif of Swith Profile usecase]

#### Conclusion

Hence, ActionListItem in all the scenarios is a "selectable" item. But in SelectMenu, it gets selected by default on click.

Whereas in ActionMenu, it is selectable only when you explicitly pass `isSelected` under certain condition

Hence, `ActionListItem` as a whole should be selectable. The default behaviour of when and how it gets selected can depend on the trigger.

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
