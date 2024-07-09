# Blade Coverage Plugin

Blade coverage plugin helps you in getting coverage of blade on a web page instantaneously.

https://github.com/razorpay/blade/assets/6623629/53415eed-4681-4fe3-9ad5-235f5993181b

## Project structure

Plugin is made of two parts:

1. HTML, JS and CSS responsible for rendering:
   1. UI of plugin.
   2. Trigger blade coverage.
   3. Display blade coverage results.
2. Background script which is responsible for:
   1. Intercepting messages from chrome plugin
   2. Interacting with DOM and getting blade coverage.
   3. Relaying back coverage to chrome plugin.

### Key files:

1. Manifest.json - This informs chrome about file paths and names of chrome plugin.
2. background_script.js - background script.
3. All the other files are responsible for rendering UI of Plugin.

## Contributing

- If you are developer, help by contributing to the codebase. Contributions can be bug fixes, support for new components, or documentation improvements.

### How To Make Changes

- Make relevant changes.
- Run yarn build, it will generate a new folder named chrome-extension in `blade-coverage-extension` folder.
- Open chrome://extensions.
- Enable developer mode in top right.
- Click on Load Unpacked extension and open blade-coverage-extension/chrome-extension.
- Open `x.razorpay.com`
- Open blade coverage plugin and verify your changes.
