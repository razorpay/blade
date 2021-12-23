# @razorpay/blade-old

## 2.0.0

### Major Changes

- 617066a: feat(blade-old): improved icon API

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

## 1.4.0

### Minor Changes

- 47db09d: fix(blade-old): updated support of react-nataive-modalize for RN v0.65

## 1.3.0

### Minor Changes

- 83b0aa5: Added new icon of Payout Link

### Patch Changes

- d185650: added CloseCircle new icon and added white background for checkedCircle

## 1.2.0

### Minor Changes

- a2010f1: added weight support in Link native component

## 1.1.1

### Patch Changes

- 38ff5a9: feat(icons): Add UserCheck and UserClose icons

## 1.1.0

### Minor Changes

- 2c71c63: Added two new icons - `users` & `rotateClockwise`

## 1.0.0

### Major Changes

- c212fa0: Allow textinput right icon to be touchable

## 0.0.6

### Patch Changes

- 3de1543: Allow Badge's variant prop to take non-semantic colors as well

## 0.0.5

### Patch Changes

- 63aff19: style(theme): Change variant for BottomSheet and Modal background

## 0.0.4

### Patch Changes

- a746f68: feat(blade-old): add wallet icon
- 8dce874: chore(Overlay Colors): Update Modal and BottomSheet Overlay, Dragbar colors

## 0.0.3

### Patch Changes

- 3efc165: Fix Amount molecule's lineHeight when size='xsmall'

## 0.0.2

### Patch Changes

- d9083b7: added refresh icon

## 0.0.2

### Patch Changes

- 43505b3: ci(workflow): release old-blade
