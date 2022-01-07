# @razorpay/blade

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
