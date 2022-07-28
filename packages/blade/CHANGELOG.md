# @razorpay/blade

## 0.12.0

### Minor Changes

- 381e9c7: fix(Blade): add `size` prop to Text component and update tokens

  This PR updates the typography tokens scale for mobile devices to create better visual hierarchy which we received as feedback from other teams as well.

  It also adds a new `size` prop to `Text` component for `variant='body'`

## 0.11.4

### Patch Changes

- 66f9b24: feat(tokens): add new tokens

## 0.11.3

### Patch Changes

- e0a2631: feat: add Download, Edit, History, Plus, Pause, & Trash icons

## 0.11.2

### Patch Changes

- b2b86b4: fix: SkipNav export

## 0.11.1

### Patch Changes

- 873676f: fix: button export to components

## 0.11.0

### Minor Changes

- 5d022f4: feat: add `Button` component

### Patch Changes

- cddd298: chore: update currency icons

## 0.10.1

### Patch Changes

- 7b9baf7: fix(blade): broken gray color types in theme.d.ts file

## 0.10.0

### Minor Changes

- a800a96: feat(blade): added makeAccessible function

  makeAccessible function is a compatibility layer between web & native for accessibility props
  More [info in RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-04-09-accessibility.md#platform-specific-implementation--5)

### Patch Changes

- a800a96: fix(blade): added aria hidden in icons

## 0.9.0

### Minor Changes

- 0c3a951: feat(blade): Added SkipNav component

  Learn more about [Skip Navigations in Accessibility RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-04-09-accessibility.md#skip-navigations)

- 5c750bb: feat(blade): add VisuallyHidden component

  This component is used specifically when you want to hide certain things visually for people who are not visually impaired but also want to make your content is accessible to visually impaired people via assistive technologies.

  You can play around with it on [Storybook](https://master--61c19ee8d3d282003ac1d81c.chromatic.com/?path=/docs/components-accessibility-visuallyhidden--visually-hidden)

## 0.8.0

### Minor Changes

- 002fce2: fix: icon colors & remove `surface.action.icon.link.*` colors from `theme`

  ## Breaking Changes

  - Remove the following tokens from `paymentTheme` & `bankingTheme` theme of Blade:

    - `colors.surface.action.icon.link.default.lowContrast`
    - `colors.surface.action.icon.link.default.highContrast`
    - `colors.surface.action.icon.link.hover.lowContrast`
    - `colors.surface.action.icon.link.hover.highContrast`
    - `colors.surface.action.icon.link.focus.lowContrast`
    - `colors.surface.action.icon.link.focus.highContrast`
    - `colors.surface.action.icon.link.active.lowContrast`
    - `colors.surface.action.icon.link.active.highContrast`
    - `colors.surface.action.icon.link.disabled.lowContrast`
    - `colors.surface.action.icon.link.disabled.highContrast`

    If you are using any of these tokens, they will no longer be available in your `theme`. Make sure you remove usage of these tokens from your codebase.

  ## Fixes

  1. Fix incorrect Icon colors that were supported & suggested by TypeScript

## 0.7.2

### Patch Changes

- 9f0bb83: feat: add Dollar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, EyeOff, Close icons

## 0.7.1

### Patch Changes

- 25a7b89: fix(blade): add contrast prop to Typography components

  Add `contrast` prop to all the Typography components so that consumers can change the intent to grab the attention towards the text. The possible values for `contrast` are `high` or `low` and accordingly the color token will be used to set the color of the Typography components

## 0.7.0

### Minor Changes

- 52efedb: fix(blade): set defaults for all typography components

  Make all the props optional to have a better DX and add default values for all the important props

## 0.6.0

### Minor Changes

- e352eef: fix(blade): add `Heading` component

## 0.5.0

### Minor Changes

- 75882a7: feat(Blade): add `Title`component

  The API for `Title` component can be found under [Typography/Text/\_decisions](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Typography/_decisions/decisions.md)

## 0.4.0

### Minor Changes

- 294173e: - Add the following components that would act as building blocks for our icons:
  1. `Svg`
  2. `Path`
  3. `Rect`
  4. `Defs`
  5. `ClipPath`
  6. `G`
  - Add `CreditCardIcon` component
  - Add `RupeeIcon` component

### Patch Changes

- e76cd01: feat/add-text-component

## 0.3.0

### Minor Changes

- a20b608: feat(blade): add motion tokens

  ### Motion tokens

  We have added tokens for

  1. Delay
  2. Duration
  3. Easing

  You can find a detailed RFC for motion here: [View Formatted RFC](https://github.com/razorpay/blade/blob/rfc/2022-03-22-motion-rfc/rfcs/2022-03-22-motion-rfc.md)

## 0.2.0

### Minor Changes

- 6885ac3: feat(blade): add BaseText component

## 0.1.6

### Patch Changes

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

## 0.1.5

### Patch Changes

- 04677a3: fix(blade): add lineheight tokens

## 0.1.4

### Patch Changes

- f992f77: fix(blade): typo in exports field

## 0.1.3

### Patch Changes

- d32dd9d: fix(blade): add overlay color token

## 0.1.2

### Patch Changes

- 8cddfad: fix(blade): update desktop typography scale

## 0.1.1

### Patch Changes

- 6c69a4d: fix(blade): update imports and exports

## 0.1.0

### Minor Changes

- de4124f: ### ⚠️ **Breaking Change** ⚠️
  This PR introduces a major breaking change on how we access tokens.

  ### Why did we want to change the way we access tokens?

  So, previously if you had to start consuming tokens from the new version of Blade you start with importing the theme provider:

  ```jsx
  // App entry point
  import { ThemeProvider } from '@razorpay/blade/components';
  import { paymentTheme } from '@razorpay/blade/tokens';

  function App(): JSX.Element {
    return (
      <React.Fragment>
        <GlobalStyle />
        <ThemeProvider theme={paymentTheme}>
          <Card />
        </ThemeProvider>
      </React.Fragment>
    );
  }

  export default App;
  ```

  And then in one of our components, we'll use the `useTheme()` hook to get the theme and the mode like following 👇

  ```jsx
  const StyledCard = styled.div(
    ({ theme }: { theme: Theme }) => `
    width: 368px;
    background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
    border-radius: ${theme.border.radius.medium}px;
    box-shadow: ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1].onLight}, ${theme.shadows.offsetX.level[1]}px ${theme.shadows.offsetY.level[1]}px ${theme.shadows.blurRadius.level[1]}px ${theme.shadows.color.level[1].onLight};
    padding: ${theme.spacing[5]}px;
    display: flex;
    flex-direction: column;
  `,
  );

  const Card = (): React.ReactElement => {
    const { theme } = useTheme();
    return (
      <React.Fragment>
        <DisplayLarge theme={theme}>Cash Advance </DisplayLarge>
        <StyledCard theme={theme}>
          <AlertInformation theme={theme}>
            The interest charged will be deposited back into your bank account within a day of
            repayment.
          </AlertInformation>
          <Divider theme={theme} />
          <CaptionRegular theme={theme}>
            This amount will be deducted in 3 installments from your settlement balance between Feb
            18-20 on a daily basis.
          </CaptionRegular>
        </StyledCard>
      </React.Fragment>
    );
  };
  ```

  #### Problem with the existing implementation:

  So we pass the raw theme tokens which have everything light mode colors, dark mode colors. Different typography scales for desktop, mobile, etc. But as a consumer look at how do we access the tokens from the above file

  ```jsx

  const { theme } = useTheme();

  background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  font-size: ${theme.typography.desktop.fonts.size[200]}px;
  ```

  - Isn't it weird to explicitly write `onLight`/`onDark` by hand while accessing color tokens?
  - Isn't it weird to explicitly write `desktop` to access the typography scale for desktop?
  - How would you as a developer change things let's say if the user toggles the color mode?
  - How would you as a developer change the typography scale if the user switches from desktop to mobile or vice-versa?

  You can't! Because we have **hardcoded** the object properties and which means we lost the power of dynamically changing these things based on the user's behavior which is incorrect.

  #### What is the root cause of this issue?

  The root cause is the mental model of how we store tokens and how do we consume them. Typically our tokens are nothing but our design decisions. So this means we need to store every decision in our token file, for eg: light mode colors, dark mode colors, typography scale for desktop, typography scale for mobile but when we consume them we want the system to take care of these things and give us single value for the modes and the platform.

  So we want something like this 👇

  ```diff

  const { theme } = useTheme();

  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  -font-size: ${theme.typography.desktop.fonts.size[200]}px;
  +font-size: ${theme.typography.fonts.size[200]}px;
  ```

  Notice the removal of **`onLight`** and **`desktop`** keys from the theme object.

  So we want our system to behave in such a manner that:

  - We input the raw theme(which has color modes and platform types)
  - It will output the flat theme which will have color mode and platform type selected, so we don't have to hardcode `onLight`/`onDark` or `desktop`/`mobile`.

  ### What is the solution?

  The system we spoke about is nothing but our `BladeProvider`(previously known as `ThemeProvider`). It'll accept the raw theme as a prop and then based on the device type and color mode pick those values from `themeTokens` and set it in the context as `theme`. We can then use `useTheme()` hook to get the theme from the context which will be flattened.

  This is how things will look after this change 👇

  ```diff
  // App entry point
  -import { ThemeProvider } from '@razorpay/blade/components';
  +import { BladeProvider } from '@razorpay/blade/components';
  import { paymentTheme } from '@razorpay/blade/tokens';

  function App(): JSX.Element {
    return (
      <React.Fragment>
        <GlobalStyle />
  -      <ThemeProvider theme={paymentTheme}>
  +      <BladeProvider themeTokens={paymentTheme}>
          <Card />
  -      </ThemeProvider>
  +      </BladeProvider>
      </React.Fragment>
    );
  }

  export default App;

  // somewhere in the app
  const { theme } = useTheme();

  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  -font-size: ${theme.typography.desktop.fonts.size[200]}px;
  +font-size: ${theme.typography.fonts.size[200]}px;
  ```

  ### Migration guide for apps using the older version

  1. Rename **ThemeProvider** to **BladeProvider**

  ```diff
  -import { ThemeProvider } from '@razorpay/blade/components';
  +import { BladeProvider } from '@razorpay/blade/components';
  ```

  2. Rename `theme` prop on provider to `themeTokens`

  ```diff
  -<BladeProvider theme={paymentTheme}>
  +<BladeProvider themeTokens={paymentTheme}>
  ```

  3. import `Theme` type to be imported from `@razorpay/blade/components` instead of `@razorpay/blade/tokens`

  ```diff
  -import type { Theme } from '@razorpay/blade/tokens';
  +import type { Theme } from '@razorpay/blade/components';
  ```

  4. Remove all the `onLight`/`onDark` keywords from the theme colors object

  ```diff
  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  ```

  5. Remove all the `desktop`/`mobile` keywords from the theme typography object

  ```diff
  -background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  +background-color: ${theme.colors.surface.background.level2.lowContrast};
  ```

## 0.0.8

### Patch Changes

- 7a09800: fix(blade): add description in token types

## 0.0.7

### Patch Changes

- 1aa2961: fix(blade): export all the types of global tokens for consumers
- d8d8027: fix(blade): typo in color tokens

## 0.0.6

### Patch Changes

- 8374dc1: build(blade): generate root `.d.ts`

## 0.0.5

### Patch Changes

- 057cf66: build(blade): add re-exports to `.ts` instead of `.js`

## 0.0.4

### Patch Changes

- efb59d9: feat(blade): add type generation scripts

## 0.0.3

### Patch Changes

- f0b2b01: fix(blade): typo in exports field

## 0.0.2

### Patch Changes

- 55ac5d3: feat(blade): add rollup to build blade
