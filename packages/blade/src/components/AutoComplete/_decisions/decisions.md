# AutoComplete

A SelectInput where you can type inside the input to filter through the items.

<img width="215" alt="image" src="https://github.com/razorpay/blade/assets/30949385/63d95ab7-6231-4986-befb-1634269e7af3">

## Design

- [Figma - SelectInput & AutoComplete](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13590%3A171038&mode=dev)

## Props

> **Note**
>
> Below this section, I have added [examples of common AutoComplete usage](#usage). Check them out to understand usage of these props in details.

| **Props**          | **Description**                                                                                                      | **Type**                                                        | **Default Value** |
| ------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------- |
| label              | label of input                                                                                                       | string                                                          |                   |
| accessibilityLabel | aria-label of input when label is not defined                                                                        | string                                                          |                   |
| rows               | height restrictions of input ([Checkout "Inactive - Active States" Usage](#with-different-inactive---active-states)) | '1' \| '3' \| 'expandable'                                      | '3'               |
| showTags           | Boolean to show or hide tags inside AutoComplete ([Checkout "With Tags Outside" Usage](#with-tags-outside))          | boolean                                                         | true              |
| value              | Controlled state of the value inside input                                                                           | string                                                          |                   |
| onChange           | Callback when input value changes                                                                                    | (inputValue: string) => void                                    |                   |
| selected           | Controlled state of the selected items ([Checkout "Controlled AutoComplete" Usage](#controlled-autocomplete))        | string[]                                                        |                   |
| onSelectChange     | Callback when selected items change                                                                                  | ({ name, values }: { name: string; values: string[] } ) => void |                   |

## Usage

AutoComplete will be built as a new trigger for existing Dropdown component.

Depending on where and how AutoComplete is used, the API can differ. Checkout examples below on how code will look like for a particular usage.

- [Basic Usage](#basic-usage)
- [Controlled AutoComplete](#controlled-autocomplete)
- [In BottomSheet](#in-bottomsheet)
- [With Tags Outside](#with-tags-outside)
- [With Different Inactive - Active States](#with-different-inactive---active-statess)

### Basic Usage

```jsx
<Dropdown selectionType="multiple">
  <AutoComplete label="Select Cities" />
  <DropdownOverlay>
    <ActionList>
      <ActionListItem title="Mumbai" value="mumbai" />
      <ActionListItem title="Pune" value="pune" />
      <ActionListItem title="Hyderabad" value="hyderabad" />
    </ActionList>
  </DropdownOverlay>
</Dropdown>
```

### Controlled AutoComplete

There are 3 controlled states that are relevant to AutoComplete

1. Controlled state of filtering items
2. Controlled state of the Input where user types
3. Controlled state of selected items

```jsx
<AutoComplete
  // For controlling the input value
  value={}
  onChange={(inputValue) => {}}
  // For controlling the selections
  selected={}
  onSelectChange={({ name, values }) => {}}
/>

// ...

// Filtering can be controlled by looping over <ActionListItem />
<ActionList>
  {cities.map((city) => <ActionListItem title={city} />)}
</ActionList>
```

<details>
<summary>Show Full Code</summary>

```jsx
const allCities = ['Mumbai', 'Pune', 'Hyderabad'];

const ControlledAutoComplete = () => {
  // Controlled Filtering
  const [cities, setCities] = React.useState(allCities);
  // Controlled Input Value
  const [currentInputValue, setCurrentInputValue] = React.useState('');
  // Controlled Selections
  const [currentSelections, setCurrentSelections] = React.useState<string[]>([]);

  return (
    <Dropdown>
      <AutoComplete
        label="Select City"
        // Controlled input value
        // Sets the input value of input element in AutoComplete
        value={currentInputValue}
        // Triggers when input value changes
        onChange={(inputValue) => {
          if (inputValue) {
            // filtering logic
            setCities(allCities.filter((city) => city.includes(inputValue)));
          } else {
            setCities(allCities);
          }
          setCurrentInputValue(inputValue);
        }}
        // Selected Items in AutoComplete
        selected={currentSelections}
        onSelectChange={({ values }) => {
          setCurrentSelections(values);
        }}
      />
      <DropdownOverlay>
        <ActionList>
          {cities.map((city) => (
            <ActionListItem
              title={city}
              value={city.toLowerCase()}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
```

</details>

### In BottomSheet

> **Warning**
>
> We will have to turn BottomSheetHeader (and maybe BaseHeader) to a slot to allow adding Input element there.

**Open Question:** Should we also remove `leading` `trailing` etc props from Header? since same can be implemented inside the slot. This is what we follow for Footer.

<img height="200" alt="image" src="https://github.com/razorpay/blade/assets/30949385/6867b09a-1ae2-4c4a-a977-e254b45b5282">

```jsx
<Dropdown selectionType="multiple">
  <SelectInput label="Select Emails" />
  <BottomSheet>
    <BottomSheetHeader title="Do you want this report in an email?">
      <AutoComplete label="Add receiver's email addresses" />
    </BottomSheetHeader>
    <BottomSheetBody>
      <ActionList>
        <ActionListItem title="Mumbai" value="mumbai" />
        <ActionListItem title="Pune" value="pune" />
        <ActionListItem title="Hyderabad" value="hyderabad" />
      </ActionList>
    </BottomSheetBody>
  </BottomSheet>
</Dropdown>
```

### With Tags Outside

When possible selections are more than 11, it is advised to put tags outside of the Input.

<img width="700" alt="image" src="https://github.com/razorpay/blade/assets/30949385/8906eb6c-fae0-4e99-bd3f-d7e0edc60537">

We add `showTags={false}` to AutoComplete to remove tags from input. Then we can use Controlled state to show tags outside in the UI.

When the input has `label`, we show number of items selected.

<img width="250" alt="image" src="https://github.com/razorpay/blade/assets/30949385/c8a30845-812c-493f-a51f-97c233880960">

When the input has `accessibilityLabel` and no `label`, we show the accessibilityLabel.

<img width="200" alt="image" src="https://github.com/razorpay/blade/assets/30949385/83cf63d5-ccc4-4bb9-bf0d-ce91dc5c1b09">

**Code**

```jsx
const [selectedItems, setSelectedItems] = React.useState([]);

// ...

<AutoComplete
  accessibilityLabel="Status"
  rows="1"
  showTags={false} // we don't want to show tags at 2 places
  selected={selectedItems}
  onSelectChange={({ values }) => setSelectedItems(values)}
/>


// Somewhere outside in your UI
<Box>
  {selectedItems.map((selectedItemName, index) =>
    <Tag
      onDismiss={() => removeItem(index)}
    >
      {selectedItemName}
    </Tag>
  )}
</Box>;
```

### With Different Inactive - Active States

| Code                                 | Inactive                                                                                                                   | Active                                                                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `<AutoComplete rows="1" />`          | <img width="266" alt="image" src="https://github.com/razorpay/blade/assets/30949385/74b849f3-f1b9-4922-b717-70ffc7ffd56e"> | <img width="276" alt="image" src="https://github.com/razorpay/blade/assets/30949385/055bc4f4-fb57-4129-b27a-0f1966c8ad26"> |
| `<AutoComplete rows="3" />`          | <img width="420" alt="image" src="https://github.com/razorpay/blade/assets/30949385/ed71318c-889e-407e-86bf-fe4f5902dedf"> | <img width="416" alt="image" src="https://github.com/razorpay/blade/assets/30949385/8a636a3c-2afe-43a2-b283-c5ef40c14362"> |
| `<AutoComplete rows="expandable" />` | <img width="385" alt="image" src="https://github.com/razorpay/blade/assets/30949385/21b63bc4-804a-4180-953c-119a2b676cd5"> | <img width="394" alt="image" src="https://github.com/razorpay/blade/assets/30949385/1131a1bd-2989-4bfc-b659-207088be3bfb"> |

## Accessibility

AutoComplete will contiue to follow [same keyboard navigations as SelectInput](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Dropdown/_decisions/decisions.md#accessibility).

## Referrences

- [Material UI - AutoComplete](https://mui.com/material-ui/react-autocomplete/)
  - Used for Controlled AutoComplete Inspiration
  - UI / UX Inspirations
- [Primer - AutoComplete](https://primer.style/react/Autocomplete/)
  - Usage of Tags inside AutoComplete Inspiration
- [Ariakit - Combobox Filtering](https://ariakit.org/examples/combobox-filtering)
  - Used for Controlled Filtering Inspiration
- [React Select](https://react-select.com/home)
  - Used for Accessibility and Keyboard Navigations Inspiration

## Open Questions

- **Q1:** Is everyone sold on `selected` and `onSelectChange` API? It is inconsistent with SelectInput. Might have to change it in SelectInput as well.
- **Q2:** What to do with BottomSheetHeader (and BaseHeader)? Should we make it slot like Footer? Should we remove title, subtitle, etc?
- **Q3:** `rows: '1' | '3' | 'expandable'` vs `height: 'single-line' | 'multi-line' | 'expandable'`
