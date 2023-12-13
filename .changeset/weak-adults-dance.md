---
"@razorpay/blade": minor
---

feat(blade): optimize bundle size with isolated modules & enable codesplitting

**Migration:**

## Jest

**transformIgnorePatterns:**

In your jest config's [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring) add `@table-library` so that it gets transpiled by jest.

```diff
// jest.config.js
transformIgnorePatterns: [
-  '/node_modules/(?!(@razorpay/blade|commander)|uuid|@babel/runtime/)',
+  '/node_modules/(?!(@razorpay/blade|commander)|uuid|@babel/runtime|@table-library/)',
],
```

**moduleNameMapper:**

In your jest config's [`moduleNameMapper`](https://jestjs.io/docs/configuration#modulenamemapper-objectstring-string--arraystring), you can remove the aliased blade modules: 

This is present in [x](https://github.com/razorpay/x/blob/master/jest.config.js#L49-L51), [frontend-website](https://github.com/razorpay/frontend-website/blob/master/jest.config.js#L14-L16) & [admin-dashboard](https://github.com/razorpay/admin-dashboard/blob/master/jest.config.js#L14-L16) repo.

```diff
moduleNameMapper: {
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
-  '@razorpay/blade/tokens': '@razorpay/blade/build/tokens/index.development.web.js',
-  '@razorpay/blade/utils': '@razorpay/blade/build/utils/index.development.web.js',
-  '@razorpay/blade/components': '@razorpay/blade/build/components/index.development.web.js',
},
```

## Third Party Libs

While this change is not a breaking change, but we've made a few changes in how the dependencies are handled by blade internally. 

- Web: 

In web, we've marked all the dependencies as `external`, that means you don't need to install the peer dependencies manually, 
If you have `@floating-ui/react` in your `package.json` you can safely remove it, yarn/npm will automatically install the appropriate version for you. 

- Native: 

In native, we've marked all the dependencies as peerDependencies, so that web consumers doesn't have to install them + ensures there are no mismatches between blade vs consumer dependencies. 
Please refer to the [installation guide](https://blade.razorpay.com/?path=/docs/guides-installation--page#-add-blade-to-your-application)https://blade.razorpay.com/?path=/docs/guides-installation--page#-add-blade-to-your-application for more details. 
