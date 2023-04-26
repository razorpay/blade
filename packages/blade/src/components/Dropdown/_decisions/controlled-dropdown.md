# Controlled Dropdown API

Checkout [Dropdown API Decision](./decisions.md) if you're looking for decisions behind the initial API.

## Problem

### Problem Statement 1: State and City Dropdowns

Imagine a usecase where someone has "State" and "City" dropdown and when you select City, the default "State" automatically gets selected.

Currently there is no ([legal](https://codesandbox.io/s/state-fill-usecase-42u1ev?file=/App.tsx)) way to achieve this because we only support Uncontrolled Dropdown where you can set default selection on first render, but every other selection is handled internally only.

### Problem Statement 2: Reset SelectInput value

If you have a "Reset" button in your form, there isn't way to de-select an already selected item ([legally](https://razorpay.slack.com/archives/C01H13RTF8V/p1681287510398639?thread_ts=1681286843.013449&cid=C01H13RTF8V)). For such usecases as well we need controlled Dropdown

### Proposed Approaches

<details>
<summary><code>onChange</code> + <code>isSelected</code></summary>

#### `onChange` + `isSelected`

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

</details>

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

## Concluded Solution

Based on the [discussions](#approach-comparisons), we decided to go with a combination of approaches propsed above-

- On `SelectInput`, `value` + `onChange` + `defaultValue`
- On `ActionListItem`, `isSelected` + `onClick` + `isDefaultSelected`

### When Trigger is `SelectInput`

For SelectInput (and maybe AutoComplete in future), we decided to go with `value` + `onChange` props on the trigger. This keeps the controlled state props on the same component as opposed to `isSelected` + `onChange` approach where `isSelected` goes on ActionListItem and `onChange` goes on SelectInput.

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

### When Trigger is Button or other triggers

When it's Button or other trigger, we use `isSelected` and `onClick` from `ActionListItem`

```jsx
const [currentSelection, setCurrentSelection] = React.useState();
const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

const onSomeAction = () => {
  setCurrentSelection('mumbai');
};

<Dropdown>
  <DropdownButton>Show Dropdown</DropdownButton>
  <DropdownOverlay>
    <ActionList>
      <ActionListItem
        title="Mumbai"
        value="mumbai"
        // New Props 👇🏼
        isSelected={currentSelection === 'mumbai'}
        onClick={() => {
          // This handles internal controlled state
          setCurrentSelection('mumbai');
        }}
      />
      <ActionListItem title="Bangalore" value="bangalore" />
    </ActionList>
  </DropdownOverlay>
</Dropdown>;
```

### Approach Comparisons

As mentioned in [Propsed Approaches](#proposed-approaches), we considered 3 approaches majorly -

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

**Conclusion:** We decided that we would need a combination of both approaches. Because-

- Based on the [selectable usecase of Menu](#menu-with-selected-item), the ActionListItem has to be "selectable" individually. Which means we definitely need something like `isSelected` on ActionListItem.
- However the concerns raised with `onChange` + `isSelected` approach were that the controlled states end up on 2 different indepdent component which is confusing and they in a way become bound to each other.
- Thus, We decided-
  - To go with `value` + `onChange` on `SelectInput` trigger so that the controlled state stays on same component and SelectInput also becomes consistent with rest of the Input components.
  - To go with `isSelected` + `onClick` on `ActionListItem` to satisfy selected menu usecase.

### Discussions MOM

#### Is `ActionListItem` a selectable component?

well... yes and no.

##### Problem

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

##### Differences between a Menu and Select

###### Select

When you click on item inside Select,

- It gets selected
- The value gets added to SelectInput

E.g. A city selection menu that shows list of cities.

<img width="453" src="https://user-images.githubusercontent.com/30949385/233962393-eaba886d-d4e6-4975-b15d-e1725c5d798b.gif" />

###### Menu

When you click on item inside Menu,

- It performs it's onClick / href action

E.g. A profile menu that shows options of going to different page, logging out of profile, etc

<img width="453" src="https://user-images.githubusercontent.com/30949385/233962251-0e1e32f7-9252-4655-9fb6-e4b7c4db5ebc.gif" />

Here, Items are not "selected" after click, they only perform a certain action.

Easy! So in select the items are selectable and in menu they are not... welll... **nope**.

###### Menu with Selected Item

Think of a usecase where you have a profile icon that allows you to switch profile. You would want your current profile to have "selected" styles in this case.

In the below example, Anurag's profile should have "selected" styling in-order to show the current profile

<img width="453" alt="image" src="https://user-images.githubusercontent.com/30949385/233959558-cabd5ef6-ea9d-437c-97d3-b4d4530e5f9b.png">

<details>

<summary>Some libraries support selected prop in their MenuItem components for this reason</summary>

- [MUI](https://mui.com/material-ui/react-menu/#selected-menu)
- [Primer](https://primer.style/react/ActionMenu#with-selection)

</details>

##### Conclusion

Based on the usecases like Menu with Selected Items, we can conclude that `ActionListItem` is indeed a selectable component. However, In Menu, it can only be selected in a controlled state (When someone passes `isSelected`) and cannot be selected when item is clicked.

Whereas in Select, it can be selected in a controlled state as well as when user clicks on item.

#### Additional Notes and Action Items

- We noticed that we've been mixing the "Menu" and "Select" so far. It's better to refactor and separate them out into individual internal component for better separation of concerns and UX.
  - [ ] Refactor the internal code of `ActionListItem` into `SelectItem` and `MenuItem` components to handle 2 separate behaviours and semantics.
- There are also "impossible" states like passing `isSelected` on ActionListItem when `SelectInput` is used, we decided to handle it validations end. Things like trying to select multiple items in single select will also be handled on validations end.

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
