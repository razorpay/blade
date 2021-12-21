- [From version 1.4.x to 2.x.x](#from-version-14x-to-2xx)



# From version 1.4.x to 2.x.x

## Migration guide for new blade-old icons

### Migrating icons to new API


```diff
- import Icon from "@razorpay/blade-old";
+ import { AlertCircle } from "@razorpay/blade-old/icons";

- <Icon name="alert-circle" fill="shade.950" size="medium" />
+ <AlertCircle fill="shade.950" size="medium" />
```

To make this process easier I would suggest you use vscode search panel to search all the instances of `name="` which will show you all the places you used icons, and replace them with their respective icon.


## Changes in \<Icon />

Icon component is now a generic wrapper to create new icons. 
To add new icons to blade's icon library you can use the <Icon /> component like so: 

```jsx
// User defined custom icons
export const MyCustomIcon = (props) => {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="" />
    </Icon>
  );
};

// usage
<Button icon={MyCustomIcon}>
```

## Migrating existing blade-old components

Few of the internal components were using the old \<Icon /> component, thus we also had to change the APIs for them.

```sh
# migrate-icons [directory_path_glob] [...jscodeshift_options]
migrate-icons src/App/** parser=jsx
```

### Automigration

We've written a codemod to automate the process of replacing the `icon` prop with imported icons. 

Simply install the blade-old package and run

```sh
// migrate-icons [directory_path_glob] [...jscodeshift_options]
migrate-icons ./src/App/*
```

This codemod automatically changes 

This
```
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

### Limitations & Edge cases

Conditional rendering isn't supported 
This code will not be transformed.

```ts
<Icon
    name={true ? "emptyCircle" : "alertCircle"}
    fill="bg.950"
    size="large"
/>
```

Icon props on other components aren't handled. 

```tsx
<Button  icon="chevronLeft">

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

snackbar.show({ 
  icon: "info",
})
```
-------

### Manual Migration

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
 

