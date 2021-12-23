---
"@razorpay/blade-old": major
---

feat(blade-old): improved icon API

As discussed in [#363](https://github.com/razorpay/blade/issues/363) we had decided to move to a more flexible and open API for the icons,
Instead of using a single Icon component and passing the name="" prop we will be directly using the icon by importing it.

### Changes in \<Icon />

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

### Migrating existing blade-old components

[Follow these steps for migration](./MIGRATION.md)
