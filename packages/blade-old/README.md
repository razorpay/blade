<h3 align="center">
⚠️ This package is under maintenance and will soon be deprecated ⚠️
</h3>
<h1 align="center">
  Blade Old
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

- [🏁 Getting Started](#-getting-started)
  - [⚙️ Installation](#️-installation)
    - [✍🏻 Pre-requisite](#-pre-requisite)
    - [⬇️ Add blade to your application](#️-add-blade-to-your-application)
    - [React Native](#react-native)
      - [For react native >= 0.60.x (Autolink)](#for-react-native--060x-autolink)
      - [For react native <= 0.59.x](#for-react-native--059x)
      - [Additional Steps](#additional-steps)
## 🏁 Getting Started
### ⚙️ Installation
#### ✍🏻 Pre-requisite
Before you install the package, make sure that you have performed following steps:

* You must be running Node version >=14.0.0
* You must have `yarn` installed
* Generate a Personal Access Token on GitHub by [visiting this link](https://github.com/settings/tokens/new?scopes=repo,workflow,write:packages,read:repo_hook,write:packages)
  - If you belong to razorpay organisation then you will need to enable SSO by clicking `Authorize` button next to Razorpay logo.
* Run `code ~/.bashrc` or `code ~/.zshrc` in your editor and add this line 
  ```
  export GITHUB_ACCESS_TOKEN="<YOUR_TOKEN>"
  ```
  > Note: Replace `<YOUR_TOKEN>` with your actual GitHub Personal Access Token
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
yarn add @razorpay/blade-old
```

#### React Native

##### For react native >= 0.60.x (Autolink)

1. Add this to your package.json
   `"@razorpay/blade-old": "razorpay/blade.git#master"`
1. Run `yarn`
1. Create a file in your project root directory called `react-native.config.js` and add blade as an asset dependency to get all the fonts:

```
module.exports = {
  assets: ['@razorpay/blade-old'],
};
```

1. Run `npx react-native link`

##### For react native <= 0.59.x

1. Add this to your package.json
   `"@razorpay/blade-old": "razorpay/blade.git#master"`
1. Run `yarn`
1. Run `npx react-native link @razorpay/blade-old`


##### Additional Steps
1. For `react-native-gesture-handle` follow steps given [here](https://docs.swmansion.com/react-native-gesture-handler/docs/#bare-react-native).
2. For `react-native-linear-gradient` follow instructions for [android](https://www.npmjs.com/package/react-native-linear-gradient#android) and [ios](https://www.npmjs.com/package/react-native-linear-gradient#ios).
