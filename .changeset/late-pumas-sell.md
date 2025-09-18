---
'@razorpay/blade': minor
'@razorpay/blade-mcp': minor
---

feat(blade): add support for non-dismissible modals & bottomsheet

Introduces a new prop `isDismissible` in `Modal` and `BottomSheet` which can be used to prevent users from accidentally dismissing modals and bottomSheey by clicking outside or pressing the escape key. When `isDismissible={false}`, the close button is automatically hidden and the modal  and bottomSheet can only be closed through explicit user actions.

```jsx
<Modal
  isOpen={isOpen}
  isDismissible={false}
>
// .... modal content ....
</Modal>
```

```jsx
<BottomSheetComponent isOpen={isOpen} isDismissible={false}> 
// .... bottomsheet component ....
</BottomSheetComponent>

```

