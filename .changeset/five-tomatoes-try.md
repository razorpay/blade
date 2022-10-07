---
'@razorpay/blade': major
---

feat(Typography): make `size` prop consistent for `Heading`, `Title`, and `Text`

> **Warning**
>
> Breaking Change!
> This is a breaking change for apps that are using `Title` or `Heading` component from blade. Rest of the apps can upgrade without any migrations.

#### Migration

_**Tip:** If you're using TypeScript, run `yarn tsc` and that should throw errors wherever a change is required._

1. **`<Title />`:** Rename `variant` prop to `size` in Title

```diff
- <Title variant="small">Some Title</Title>
+ <Title size="small">Some Title</Title>
```

2. **`<Heading />`:** Rename `variant` prop to `size` if the value is `small`, `medium,` or `large`. No change is required on `variant="subheading"`.

```diff
<Heading variant="subheading">Nothing changes here</Heading> // No change here

- <Heading variant="medium">Medium Heading</Heading>
+ <Heading size="medium">Medium Heading</Heading>
```

##### Edge Cases

Make sure to follow migration on new component if `Title` or `Heading` from blade is overriden with styled-components.

```diff
const MyTitle = styled(Title)`
  // some styles
`

- <MyTitle variant="large" />
+ <MyTitle size="large" />
```
