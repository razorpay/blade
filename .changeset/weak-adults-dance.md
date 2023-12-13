---
"@razorpay/blade": minor
---

feat(blade): optimize bundle size with isolated modules & enable codesplitting

**Migration:**

## Jest

In your jest config's [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring) add `@table-library` so that it gets transpiled by jest.

```diff
// jest.config.js
transformIgnorePatterns: [
-  '/node_modules/(?!(@razorpay/blade|commander)|uuid|@babel/runtime/)',
+  '/node_modules/(?!(@razorpay/blade|commander)|uuid|@babel/runtime|@table-library/)',
],
```

## Third Party Libs

While this change is not a breaking change, but we've made a few changes in how the dependencies are handled by blade internally. 

- Web: 

In web, we've marked all the dependencies as `external`, that means you don't need to install the peer dependencies manually, 
If you have `@floating-ui/react` in your `package.json` you can safely remove it, yarn/npm will automatically install the appropriate version for you. 

- Native: 

In native, we've marked all the dependencies as peerDependencies, so that web consumers doesn't have to install them + ensures there are no mismatches between blade vs consumer dependencies. 
Please refer to the [installation guide](https://blade.razorpay.com/?path=/docs/guides-installation--page#-add-blade-to-your-application)https://blade.razorpay.com/?path=/docs/guides-installation--page#-add-blade-to-your-application for more details. 
