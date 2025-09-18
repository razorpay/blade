---
'@razorpay/blade': minor
'@razorpay/blade-mcp': minor
---

feat(blade): add support for non-dismissible modals

Introduces a new prop `isDismissible` in `Modal` which can be used to prevent users from accidentally dismissing modals by clicking outside or pressing the escape key. When `isDismissible={true}`, the close button is automatically hidden and the modal can only be closed through explicit user actions.

```jsx
<Modal
  isOpen={isOpen}
  isDismissible={false}
>
// .... modal content ....
   <ModalFooter>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button onClick={handleConfirm}>
      Confirm Action
    </Button>
  </ModalFooter>
</Modal>
```

This is particularly useful for critical actions like payment confirmations, data deletion, or multi-step flows where accidental dismissal could cause data loss.


