# Installation

## Pre-requisite

Before you install the package, make sure that you have performed the following steps:

- You must be running Node version >=14.19.0

### Razorpay Employees have to point @razorpay scope to GitHub Package Registry. Follow the steps below

- Generate a Personal Access Token on GitHub by [visiting this link](https://github.com/settings/tokens/new?scopes=repo,workflow,write:packages,read:repo_hook,write:packages) (Enable SSO by clicking `Authorize` button next to Razorpay logo.)
- Run `code ~/.bashrc` or `code ~/.zshrc` in your editor and add this line:

  ```bash
  export GITHUB_ACCESS_TOKEN="<YOUR_TOKEN>"
  ```

  > **Note**: Replace `<YOUR_TOKEN>` with your actual GitHub Personal Access Token.

- Run `source ~/.bashrc` or `source ~/.zshrc` based on the file you added your token.
- Run `code ~/.npmrc` and append the following:

  ```bash
  # add following to your .npmrc
  @razorpay:registry=https://npm.pkg.github.com/
  //npm.pkg.github.com/:always-auth=true
  //npm.pkg.github.com/:_authToken=${GITHUB_ACCESS_TOKEN}
  ```

Follow these 3 steps to get started!

## 1. Basic Setup

### Add blade to your application

1. Install `@razorpay/blade` as a dependency.

   Blade has a few peer dependencies that you may already have installed in your project. If so, you can skip adding them again.

   ```shell
   yarn add @razorpay/blade styled-components@5.3.11 @razorpay/i18nify-js @razorpay/i18nify-react
   ```

   - [styled-components@5](https://www.npmjs.com/package/styled-components/v/5.3.11): Currently blade only supports version 5.
   - [@razorpay/i18nify-js](https://www.npmjs.com/package/@razorpay/i18nify-js): i18n library that blade depends on. Follow their installation guide for more info.
   - [@razorpay/i18nify-react](https://www.npmjs.com/package/@razorpay/i18nify-react): A state management React wrapper for `@razorpay/i18nify-js` that maintains the locale state of your page.

2. Add ReactNative Dependencies [Optional for web projects]

   ```shell
   yarn add @floating-ui/react-native@0.10.0 react-native-reanimated@3.4.1 react-native-tab-view@3.5.2 react-native-pager-view@6.2.1 react-native-svg@12.3.0 react-native-gesture-handler@2.9.0 @gorhom/bottom-sheet@4.4.6 @gorhom/portal@1.0.1
   ```

   - `react-native-reanimated`: Follow [this guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) to install it on Android & iOS, which is required by Blade.
   - `react-native-svg`: Follow [this guide](https://github.com/react-native-svg/react-native-svg#with-react-native-cli) to install it on Android & iOS, which is required by Blade.
   - `react-native-gesture-handler`: Follow [this guide](https://docs.swmansion.com/react-native-gesture-handler/docs/installation) to install it. Note that you don't need to add `<GestureHandlerRootView style={{ flex: 1 }}>` again at the root because BladeProvider already adds that out of the box.
   - `@gorhom/bottom-sheet`: Add this as a peer dependency; no need to do additional setup since BladeProvider already sets everything up.
   - `@gorhom/portal`: Add this as a peer dependency; no need to do additional setup since BladeProvider already sets everything up.
   - `@floating-ui/react-native`: Add this as a peer dependency; no need to do additional setup.
   - `react-native-tab-view`: Add this as a peer dependency; no need to do additional setup. This is needed for the react-native Tabs component as per [this guide](https://reactnavigation.org/docs/tab-view/#installation).
   - `react-native-pager-view`: Add this as a peer dependency; no need to do additional setup. This is needed for the react-native Tabs component as per [this guide](https://reactnavigation.org/docs/tab-view/#installation).

   Finally, run the `pod install` command so that Blade's RN dependencies are linked to your project:

   ```shell
   cd ios && pod install
   ```

## 2. Install Fonts

### Web

We use 2 fonts: [TASA Orbiter](https://tasatype.localremote.co/) (for our headings) and [Inter](https://rsms.me/inter/) (for other text elements).

- To add these fonts to your project, import them from the blade package in your root entry file.

  ```ts
  // Somewhere in root index.ts or entryBrowser.tsx file
  import '@razorpay/blade/fonts.css';
  ```

- While Blade handles the `font-family` for its components, you can set the `font-family` globally in your project's global styles for any custom components or exceptions.

  ```ts
  import { createGlobalStyle } from 'styled-components';

  const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.typography.fonts.family.text}
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${(props) => props.theme.typography.fonts.family.heading};
  }
  `;
  ```

#### No Bundler Setups or No Code Tools

If your project uses a no-bundler setup or is a no-code tool, you can install fonts with the `unpkg` link:

```html
<link rel="stylesheet" href="https://unpkg.com/@razorpay/blade@<blade-version>/fonts.css" />
<!--
  Replace <blade-version> in the URL with the version of Blade you're using
  E.g. https://unpkg.com/@razorpay/blade@11.3.1/fonts.css
-->
```

### React Native

- Download fonts from [blade-fonts-react-native.zip](https://github.com/razorpay/blade/tree/master/packages/blade/fonts/blade-fonts-react-native.zip) and unzip.

#### For iOS

- Copy all font files from the `ios-fonts` directory to `<project_root>/public/fonts` (**create the directory if it doesn't exist**)
- Create a React Native config file at the root of your project - `<project_root>/react-native.config.js` and add the following content to it:

  ```js
  module.exports = {
    // ... rest of the config
    assets: ['./public/fonts/'],
  };
  ```

- Run the following command to link fonts in iOS:

  ```shell
  npx react-native-asset -ios-a
  ```

#### For Android

- Copy all files from `android-fonts` to `/android/app/src/main/res/font`
- Navigate to `/android/app/src/main/java/com/<your_package_name>/MainApplication.java` and add the following contents to it:

  ```js
  // add the below import statement after all the import statements
  import com.facebook.react.views.text.ReactFontManager;
  ```

- Now search for the `onCreate` method and add the following line to it:

  ```js
  public void onCreate() {
    // add the below lines as the first lines
    ReactFontManager.getInstance().addCustomFont(this, "Inter", R.font.inter);
    ReactFontManager.getInstance().addCustomFont(this, "TASA Orbiter Display", R.font.tasa);
    // rest of the content of the method
  }
  ```

## 3. TypeScript Setup

### Web

If you're using TypeScript in your project, first make sure you have `@types/styled-components` installed.

```shell
yarn add -D @types/styled-components
```

Now, you can extend the theme interface to include your custom theme properties to `styled-components`.

```ts
// file: index.d.ts
import { Theme } from '@razorpay/blade/components';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
```

### React Native

To get ReactNative-specific type hints for the blade components, you can switch the `moduleSuffixes` in your `tsconfig.json` to include `.native` files.

```json
{
  "compilerOptions": {
    "moduleSuffixes": [".native", ""]
  }
}
```