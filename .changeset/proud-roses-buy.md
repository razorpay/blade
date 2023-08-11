---
"@razorpay/blade": major
---

build: upgrade react `v18.2.0`, react-native `v0.72.3` & other libraries

### Upgrade the following packages:
- `react` to `18.2.0`
- `react-native` to `0.72.3`
- `react-dom` to `18.2.0`
- `react-native-reanimated` to `3.4.1`
- `react-test-renderer` to  `18.2.0`
- `@react-native-async-storage/async-storage` to `1.19.1`
- `@testing-library/react` to `13.4.0`
- `@testing-library/react-native` to `12.2.0`

### Migration Guide
- You can follow [React's](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) & [React Native's](https://react-native-community.github.io/upgrade-helper/?from=0.66.5&to=0.72.3) guides to update your packages to the latest version
- If you are using `npm` as your package manager and continue to remain on `react` `v17`, you will have to run `npm install` with `--legacy-peer-deps` flag otherwise you will encounter react version mismatch errors
- React Native consumers will need to upgrade to `react-native-reanimated` `v3`
