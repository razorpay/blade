# @razorpay/blade-old

## 2.3.3

### Patch Changes

- 576793f: fix(checkbox): remove unnecessary warning for checkbox props

## 2.3.2

### Patch Changes

- 3fb6d3c: chore(modal): add testID to modal

## 2.3.1

### Patch Changes

- 0361106: `onKeyPress` and `textAlign` props addition in `TextInput`. `textAlign` can take values `left`, `right`, and `center`. `onKeyPress` will take native event as argument. These props are optional

## 2.3.0

### Minor Changes

- f120e3c: feat(icons): add four new icons for scalability ftux

### Patch Changes

- e56b5cf: minor: add outlined & filled icons for home, grid and transactions
- 33e3930: feat(blade): add listener for toggling breakpoints

  **Updates**

  - Add `breakpoints` token to the themes.
  - Out of the box responsiveness support for typography tokens.
  - Publish `useBreakpoint` hook.
  - Following breakpoints are supported as of today.
    ```
    /** max width: 320px  */
    xs: 320;
    /** min width: 321px and max width: 480px */
    s: 480;
    /** min width: 481px and max width: 768px */
    m: 768;
    /** min width: 769 and max width: 1024px */
    l: 1024;
    /** min width: 1025 and max width: 1200px */
    xl: 1200;
    /** min width: 1201px  */
    max: 1201;
    ```
  - For web the typography scale will toggle between mobile and desktop
    - `xs, s, m` are considered as mobile
    - `l, xl, xl` are considered as desktop
  - For react native we always default to mobile typography scale

  **What does it mean for me(as a developer)?**

  - If you’re already using Blade tokens then you can leverage this by just running `yarn upgrade @razorpay/blade@0.1.6` and that’s it you are set 🚀
    - You can use the typography tokens as you were doing previously. Refer the [usage guideline here](https://61c19ee8d3d282003ac1d81c-jukcfyruls.chromatic.com/?path=/story/guides-usage--page&globals=measureEnabled:false#tokens)
  - You can use these `breakpoints` as a base reference to build your next set of features by just following the [usage guidelines here](https://61c19ee8d3d282003ac1d81c-jukcfyruls.chromatic.com/?path=/story/tokens-breakpoints--page&globals=measureEnabled:false).

  This is our first step towards building responsive and adaptive applications. We’ll be publishing Typography Components next which will be built on top of these tokens and you can use them directly for your projects. Meanwhile, [read more about our responsive and adaptive strategy in this RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-02-11-responsive-and-adaptive-layout-strategy.md)

## 2.2.0

### Minor Changes

- 802f31d: feat(hyperlink-icon): add hyperlink icon

## 2.1.0

### Minor Changes

- 13e3c3f: feat(Modal): Migrate react-native-modal to 13.0.0

## 2.0.2

### Patch Changes

- 6674559: fix: icon migrate script dangling imports

## 2.0.1

### Patch Changes

- 842e57a: fix(blade-old): include scripts while publishing

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
