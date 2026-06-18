# Android Card Story Screenshots

This directory is intended to store screenshots of the Card component
from Blade's React Native Storybook running on Android.

## Story Details

- **Component:** Card
- **Story file:** `Card.stories.tsx`
- **Storybook config:** `.storybook/react-native/`
- **Story ID (Android):** `Components/Card`

## How to Capture a Screenshot

### Prerequisites
- Android SDK with `adb` in PATH
- An Android emulator or physical device connected
- `agent-device` CLI installed: `npm install -g agent-device`

### Steps

```bash
# 1. Start Metro bundler for React Native Storybook
cd packages/blade
yarn react-native:storybook:start

# 2. In a separate terminal, run the Android Storybook app
yarn react-native:storybook:android

# 3. Wait for the app to launch, then use agent-device to open the Card story
agent-device open --platform android

# 4. Navigate to the Card story
agent-device snapshot -i --platform android
# Find the Card story element from the snapshot and click it

# 5. Capture the screenshot
agent-device screenshot android-screenshots/card-story-android.png --platform android
```

## Status

Screenshot capture was attempted but could not be completed because
the CI/agent environment does not have the Android SDK (`adb`) installed.

To capture the screenshot, run the steps above in a local development
environment with Android SDK configured.
