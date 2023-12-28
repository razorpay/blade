# Migration Guide for v11 (Brand Refresh)

## Migration with Codemod

**Step1:** Install this version of `@razorpay/blade`.

**Step2:** Execute the codemod using the following command:

> Need help? Check out [jscodeshift docs](https://github.com/facebook/jscodeshift) for CLI usage tips.

```sh
npx jscodeshift ./YOUR_DIR --extensions=tsx,ts,jsx,js -t ./node_modules/@razorpay/blade/codemods/brand-refresh/transformers/index.ts --ignore-pattern="**/node_modules/**"
```

> [!WARNING]
>
> While this codemod covers most cases, it's always good to double-check and test your code to catch any missed nuances.

### 🚧 Watch Out for Limitations & Edge Cases

> [!IMPORTANT]
>
> There might be some situations where the codemod falls short. If you encounter errors, handle those cases manually for a seamless transition. Happy coding!

#### Typography

1. The codemod doesn't handle the migration of conditionally rendered props. Take a moment to manually inspect and update such cases.

   ```diff
   - <Title size={isMobile ? "small" : "medium"}> Hello </Title>
   + <Heading size={isMobile ? "large" : "xlarge"}> Hello </Heading>
   ```

## Manual Migration Guide

### Theme Tokens

- `paymentTheme` & `bankingTheme` have been removed. Use `bladeTheme` instead.

  ```diff
    import { BladeProvider } from '@razorpay/blade/components';
  - import { paymentTheme, bankingTheme } from "@razorpay/blade/tokens";
  + import { bladeTheme } from "@razorpay/blade/tokens";

    const AppWrapper = () => {
      return (
  -     <BladeProvider themeTokens={paymentTheme|bankingTheme} colorScheme="light">
  +     <BladeProvider themeTokens={bladeTheme} colorScheme="light">
          <App />
        </BladeProvider>
      );
    }

    export default AppWrapper;
  ```

- **The `color` tokens have been updated to a new scale. You may need to update your custom component styles to match the new scale:**

  - [color scale](https://www.figma.com/file/5BZsOpNjbUHqgVh850yPBW/%5BResearch%5D-Typography-%26-Spacing-Refresh?type=design&node-id=244%3A188858&mode=design&t=vpFlyrSzO1jdpAPu-1)

- **The `font-size` and `line-height` tokens have been updated to a new scale. You may need to update your custom component styles to match the new scale:**
  - [font-size scale](https://www.figma.com/file/5BZsOpNjbUHqgVh850yPBW/%5BResearch%5D-Typography-%26-Spacing-Refresh?type=design&node-id=244%3A188858&mode=design&t=vpFlyrSzO1jdpAPu-1)
  - [line-height scale](https://www.figma.com/file/5BZsOpNjbUHqgVh850yPBW/%5BResearch%5D-Typography-%26-Spacing-Refresh?type=design&node-id=244%3A188858&mode=design&t=vpFlyrSzO1jdpAPu-1)

### Amount

- **The accepted values for the `size` prop has been updated.**

  ```diff
  - <Amount size="body-small" value={123456.789} />
  + <Amount value={123456.789} type="body" size="small" />

  - <Amount size="body-small-bold" value={123456.789} />
  + <Amount value={123456.789} type="body" size="small" weight="semibold" />

  - <Amount size="body-medium" value={123456.789} />
  + <Amount value={123456.789} type="body" size="medium" />

  - <Amount size="body-medium-bold" value={123456.789} />
  + <Amount value={123456.789} type="body" size="medium" weight="semibold" />

  - <Amount size="heading-small" value={123456.789} />
  + <Amount value={123456.789} type="body" size="large" />

  - <Amount size="heading-small-bold" value={123456.789} />
  + <Amount value={123456.789} type="body" size="large" weight="semibold" />

  - <Amount size="heading-large" value={123456.789} />
  + <Amount value={123456.789} type="heading" size="medium" />

  - <Amount size="heading-large-bold" value={123456.789} />
  + <Amount value={123456.789} type="heading" size="medium" weight="semibold" />

  - <Amount size="title-small" value={123456.789} />
  + <Amount value={123456.789} type="heading" size="large" />

  - <Amount size="title-medium" value={123456.789} />
  + <Amount value={123456.789} type="heading" size="xlarge" />
  ```

### Typography Components

- **The `Title` component has been removed in favor of the `Heading` component.**

  ```diff
  - <Title size="xlarge"> Hello </Title>
  + <Heading size="2xlarge"> Hello </Heading>

  - <Title size="large"> Hello </Title>
  + <Heading size="xlarge"> Hello </Heading>

  - <Title size="medium"> Hello </Title>
  + <Heading size="xlarge"> Hello </Heading>

  - <Title size="small"> Hello </Title>
  + <Heading size="large"> Hello </Heading>
  ```

- **The `type` prop has been removed from the `Text`, `Heading`, & `Display` components in favor of the `color` prop.**

  ```diff
  - <Text type="normal"> Hello </Text>
  + <Text color="surface.text.gray.normal"> Hello </Text>

  - <Text type="subtle"> Hello </Text>
  + <Text color="surface.text.gray.subtle"> Hello </Text>

  - <Text type="muted"> Hello </Text>
  + <Text color="surface.text.gray.muted"> Hello </Text>

  - <Text type="subdued"> Hello </Text>
  + <Text color="surface.text.gray.muted"> Hello </Text>

  - <Text type="placeholder"> Hello </Text>
  + <Text color="surface.text.gray.disabled"> Hello </Text>
  ```

- **The `contrast` prop has been removed from the `Text`, `Heading`, & `Display` components.**

  ```diff
  - <Text contrast="low"> Hello </Text>
  + <Text> Hello </Text>

  // contrast="high" doesn't exist anymore, so you will need to manually update these cases a new color token that matches the contrast you need.
  - <Text contrast="high"> Hello </Text>
  + <Text> Hello </Text>
  ```

- **The `variant` prop has been removed from the `Heading` component.**

  ```diff
  - <Heading variant="regular"> Hello </Heading>
  + <Heading> Hello </Heading>

  - <Heading variant="subheading"> Hello </Heading>
  + <Text size="small"> Hello </Text>
  ```

- **The `size` prop scale has been updated in the `Heading` component**

  ```diff
  - <Heading size="large"> Hello </Heading>
  + <Heading size="medium"> Hello </Heading>

  - <Heading size="medium"> Hello </Heading>
  + <Heading size="small"> Hello </Heading>

  - <Heading size="small"> Hello </Heading>
  + <Text size="large"> Hello </Text>
  ```

- **The `weight` prop now accepts `"semibold"` instead of `"bold"` in the ` Text`, `Heading` , & `Display` components. The `Code` component continues to accept `"bold"`.**

  ```diff
  - <Text weight="bold"> Hello </Text>
  + <Text weight="semibold"> Hello </Text>

  - <Heading weight="bold"> Hello </Heading>
  + <Heading weight="semibold"> Hello </Heading>

  - <Display weight="bold"> Hello </Display>
  + <Display weight="semibold"> Hello </Display>
  ```

### Badge

- **The `fontWeight` prop has been removed.**

  ```diff
  - <Badge fontWeight="regular|bold"> Hello </Badge>
  + <Badge> Hello </Badge>
  ```

- **The `contrast` prop has been removed in favor of the new `emphasis` prop.**

  ```diff
  - <Badge contrast="low"> Hello </Badge>
  + <Badge emphasis=”subtle”> Hello </Badge>

  - <Badge contrast="high"> Hello </Badge>
  + <Badge emphasis="intense"> Hello </Badge>
  ```

- **The `variant` prop has been removed in favor of the `color` prop.**

  ```diff
  - <Badge variant="blue"> Hello </Badge>
  + <Badge color="primary"> Hello </Badge>

  - <Badge variant="positive|negative|information|notice|neutral"> Hello </Badge>
  + <Badge color="positive|negative|information|notice|neutral"> Hello </Badge>
  ```

- **The `"default"` value for the `color` prop has been removed in favor of the new `"primary"` value.**

  ```diff
  - <Badge color="default"> Hello </Badge>
  + <Badge color="primary"> Hello </Badge>
  ```

### Button & Link

- **The `"default"` value for the `color` prop has been removed in favor of the new `"primary"` value.**

  ```diff
  - <Button color="default"> Hello </Button>
  + <Button color="primary"> Hello </Button>

  - <Link color="default" href="https://razorpay.com/"> Hello </Link>
  + <Link color="primary" href="https://razorpay.com/"> Hello </Link>
  ```

### Card

- **The `surfaceLevel` prop has been removed in favor of the new `backgroundColor` prop.**

  ```diff
  - <Card surfaceLevel={2}> Hello </Card>
  + <Card backgroundColor="surface.background.gray.intense"> Hello </Card>

  - <Card surfaceLevel={3}> Hello </Card>
  + <Card backgroundColor="surface.background.gray.moderate"> Hello </Card>
  ```

### Counter

- **The `contrast` prop has been removed in favor of the new `emphasis` prop.**

  ```diff
  - <Counter contrast="low"> Hello </Counter>
  + <Counter emphasis=”subtle”> Hello </Counter>

  - <Counter contrast="high"> Hello </Counter>
  + <Counter emphasis="intense"> Hello </Counter>
  ```

- **The `variant` prop has been removed in favor of the `color` prop.**

  ```diff
  - <Counter variant="blue"> Hello </Counter>
  + <Counter color="primary"> Hello </Counter>

  - <Counter variant="positive|negative|information|notice|neutral"> Hello </Counter>
  + <Counter color="positive|negative|information|notice|neutral"> Hello </Counter>
  ```

- **The `intent` prop has been removed in favor of the `color` prop.**

  ```diff
  - <Counter intent="positive|negative|information|notice|neutral"> Hello </Counter>
  + <Counter color="positive|negative|information|notice|neutral"> Hello </Counter>
  ```

- **The `"default"` value for the `color` prop has been removed in favor of the new `"primary"` value.**

  ```diff
  - <Counter color="default"> Hello </Counter>
  + <Counter color="primary"> Hello </Counter>
  ```

### Divider

- **The `"normal"` value for the `variant` prop has been updated with new styles, if you need the old styles, use the `"muted"` value.**

  ```diff
  - <Divider variant="normal"> Hello </Divider>
  + <Divider variant="muted"> Hello </Divider>
  ```

### Indicator

- **The `intent` prop has been removed in favor of the `color` prop.**

  ```diff
  - <Indicator intent="positive|negative|information|notice|neutral" />
  + <Indicator color="positive|negative|information|notice|neutral" />

  - <Indicator intent="positive|negative|information|notice|neutral"> Hello </Indicator>
  + <Indicator color="positive|negative|information|notice|neutral"> Hello </Indicator>
  ```

### IconButton

- **The `contrast` prop has been removed in favor of the new `emphasis` prop.**

  ```diff
  - <IconButton contrast="low"> Hello </IconButton>
  + <IconButton emphasis="intense"> Hello </IconButton>

  - <IconButton contrast="high"> Hello </IconButton>
  + <IconButton emphasis="subtle"> Hello </IconButton>
  ```

### ProgressBar

- **The `contrast` prop has been removed without replacement.**

  ```diff
  - <ProgressBar contrast="low" value={20} />
  + <ProgressBar value={20} />
  ```

- **The `intent` prop has been removed in favor of the `color` prop.**

  ```diff
  - <ProgressBar intent="positive|negative|information|notice|neutral" value={20} />
  + <ProgressBar color="positive|negative|information|notice|neutral" value={20} />
  ```
