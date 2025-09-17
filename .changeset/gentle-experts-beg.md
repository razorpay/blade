---
"@razorpay/blade": minor
---

feat(blade): add support for Badge in SelectInput

Introduces a new prop `valueSuffix` which in `SelectInput` which can be used to render a Badge after the the value.

```jsx
<SelectInput
  valueSuffix={({ values }) => {
    if (values[0] === 'item-1') {
      return <Badge color="positive">20% Off</Badge>;
    }
    return null;
  }}
/>
```
