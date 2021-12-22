- [From version 1.4.x to 2.x.x](#from-version-14x-to-2xx)


# From version 1.4.x to 2.x.x

## Migration guide for new blade-old icons

### Codemod to migrate to new API

We've written a codemod to automate the process of replacing the `icon` prop with imported icons. 

Simply install the blade-old package and run

```sh
// migrate-icons [directory_path_glob] [...jscodeshift_options]
migrate-icons ./src/App/*
```

This codemod automatically changes 

This:

```jsx
<Icon size="md" name="download" {...{}}>
    <works />
</Icon>
```

To this:

```jsx
import { Download } from "@razorpay/blade-old";

<Download size="md" {...{}}>
    <works />
</Download>
```

### Limitations & Edge cases of codemod

1. Conditional rendering isn't supported 

```ts
<Icon
  name={true ? "emptyCircle" : "alertCircle"}
  fill="bg.950"
  size="large"
/>
```

2. Icon props on other components aren't handled. 

```tsx
<Button icon="chevronLeft">

<TextInput
  label="Label"
  iconRight="info"
  iconLeft="info"
/>

<Tabs.Tab
  value="payments"
  title="Payments"
  disabled={boolean('Disable Tab 1', false)}
  icon="info"
>
<SegmentControl.Option
  value="1"
  icon="info"
  disabled={boolean('Disabled', false)}
  subText={text('Sub Text', undefined)}
>
  Option 1
</SegmentControl.Option>

snackbar.show({ icon: "info" })
```

-------

### Manual Migration

Migrating icons to new API:

You can either do this step via codemod or use vscode search panel to search all the instances of `name="` which will show you all the places you used icons, and replace them with their respective icon.

```diff
- import Icon from "@razorpay/blade-old";
+ import { AlertCircle } from "@razorpay/blade-old/icons";

- <Icon name="alert-circle" fill="shade.950" size="medium" />
+ <AlertCircle fill="shade.950" size="medium" />
```

Few of the internal components were using the old \<Icon /> component, thus we also had to change the APIs for them.

> Basically anywhere you see `icon="name-of-the-icon"` replace it with an imported icon.

Modified components are:

- Button
- TextInput
- Snackbar
- Tabs.Tab
- SegmentControl.Option

### Button

```diff
- <Button icon="info" />
+ <Button icon={Info} />
```

### TextInput

```diff

<TextInput
  label="Label"
-  iconRight="info"
-  iconLeft="info"
+  iconRight={Info}
+  iconLeft={Info}
/>
```

### Snackbar

```diff
const snackbar = useSnackbar();

snackbar.show({ 
-  icon: "info",
+  icon: Info
})
```

### Tabs.Tab

```diff
  <Tabs.Tab
    value="payments"
    title="Payments"
    disabled={boolean('Disable Tab 1', false)}
-   icon="info"
+   icon={Info}
  >
```

### SegmentControl.Option

```diff
  <SegmentControl.Option
    value="1"
-   icon="info"
+   icon={Info}
    disabled={boolean('Disabled', false)}
    subText={text('Sub Text', undefined)}
  >
    Option 1
  </SegmentControl.Option>
```
 

