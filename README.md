<br/>
<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./branding/blade-original-dark-mode.min.svg">
  <source media="(prefers-color-scheme: light)" srcset="./branding/blade-original.min.svg">
  <img width="450px" alt="Blade Design System Logo" src="./branding/blade-original.min.svg">
</picture>
</p>

<br/>

<p align="center">
  <a href="https://npmjs.org/package/@razorpay/blade"><img alt="Blade Latest Version" src="https://img.shields.io/github/package-json/v/razorpay/blade?style=for-the-badge&labelColor=322&logo=npm&label=@razorpay/Blade&color=darkred&filename=packages%2Fblade%2Fpackage.json"></a> &nbsp;<a href="https://blade.razorpay.com/"><img alt="Documentation blade.razorpay.com" src="https://img.shields.io/badge/Documentation-blade.razorpay.com-0648EF?style=for-the-badge&labelColor=0012AD&logo=readthedocs&logoColor=eee"/></a> &nbsp;<a href="https://github.com/razorpay/blade/tree/master/CONTRIBUTING.md"><img alt="Discord Join Chat" src="https://img.shields.io/badge/Contributions-Open-333333?style=for-the-badge&logo=github&logoColor=ffffff&labelColor=111111"/></a></p>

<h1 aria-hidden="true"></h1>

<br/>

Blade is the Design System that powers [Razorpay](https://razorpay.com/). 

## 🔗 Links

- [Docs](https://blade.razorpay.com)
- [Installation](https://blade.razorpay.com/?path=/docs/guides-installation--page)
- [@razorpay/blade-old](https://github.com/razorpay/blade-old) (Deprecated, Private)

## ✨ Features
- Cross-Platform (Works Natively on [React Web](https://blade.razorpay.com/?path=/docs/guides-installation--page#%EF%B8%8F-installation) and [React Native](https://blade.razorpay.com/?path=/docs/guides-installation--page#react-native-projects))
- [White Labelling](https://blade.razorpay.com/?path=/docs/guides-theming-theme-playground--page)
- [CSS Variables for non-React Projects](https://blade.razorpay.com/?path=/docs/tokens-css-variables--page)
- [Accessible](https://github.com/razorpay/blade/blob/master/rfcs/2022-04-09-accessibility.md#manual-testing)
- Documented [RFCs](https://github.com/razorpay/blade/tree/docs/make-docs-pretty/rfcs) and [API Decisions](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Alert/_decisions/decisions.md)

## Document global.navigator.product configuration for jest on React Native

Create a jest-setup.js File:

In your project's root directory, create a file named jest-setup.js.
Edit jest-setup.js with the following content:

javascript
Copy code
// jest-setup.js

// Configure global.navigator.product for React Native detection

 global.navigator = {
  product: 'ReactNative',
};
Update Jest Configuration:

Open your package.json file.
Locate the "jest" configuration section.
Add or update the "setupFilesAfterEnv" property to include the path to your jest-setup.js file:
json
Copy code
"jest": {
  "setupFilesAfterEnv": ["<rootDir>/jest-setup.js"],
  // other Jest configurations...
}
Save Changes:

Save the changes to your package.json file.
Run Jest Tests:

Execute your Jest tests as usual with the following command:
bash
Copy code
npm test
Explanation:
The jest-setup.js file is a setup script that Jest runs before executing the tests. By adding the global configuration for navigator.product within this file, you ensure that Jest recognizes the React Native environment during test execution.

This setup mimics the behavior of React Native in a production environment, allowing your tests to behave consistently with the runtime environment.

Note:
Make sure to update the path in the "setupFilesAfterEnv" property if your jest-setup.js file is located in a different directory.

Example:
Suppose your project structure is as follows:

lua
Copy code
project-root
|-- src
|-- tests
|-- jest-setup.js
|-- package.json
In this case, the "setupFilesAfterEnv" property should be updated to "setupFilesAfterEnv": ["<rootDir>/jest-setup.js"]. Adjust the path based on your specific project structure.




## 📝 License

Licensed under the [MIT License](https://github.com/razorpay/blade/blob/master/LICENSE.md).

<h1 aria-hidden="true"></h1>

<p align="center">Interested in working with us? Checkout our <a href="https://razorpay.com/jobs">Jobs Page</a> for open roles 🤗</p>

