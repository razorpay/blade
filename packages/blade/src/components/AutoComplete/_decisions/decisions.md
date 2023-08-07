# AutoComplete

A SelectInput where you can type inside the input to filter through the items.

<img width="215" alt="image" src="https://github.com/razorpay/blade/assets/30949385/63d95ab7-6231-4986-befb-1634269e7af3">

## Design

- [SelectInput & AutoComplete - Figma Design](<(https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13590%3A171038&mode=dev)>)

## API

AutoComplete will be built as a new trigger for existing Dropdown component.

Depending on where and how AutoComplete is used, the API can differ. Checkout examples below on how code will look like for a particular usage.

- [Basic Usage](#basic-usage)
- [Controlled Usage](#controlled-usage)
- [Usage in BottomSheet](#usage-in-bottomsheet)
- [Usage when Tags are Outside]()

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

### Controlled Usage

There are 3 controlled states that are relevant to AutoComplete

1. Controlled state of filtering items
2. Controlled state of the Input where user types
3. Controlled state of selected items

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

### Usage in BottomSheet

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

### Outside Tags

When possible selections are more than 11, it is advised to put tags outside of the Input.

<img width="700" alt="image" src="https://github.com/razorpay/blade/assets/30949385/8906eb6c-fae0-4e99-bd3f-d7e0edc60537">

```jsx
const [selectedItems, setSelectedItems] = React.useState([]);

// ...

<AutoComplete
  label="Status"
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

## Props

```ts
type AutoCompleteProps = {
  label: string;
  name?: string;
  row?: '1' | '3' | 'expandable';
  /**
   *
   *
   * @default true
   */
  showTags?: boolean;
  value?: string;
  onChange?: (inputValue) => void;
  selected?: string[];
  onSelectChange?: ({ name, values }: { name?: string; values?: string[] }) => void;
  // ... Common input props like `validationState`, `helpText`, etc
};
```

## Open Questions

- Is everyone sold on `selected` and `onSelectChange` API? It is inconsistent with SelectInput.
- What to do with BottomSheetHeader (and BaseHeader)
