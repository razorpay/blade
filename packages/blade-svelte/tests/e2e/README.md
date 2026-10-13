# src-cx end-to-end tests

One suite, two targets. The specs open src-cx stories and check what unit
tests in jsdom cannot: real transitions, focus, pointer drags and layout.

## Run locally (no credentials)

```sh
yarn build-storybook          # once, and after changing src-cx
npx playwright install chromium webkit
yarn test:e2e                    # desktop and emulated phones, Chromium and WebKit
yarn test:e2e --project=desktop-chromium
yarn test:e2e:ui                 # Playwright's UI mode
```

The config serves `storybook-static` on `localhost:6108`
(`support/serve.mjs`). Set `STORYBOOK_URL` to test a published Storybook
instead. Playwright's WebKit runs on macOS and on Ubuntu (CI installs it with
`--with-deps`); on other Linux distributions run the Chromium projects.

Specs tagged `@device` cover real-device behaviour that emulation cannot
reproduce (iOS Safari's viewport and keyboard, for instance); the local
target skips them.

## Run on BrowserStack

```sh
BROWSERSTACK_USERNAME=… BROWSERSTACK_ACCESS_KEY=… yarn test:e2e:browserstack
```

`browserstack-node-sdk` runs every spec on each platform in
`browserstack.yml` (desktop Chrome and WebKit, a Pixel and an iPhone) and opens
a BrowserStack Local tunnel to the locally served Storybook.

## Writing specs

- Open a story with `gotoStory(page, 'components-modal--basic', { isDismissible: false })`;
  ids are the Storybook ids, args use Storybook's URL grammar.
- Locate by `getByTestId` and aria attributes; stories give their parts a
  `testID`. Role locators are unreliable on BrowserStack's real mobile
  devices.
- Wait for motion to finish before measuring or dragging (see `settled` in
  `modal.spec.ts`).
