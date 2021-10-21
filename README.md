<h1 align="center">
  Blade
</h1>
<p align="center">
  <a href="https://github.com/styled-components/styled-components">
    <img src="https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e" alt="Blade is styled with styled-components" />
  </a>
  <a href="https://github.com/facebook/jest">
    <img src="https://jestjs.io/img/jest-badge.svg" alt="Blade is tested with jest" />
  </a>
  <a href="https://github.com/razorpay/blade/blob/master/LICENSE.md">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Blade is released under the MIT license." />
  </a>
</p>

<p align="center">
   A Design System that powers Razorpay
<p align="center">

- [📦 Packages](#-packages)
  - [`@razorpay/blade`](#razorpayblade)
  - [`@razorpay/blade-old`](#razorpayblade-old)
- [🏁 Getting Started](#-getting-started)
  - [⚙️ Installation](#️-installation)
    - [✍🏻 Pre-requisite](#-pre-requisite)
    - [⬇️ Add blade to your application](#️-add-blade-to-your-application)
    - [🔜 Add blade libraries to your figma project](#-add-blade-libraries-to-your-figma-project)
  - [👀 How to use blade?](#-how-to-use-blade)
    - [Tokens](#tokens)
- [📝 Versioning & Publishing](#-versioning--publishing)
- [⌛️ Current State](#️-current-state)
- [🤝 How to contribute](#-how-to-contribute)
- [📝 License](#-license)
## 📦 Packages
Blade right now has 2 packages
### [`@razorpay/blade`](https://github.com/razorpay/blade/tree/master/packages/blade)
This package is under **active development**. In this `README` we'll only refer to this version of blade.
### [`@razorpay/blade-old`](https://github.com/razorpay/blade/tree/master/packages/blade-old)
This package is under **maintenance** and it won't have any major releases. It will be soon deprecated once the newer version is released as a stable release. Documentation for this package can be found [here](https://github.com/razorpay/blade/blob/master/packages/blade-old/README.md)
## 🏁 Getting Started
### ⚙️ Installation
#### ✍🏻 Pre-requisite
Before you install the package, make sure that you have performed following steps:
Before using universe just ensure following things

* You must be running Node version >=14.0.0
* You must have `yarn` installed
* Generate a Personal Access Token on GitHub by [visiting this link](https://github.com/settings/tokens/new?scopes=repo,workflow,write:packages,read:repo_hook,write:packages)
  - From Enable SSO, click `Authorize` button next to Razorpay logo.
* Run `code ~/.bashrc` or `code ~/.zshrc` in your editor and add this line 
  ```
  export GITHUB_ACCESS_TOKEN="<YOUR_TOKEN>"
  ```
* Run `source ~/.bashrc` or `source ~/.zshrc` based on the file you added your token.
* Run `code ~/.npmrc` and append the following
```bash
# add following to your .npmrc
@razorpay:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:always-auth=true
//npm.pkg.github.com/:_authToken=${GITHUB_ACCESS_TOKEN}
```
#### ⬇️ Add blade to your application
```bash
$ yarn add @razorpay/blade
```
#### 🔜 Add blade libraries to your figma project
### 👀 How to use blade?
#### Tokens
To start using tokens in your application you can follow below steps:
1. Wrap you component tree with `BladeProvider` and pass it `paymentTheme` or `bankingTheme` tokens.
```jsx
// App entry point
import { BladeProvider } from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';

function App(): JSX.Element {
  return (
    <React.Fragment>
      <BladeProvider themeTokens={paymentTheme}>
        <Card />
      </BladeProvider>
    </React.Fragment>
  );
}

export default App;
```
2. You can also pass in optional `colorScheme` prop to the `BladeProvider` mentioning whether you want the `light`, `dark` or `system`'s default color scheme. The default is `light`.
```jsx
<BladeProvider themeTokens={paymentTheme} colorScheme='dark'>
   <Card/>
</BladeProvider>
```
3. After you've wrapped your component tree under `BladeProvider`, you can use the `useTheme()` hook to get the access to the current theme context.
```jsx
import { useTheme } from '@razorpay/blade/components';

const Card = (): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <React.Fragment>
      <DisplayLarge theme={theme}>Cash Advance </DisplayLarge>
      <StyledCard theme={theme}>
        <CaptionRegular theme={theme}>
          This amount will be deducted in 3 installments from your settlement balance between Feb
          18-20 on a daily basis.
        </CaptionRegular>
      </StyledCard>
    </React.Fragment>
  );
};

const StyledCard = styled.div(
  ({ theme }: { theme: Theme }) => `
  width: 368px;
  background-color: ${theme.colors.surface.background.level2.lowContrast.onLight};
  border-radius: ${theme.border.radius.medium}px;
  padding: ${theme.spacing[5]}px;
  display: flex;
  flex-direction: column;
`,
);
```

## 📝 Versioning & Publishing
* The first step in publishing a new version of blade is to first the mention the type of change and bump the version. We are using [`changesets`](https://github.com/atlassian/changesets) to handle automated versioning for us based on the intent of the change we mention in the PR.
* Once a PR is approved by the authors of blade, based on if the PR needs a new version to be published the author will add a changeset to the PR.
* After the `changeset` is added and the PR is merged the `realease` workflow gets triggered by GitHub actions.
* The `release` workflow runs `build` script which runs rollup to bundle `blade` and generates relevant `types` as well.
* After the build script finishes, we'll have 3 bundles which will be published under `@razorpay/blade` scope
```
@razorpay/blade/components
@razorpay/blade/tokens
@razorpay/blade/utils
```
> 🗒 You can read in depth about our shipping strategy [here](./rfcs/2021-06-15-shipping-blade.md)

## ⌛️ Current State
Here's a glimpse of where we are currently in our journey of building the design system.
![current-state-image](https://user-images.githubusercontent.com/11384858/138256204-aa17fa73-ac02-431c-a618-34b34ee5fa29.png)
## 🤝 How to contribute
To contribute to this project you should follow these things:

1. Open an [issue](https://github.com/razorpay/blade/issues/new/choose) with all the details mentioned in the issue template.

2. Discuss possible solutions and approaches on the issue itself and once finalized, you can start working on implementing the solution.

3. Ensure you write the necessary tests or update existing tests/snapshots wherever required.

4. Make sure to add/update the examples under `packages/examples/tokens-usage` directory.

5. Checkout a new branch with the type of change you're committing and the module it's affecting. The type of change could be one of `fix, feat, chore, docs, ci, refactor, build` followed by `/` followed by a very short description. For eg: `feat/add-component-button`

6. Stage all your files and run `git commit`. This will lint the staged files, prettify them and then run the unit tests.

7. Once all the checks are passed you'll be shown a prompt. Follow the steps in the prompt and fill in the relevant information. We use semantic commit messages. An example of semantic commit message is shown below.

  ```
  feat: allow overriding of webpack config
  ^--^  ^------------^
  |     |
  |     +-> Summary in present tense.
  |
  +-------> Type: chore, docs, feat, fix, refactor, style, test etc.
  ```

7. Push the branch, open a PR and add a link to the issue that you had opened in the PR description.
## 📝 License

Licensed under the [MIT License](./LICENSE).