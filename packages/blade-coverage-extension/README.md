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

## Publishing to Chrome Web Store

The extension is automatically published to the Chrome Web Store when a new version is released via changesets.

### Automated Release Process

1. Create a changeset for the extension: `yarn changeset`
2. Select `blade-coverage-extension` and specify the version bump
3. Merge to master - the release workflow will:
   - Bump the version in `package.json`
   - Sync the version to `manifest.json`
   - Create a release PR
4. Once the release PR is merged, the Chrome Extension Release workflow will:
   - Build the extension
   - Upload and publish to Chrome Web Store
   - Create a git tag for the version

### Manual Release

You can also trigger a manual release via GitHub Actions:

1. Go to Actions → Chrome Extension Release
2. Click "Run workflow"
3. Optionally check "Force publish" to publish even if the version hasn't changed

### Required GitHub Secrets

The following secrets must be configured in the repository for Chrome Web Store publishing:

| Secret                           | Description                                   |
| -------------------------------- | --------------------------------------------- |
| `CHROME_WEB_STORE_CLIENT_ID`     | OAuth 2.0 Client ID from Google Cloud Console |
| `CHROME_WEB_STORE_CLIENT_SECRET` | OAuth 2.0 Client Secret                       |
| `CHROME_WEB_STORE_REFRESH_TOKEN` | OAuth 2.0 Refresh Token                       |

### Setting Up Chrome Web Store API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Chrome Web Store API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Select "Desktop app" as the application type
6. Download the credentials JSON
7. Use `chrome-webstore-upload-cli` to get the refresh token:

```bash
npx chrome-webstore-upload-cli init
```

Follow the prompts to authenticate and obtain the refresh token.
