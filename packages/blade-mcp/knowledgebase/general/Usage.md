import { Meta } from '@storybook/addon-docs';
import figmaComponent from '../images/figma-component.png';
import figmaToken from '../images/figma-token.png';

<Meta title="Guides/How to use?" />

# 👀 How to use blade?

<br />
<br />

> Before starting to use Blade make sure you have followed the [installation guide](?path=/docs/guides-how-to-use--docs) and installed all the dependencies like `styled-components`, `fonts` etc.

<br />

## Wrap your App with `BladeProvider`

Make sure if `BladeProvider` is not already present in your app, add it to your app entry point.

In some cases, if section of the page is using dark theme while rest of the page is using light theme, you can wrap the section in `BladeProvider` with `colorScheme` set to `dark`. Although avoid unnecessary usage of BladeProvider when its not needed.

```jsx
// index.js
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import App from from './App';

function AppWrapper(): JSX.Element {
  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="light">
      <App />
    </BladeProvider>
  );
}

export default AppWrapper;
```

## Mapping Components from Figma to Blade in your code

Blade is built with **"What you see in Figma is what you get on Code" ** philosophy.

Whenever you get a UI mockup handed over by your designer select the component you want to build. for eg: let's say I want to implement the Export button component from the below mockup.

<img src={figmaComponent} alt="Figma mockup showing how to pick component and it's properties" />

So to know the blade component's name and properties

1. Select the component on Figma
2. Click on the `locator` icon that will take you to component's properties
3. Look at the component properties and copy it in code because the same properties exists on the components shipped.

```jsx
// in your file where you want to implement this
import { Button, DownloadIcon } from '@razorpay/blade/components';

<Button variant="secondary" size="medium" icon={DownloadIcon} iconPosition="left">
  Export
</Button>;
```

## Mapping Tokens from Figma to Blade in your code

> Tokens are an integral part of design system and are used to store design decisions behind a token(variable) name. That also make things easier to update without you making any change. For this reason **never hardcode** token values in your code but rather use the token name.

Everything that you see on Figma built using Blade you'll always find that in code as well.

Let's see how you can spot a token name from figma and write it in your code

<img src={figmaToken} alt="Figma mockup showing how to pick token" />

Whenever you get a UI mockup handed over by your designer

1. Select the component whose color token you want to use in code up
2. Click on the inspect panel on the left and click on the token name `surface.background.gray.moderate` to copy it and paste it into your code.
   > Remember, don't select the hardcoded `hsla` color value.

```jsx
const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
    width: 368px;
    background-color: ${theme.colors.surface.background.gray.moderate};
`,
);
```
