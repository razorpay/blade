# Contributing guidelines for `blade`

## Development setup

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

- That's it!

### Setting up iOS

- Get a tea, coffee or your favorite drink, you'll need it 😸

- Install [`brew`](https://brew.sh/) if you don't have it installed

- Install watchman:

  ```sh
  brew install watchman
  ```

- Install [Xcode](https://reactnative.dev/docs/environment-setup#xcode).

  > **Note**
  >
  > Sometimes it can take a very long time for Xcode to install. Check [here](https://apple.stackexchange.com/questions/427640/mac-app-store-xcode-download-stuck-at-installing) for troubleshooting.

- Install an iOS 13 simulator in Xcode: Xcode > Preferences > Platforms.

  > **Note**
  >
  > Sometimes this can get stuck or take a very long time. Check [here](https://stackoverflow.com/questions/29058229/download-xcode-simulator-directly) for troubleshooting.

- Install cocoapods:

  ```sh
  sudo gem install cocoapods
  ```

- Install pods. This can be done by running `pod install` in the `ios/` directory for Intel machine. For M1, things might not work out of box.

  > **Note**
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

*The storybook can take some time to open after simulator starts. Don't worry, it will start after few minutes (hopefully 🤞).*

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

  > **Note**
  >
  > If you already have `yarn start:ios` running, you might have to close it since `yarn start:android` will try to run react-native server on the same port and fail with port taken error.
  > 
  > If you want to run both, android and ios at the same time, you can use `yarn start:native` instead.

  > **Note**
  >
  > Make sure `$ANDROID_SDK_ROOT` is added before running the above command, you can run `echo $ANDROID_SDK_ROOT` in same terminal to confirm. (You can run `source ~/.zshrc` or `source ~/.bash_profile` depending on where you added the variables)

- If the stars aligned correctly, the storybook app should get installed and up and running on the emulator 🎉

## Tips

- You can use `yarn start:all` command to run storybooks on all platforms like web, android, and ios (better to not use it in development though to avoid stressing your laptop)

## TypeScript Guide

[Writing Cross-Platform TypeScript In Blade](./rfcs/writing-cross-platform-typescript.md)

## Troubleshooting guidelines

- VSCode auto imports can sometimes mess things up due to import aliases and `.web` / `.native` extensions. If something is breaking weirdly after adding / importing a new module this might be related
- Ensure you're not using any `.web`, `.native` files directly in respective imports in `.web` / `.native` modules. For example, if you end up importing a `.web` module accidentally in a `.native` module, you might see a blank component being rendered or module not found error
- If you forget to import types inside a `.d.ts` file, sometimes TS won't complain and it can throw the typecheck logic in other modules off
