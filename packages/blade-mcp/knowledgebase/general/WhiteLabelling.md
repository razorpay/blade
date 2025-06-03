# White Labelling - createTheme

You may want to use Blade with brands other than Razorpay.

To make this possible, Blade allows you to customize the theme of the components to match your brand with the `createTheme` function.

## API Reference

### `createTheme()`:

> Returns a `ThemeTokens` object that can be passed to `themeTokens` prop of `BladeProvider` to customize the branding of all components.

`createTheme()` accepts an object with the following keys:

#### `brandColor`:

- This is the primary color of your brand.
- `createTheme` will generate a color palatte using this brand color which will then be used across Blade components to match your brand.
- You can pass any valid CSS color value (rgb, hex or hsl) format to this key.

## Usage

```tsx
import { createTheme } from '@razorpay/blade/tokens';

const { theme: customThemeTokens } = createTheme({
  brandColor: '#83003D', // 'rgba(131, 0, 61)', 'hsl(332, 100%, 26%)' are also valid values
});

const Wrapper = () => {
  return (
    <BladeProvider themeTokens={customThemeTokens}>
      <App />
    </BladeProvider>
  );
};
```

### Light & Dark theme support

Custom branded themes also contain support for light and dark color schemes. You can pass the `colorScheme` prop to `BladeProvider` to switch between light and dark color schemes.

```tsx
// or colorScheme="light"
<BladeProvider themeTokens={customThemeTokens} colorScheme="dark">
  <App />
</BladeProvider>
```
