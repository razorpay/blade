- [Contributing guidelines for `blade`](#contributing-guidelines-for-blade)
  - [Development setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Setting up web](#setting-up-web)
    - [Setting up iOS](#setting-up-ios)
    - [Setting up Android](#setting-up-android)
  - [Adding New Icons](#adding-new-icons)
    - [Step 1 - Copy SVG](#step-1---copy-svg)
    - [Step 2 - Run Generator](#step-2---run-generator)
    - [Step 3 - Finalize](#step-3---finalize)


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
  yarn react
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

  > **Note:**
  >
  > Sometimes it can take a very long time for Xcode to install. Check [here](https://apple.stackexchange.com/questions/427640/mac-app-store-xcode-download-stuck-at-installing) for troubleshooting.

- Install an iOS simulator in Xcode: Xcode > Preferences > Components.

  > **Note:**
  >
  > Sometimes this can get stuck or take a very long time. Check [here](https://stackoverflow.com/questions/29058229/download-xcode-simulator-directly) for troubleshooting.

- Install cocoapods:

  ```sh
  sudo gem install cocoapods
  ```

- Install pods. This can be done by running `pod install` in the `ios/` directory for Intel machine. For M1, things might not work out of box.

  > **Note:**
  >
  > Follow the note [here](https://reactnative.dev/docs/environment-setup#cocoapods) if you're using M1

- `cd` back to `packages/blade`. Start the storybook server for React Native:

  ```sh
  yarn react-native:storybook:start
  ```

- Keep the process running and in a new tab or terminal window start the storybook app on iOS:

  ```sh
  yarn react-native:storybook:ios
  ```

  > **Tip:**
  >
  > You don't need to build the app everytime (only when you're changing native dependencies), once the app is built you can just start the storybook server and open the app directly on your simulator

- If the stars aligned correctly, the storybook app should get installed and up and running on the simulator. If not, please refer to the official [guide](https://reactnative.dev/docs/environment-setup) for any deviations.

### Setting up Android

- Of course you'll need a fresh cup of tea, coffee or your favorite drink 😸

- Follow the official [guide](https://reactnative.dev/docs/environment-setup). Some of the initial steps needed are the same for iOS. Please note the following tips and deviations:

  - Use the Android 12 SDK, when you follow the official guide, the default selected SDK is not Android 12
  - When you setup the emulator from Android Studio, create a fresh one (delete the one that is created by default). The default one comes with low storage and memory so you'll likely run into `INSTALL_FAILED_INSUFFICIENT_STORAGE` issue. For RAM and virtual memory heap you may use `2000` and for storage `4000` as values.

  > **Tip**
  >
  > At times, you might run into some weird issues during installation. Sometimes restarting your computer does the trick. You can also `cd` into the `android` directory and run `./gradlew clean` to clean up cache and built files when retrying installation or running the app.

- `cd` back to `packages/blade`. Start the storybook server for React Native:

  ```sh
  yarn react-native:storybook:start
  ```

- Start up the emulator from Android Studio (sometimes it doesn't auto boot). Keep the process running and in a new tab or terminal window start the storybook app on Android:

  ```sh
  yarn react-native:storybook:android
  ```

- If the stars aligned correctly, the storybook app should get installed and up and running on the emulator 🎉

## Adding New Icons

First make sure icons which you are adding are reviewed by a designer and works with blade's iconography. 

### Step 1 - Copy SVG

Open figma and copy the icon's svg which you want to add: 

<img width="734" alt="image" src="https://user-images.githubusercontent.com/35374649/186355199-7b9c3b79-2a80-41c7-a094-0cdacdc78390.png">

### Step 2 - Run Generator

Run 

```
yarn workspace @razorpay/blade plop
```

This command automates the process of generating boilerplate code and automatically adds neccessary imports & exports. 

First enter the icon name in Title Case.

Then it will open up a text editor where you can paste the copied svg, after saving the file exit the text editor. 

<img width="613" alt="image" src="https://user-images.githubusercontent.com/35374649/186355994-da978c44-07b2-40cc-9ebb-76a5e07b1fcc.png">

90% of the things are done. 

### Step 3 - Finalize

Now you'll see it has created a new icon inside the icons folder. 

> packages/blade/src/components/Icons/HeartIcon

Just make sure everything is working by running the storybook example. 

And also update the snapshots: 

```
yarn workspace @razorpay/blade test:react -u 
yarn workspace @razorpay/blade test:react-naitve -u 
```

And that's it. 