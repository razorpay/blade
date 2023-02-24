---
"@razorpay/blade": patch
---

feat: support string array in children

Users can now use dynamic variables inside children and don't have to wrap it around with string literals
```jsx
<Text>{someVariable} hello</Text>
```
