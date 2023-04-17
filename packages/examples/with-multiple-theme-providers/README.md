# Blade with `styled-components`

When using Blade along with multiple theme providers (for example with `blade-old` or your own custom theming) you should namespace your own theme so it doesn't conflict with blade's theme tokens.

Check [`App.tsx`](./src/App.tsx) for example.

## Background

When a `ThemeProvider` is nested inside another `ThemeProvider`, `styled-components` by default merges the passed theme objects (this is a shallow merge by default).

```tsx
/**
 * bladeTheme
 * {
 *  ...
 *  colors { // 👈 Blade components need this token
 *      ...
 *  }
 *  ...
 * }
 *
 */

const myCustomTheme = {
  // 👇 Oops, this will override the colors key above
  colors: {
    primary: 'hotpink',
  },
};

const App = () => {
  // ...
  return (
    <BladeProvider themeTokens={bladeTheme}>
      {/* The theme provider below will merge and replace any top level keys from `bladeTheme` above */}
      <ThemeProvider theme={myCustomTheme}>
        <Button>Hello</Button>
      </ThemeProvider>
    </BladeProvider>
  );
};
```

There are some open issues and references on `styled-components` repo. Eg:

- [Recommendation for libraries](https://github.com/styled-components/styled-components-experimentation/blob/master/component-libraries/shared-component-libraries.md)
- https://github.com/styled-components/styled-components/issues/244
- https://github.com/styled-components/styled-components/issues/2417

At the moment, best solution is to namespace your custom theme tokens so it doesn't conflict with Blade's.

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
