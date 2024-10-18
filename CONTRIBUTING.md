# Contributing guidelines for `blade`

## Local Development Setup

These steps should get you up and started for local development setup. Please ensure you've NodeJS and Yarn installed on your machine before proceeding.

### Prerequisites

- `cd` into `packages/blade`

- Install dependencies:

  ```sh
  yarn
  ```

### Setting up web

- Run storybook for web:

  ```sh
  yarn start:web
  ```

- That's it! You can access storybook on http://localhost:9009

### Setting up React Native

If you're contributing to React Native parts, you can follow the following setup.

You can skip it if you're contributing to web only component. Our [Component Status Page in Documentation](https://blade.razorpay.com/?path=/docs/guides-component-status--docs) mentions which components are react native supported and which are web only

<details>
<summary><h4>React Native Local Development Setup</h4></summary>

### Setting up iOS

- Get a tea, coffee or your favorite drink, you'll need it 😸

- Install [`brew`](https://brew.sh/) if you don't have it installed

- Install watchman:

  ```sh
  brew install watchman
  ```

- Install [Xcode](https://reactnative.dev/docs/environment-setup#xcode).

  > [!Note]
  >
  > Sometimes it can take a very long time for Xcode to install. Check [here](https://apple.stackexchange.com/questions/427640/mac-app-store-xcode-download-stuck-at-installing) for troubleshooting.

- Install an iOS 13 simulator in Xcode: Xcode > Preferences > Platforms.

  > [!Note]
  >
  > Sometimes this can get stuck or take a very long time. Check [here](https://stackoverflow.com/questions/29058229/download-xcode-simulator-directly) for troubleshooting.

- Install cocoapods:

  ```sh
  sudo gem install cocoapods
  ```

- Install pods. This can be done by running `pod install` in the `ios/` directory for Intel machine. For M1, things might not work out of box.

  > [!Note]
  >
  > Follow the note [here](https://reactnative.dev/docs/environment-setup#cocoapods) if you're using M1

- `cd` back to `packages/blade`. Start storybook dev-server for ios:

  ```sh
  yarn start:ios
  ```

  > **Tip:**
  >
  > You don't need to build the app everytime (only when you're changing native dependencies), once the app is built you can just start the storybook server and open the app directly on your simulator

- If the stars aligned correctly, the storybook app should get installed and up and running on the simulator. If not, please refer to the official [guide](https://reactnative.dev/docs/environment-setup) for any deviations.

_The storybook can take some time to open after simulator starts. Don't worry, it will start after few minutes (hopefully 🤞)._

### Setting up Android

- Of course you'll need a fresh cup of tea, coffee or your favorite drink 😸

- Follow the official [guide](https://reactnative.dev/docs/environment-setup). Some of the initial steps needed are the same for iOS. Please note the following tips and deviations:

  - Use the Android 12 SDK, when you follow the official guide, the default selected SDK is not Android 12
  - When you setup the emulator from Android Studio, create a fresh one (delete the one that is created by default). The default one comes with low storage and memory so you'll likely run into `INSTALL_FAILED_INSUFFICIENT_STORAGE` issue. For RAM and virtual memory heap you may use `2000` and for storage `4000` as values.

  > **Tip**
  >
  > At times, you might run into some weird issues during installation. Sometimes restarting your computer does the trick. You can also `cd` into the `android` directory and run `./gradlew clean` to clean up cache and built files when retrying installation or running the app.

- `cd` back to `packages/blade`. Start the storybook dev-server for android:

  ```sh
  yarn start:android
  ```

  > [!Note]
  >
  > If you already have `yarn start:ios` running, you might have to close it since `yarn start:android` will try to run react-native server on the same port and fail with port taken error.
  >
  > If you want to run both, android and ios at the same time, you can use `yarn start:native` instead.

  > [!Note]
  >
  > Make sure `$ANDROID_SDK_ROOT` is added before running the above command, you can run `echo $ANDROID_SDK_ROOT` in same terminal to confirm. (You can run `source ~/.zshrc` or `source ~/.bash_profile` depending on where you added the variables)

- If the stars aligned correctly, the storybook app should get installed and up and running on the emulator 🎉

> [!TIP]
>
> You can use `yarn start:all` command to run storybooks on all platforms like web, android, and ios (better to not use it in development though to avoid stressing your laptop)

</details>

## Codebase Terminologies and Structure

### Base Component Terminology in Code

We have some base components defined internally such as BaseInput, BaseButton, BaseText which act as a base for multiple exposed components.

E.g.

- Heading, Display, Text all use BaseText internally
- TextInput, PasswordInput, SelectInput all use BaseInput internally
- Majority of our components use BaseBox internally which is a more flexible version of the exposed Box component.

### Cross Platform Guide

You will see files with `.web.tsx` or `.native.tsx` syntax. The `.web.tsx` files end up in web bundle and `.native.tsx` files end up in react native bundle. You can define common logic in normal `.tsx` files which can be imported in both web and native files.

#### Cross Platform TypeScript Guide

[Writing Cross-Platform TypeScript In Blade](./rfcs/writing-cross-platform-typescript.md)

## Testing Changes

### Unit Tests

We have unit tests which you can run by running following commands

```sh
cd packages/blade
yarn test:react # web tests
yarn test:react-native # native tests
```

### Visual Tests

We also have visual tests that run on every PR. So if your PR changes / breaks a certain component, the diff will show up on chromatic checks of PR

<img width="822" alt="image" src="https://github.com/user-attachments/assets/35f6dfd8-ba64-4bc8-a15d-39a3476b6ae8">

### Interaction Tests

We support writing interaction tests using playwright. You can check example interaction tests of toast at [Toast.test.stories.tsx](./packages/blade/src/components/Toast/__tests__/Toast.test.stories.tsx). You can run these tests by visiting the Interaction Tests section in blade documentation E.g. [Toast Stacking Interaction Test on Documentation](https://blade.razorpay.com/?path=/story/components-interaction-tests-toast--toast-stacking)

## Editor Setup

- Make sure you have [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) installed and setup on your VSCode. This will guide you and autofix errors to keep the code consistent with this project's guidelines
- Make sure you have [VSCode MDX](https://marketplace.visualstudio.com/items?itemName=JounQin.vscode-mdx) installed on your VSCode. This will help you with linting the markdown files if you're modifying or adding any `mdx` files for documentation purpose.
  - After installing this plugin navigate to your settings and add `mdx` extension to your `eslint` config. Below is how your settings will look after configuring `mdx` to work with eslint
  ```json
  // .vscode/settings.json
  {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    },
    "eslint.options": {
      "extensions": [".js", ".jsx", ".md", ".mdx", ".ts", ".tsx"]
    },
    "eslint.validate": [
      "markdown",
      "mdx",
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact"
    ]
  }
  ```

## Troubleshooting guidelines

- VSCode auto imports can sometimes mess things up due to import aliases and `.web` / `.native` extensions. If something is breaking weirdly after adding / importing a new module this might be related
- Ensure you're not using any `.web`, `.native` files directly in respective imports in `.web` / `.native` modules. For example, if you end up importing a `.web` module accidentally in a `.native` module, you might see a blank component being rendered or module not found error
- If you forget to import types inside a `.d.ts` file, sometimes TS won't complain and it can throw the typecheck logic in other modules off

- `Blade requires "FRAMEWORK" environment variable to be set. Valid values are "REACT" and "REACT_NATIVE". Instead, received: undefined`

  **Issue:** This is an issue that happens mostly if you run `yarn android` directly. For some reason `FRAMEWORK` doesn't gets passed to React Native application

  **Fix:** If you come across this issue then you first run `yarn start` and then run `yarn android`.
