---
"@razorpay/blade": minor
---

feat(DropdownHeaderFooter): add DropdownHeader DropdownFooter components

We have standardised the Header and Footer between Dropdown, BottomSheet, Modal, and any future components.

> **Warning**
>
> **Breaking Change :** For consumers who use - `ActionListHeader` or `ActionListFooter`.
> 
> Through our code search we found there weren't any instances of these component in Razorpay code yet thus this is released under minor version



## Migration Guide

> **Note**
>
> The Header and Footer are redesigned so it might not be possible to have 1:1 designs. The new header and footer will look different.

1. Remove `ActionListHeader` and `ActionListFooter` from the inside of the `ActionList`
2. Add `DropdownHeader` and `DropdownFooter` outside of the `ActionList`, inside `DropdownOverlay`.

```diff
import { 
  Dropdown, 
  DropdownOverlay, 
  SelectInput,
  ActionListHeader, 
  ActionListFooter, 
  ActionList, 
  ActionListItem 
} from '@razorpay/blade/components';

function App() {
  return (
    <Dropdown>
      <SelectInput label="Select City" />
      <DropdownOverlay>
+       <DropdownHeader title="Title" />
        <ActionList>
-          <ActionListHeader title="Title" />
            <ActionListItem />
            <ActionListItem />
-          <ActionListFooter trailing={<Button>Apply</Button>} />
        </ActionList>
+       <DropdownFooter>
+         <Box><Button>Apply</Button></Box>
+       </DropdownFooter>
      </DropdownOverlay>
    </Dropdown>
  )
}

export { App };
```

Checkout [Dropdown Docs](https://blade.razorpay.com/?path=/story/components-dropdown-dropdown--page&globals=showInternalComponents:true;measureEnabled:false) for more details
