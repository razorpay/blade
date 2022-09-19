---
"@razorpay/blade": minor
---

feat(blade): Improve platform types with TS 4.7

### Added support for platform dependant types

Migration Steps

1. Upgrade to TypeScript 4.7+
2. Depending on your app platform change the moduleSuffixes config in `tsconfig`

```js
{
  "compilerOptions": {
    // For react-native use `.native`
    // For web use `.web` extension
    "moduleSuffixes": [".web", ""]
  }
}
```

> **Note**:  
> if you are on <TS 4.7 or don't specify the `moduleSuffixes` blade will fallback to resolving `web` types
