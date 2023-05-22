---
'@razorpay/blade': major
---

feat(Dropdown): Controlled Dropdown and Button Trigger

> **Warning**
>
> **Breaking change** for consumers who -
>
> - Use `isDefaultSelected` on `ActionListItem` component
> - Use `onChange` on `SelectInput` (under some scenarios. Check migration guide below)
>
> Rest of the consumers can safely upgrade without any migration

### Migration Guide

#### `isDefaultSelected` Migration

We have removed `isDefaultSelected` from `<ActionListItem />` component. [Check out API decision](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Dropdown/_decisions/controlled-dropdown.md) for reasoning

If you were using it as a workaround for controlled selection,

- We now have a first class controlled selection support with `value` and `onChange` prop on `SelectInput`.

  Checkout CodeSandbox Example for new API - https://codesandbox.io/s/blade-controlled-select-vxg30b

If you were using `isDefaultSelected` for default selections, you can now use `defaultValue` on SelectInput

- Remove `isDefaultSelected` and use `defaultValue` on SelectInput. You can pass array of values to `defaultValue` in case of multiselect
  ```diff
  <Dropdown>
    <SelectInput
      label="Select City"
  +   defaultValue="mumbai"
    />
    <DropdownOverlay>
      <ActionListItem
        title="Mumbai"
        value="mumbai"
  -     isDefaultSelected
       />
      <ActionListItem title="Bangalore" value="bangalore" />
    </DropdownOverlay>
  </Dropdown>
  ```

#### `onChange` on SelectInput Migration

As a part of [bug fix](https://github.com/razorpay/blade/issues/1102), `onChange` will now **NOT** be called on initial render
like it previously did. This will only require migration if you were earlier relying on `onChange` to set initial value.

If you were relying on `onChange` to set initial value, you can now move those values to your `useState`'s initial value.

```tsx
const Example = (): JSX.Element => {
  const [cities, setCities] = React.useState();
  return (
    <>
      <Dropdown>
        <SelectInput label="Cities" onChange={({values}) => setCities(values) } />
        <DropdownOverlay>
          <ActionListItem title="Mumbai" value="mumbai" />
          <ActionListItem title="Pune" value="pune" />
        </DropdownOverlay>
      </Dropdown>
      <Text>{cities}</Text>
      {/*
        In earlier versions, value of `cities` would've been `['']`
        (because onChange would've been called initially to set array with empty string value)

        Now it will output undefined (anything you pass in your useState) as the onChange wouldn't be called on initial render
      */}
    <>
  )
}
```
