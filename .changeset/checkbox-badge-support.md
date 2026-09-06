---
"@razorpay/blade": minor
---

feat(Checkbox): add `badge` prop to display a Badge inline next to the checkbox label

Adds a `badge` prop to `<Checkbox />` that accepts `{ children, color, emphasis, size }` and renders a `<Badge />` inline after the label text. Only supported in vertical `CheckboxGroup` orientation — throws a dev error when used inside a horizontal group.

**Usage:**
```jsx
<CheckboxGroup label="Select payment methods">
  <Checkbox value="upi" badge={{ children: 'Recommended', color: 'positive' }}>
    UPI
  </Checkbox>
  <Checkbox value="card">Credit / Debit Card</Checkbox>
</CheckboxGroup>
```
