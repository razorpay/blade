---
"@razorpay/blade": patch
---

- feat(Dropdown): add E2E tests
- fix(Dropdown): dropdown getting closed without explicit isOpen={false} in controlled dropdown
  
  > [!NOTE]
  >
  > if you have used ControlledDropdown in a similar how it was documented, things should work fine.
  > If you have used `isOpen` from Controlled Dropdown but you're not handling it inside `onOpenChange`, you will have to handle that state as well. E.g. `isOpen={isDropdownOpen} onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}`
