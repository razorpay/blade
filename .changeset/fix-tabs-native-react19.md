---
'@razorpay/blade': patch
---

fix(Tabs.native): drop react-native-tab-view, rebuild on react-native-pager-view

Replaces the `react-native-tab-view@3.x` dependency (which declares `react: ~16.13.1` in devDeps
and triggers an "Invalid hook call" crash on React 19.2 + RN 0.85) with a direct
`react-native-pager-view` implementation.

**What changed:**
- `Tabs.native.tsx` — new implementation: custom `CustomTabBar` (ScrollView + Pressable +
  `react-native-reanimated` animated indicator) + `PagerView` for swipe-between-panels.
  No `TabBar` / `TabView` from `react-native-tab-view` anywhere in the render tree.
- `TabIndicator.native.tsx` — indicator logic moved inline; file retained as a no-op for
  internal import compatibility.
- `SafeSceneMap.native.tsx` — removed `react-native-tab-view` type import; kept as a backwards-
  compatible export (no longer used by `Tabs.native.tsx`).
- `packages/blade/package.json` — removed `react-native-tab-view` from `peerDependencies` and
  `devDependencies`; broadened `react-native-pager-view` peer range to `^6.2.1 || ^8.0.0` so
  consumers on RN 0.85 with pager-view 8.x (e.g. `razorpay/frontend-mobile-app`) are covered
  without a breaking peer-dep bump.

**Visual/behavioural parity:** all three variants (bordered, borderless, filled), sizes, and
`isFullWidthTabItem` are preserved. Animated indicator uses `withTiming` from reanimated (already
a Blade peer dep) for smooth transitions.

**Consumers:** `razorpay/frontend-mobile-app` — `react-native-tab-view@3.1.1` was already
installed there as a transitive dep; it is no longer required by Blade and can be removed from
the consumer's direct deps if desired.
