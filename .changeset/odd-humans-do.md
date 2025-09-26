---
'@razorpay/blade': minor
---

## feat(blade): add donut charts 🍩

[Docs Link](https://blade.razorpay.com/?path=/docs/components-charts-donutchart--docs)



### Deprecation of `colorTheme='default'`

The `default` option for the `colorTheme` prop has been removed to improve clarity and provide a more descriptive API. The new default theme is `'categorical'`. This change makes the theme's purpose—applying a set of distinct colors for different categories—more explicit.

**Impact**

This is a breaking change for any implementation that explicitly sets `colorTheme='default'`. Implementations that did not specify a `colorTheme` will automatically use the new `'categorical'` default and should see no change in behavior.

**How to Upgrade**

You need to update your code where `colorTheme='default'` is used. You can either remove the prop entirely or change the value to `'categorical'`.

```diff
- <YourComponent colorTheme='default' />
+ <YourComponent colorTheme='categorical' />

// Or, since it's the new default, simply remove the prop:
+ <YourComponent />

```

### Updation of color mapping tokens for charts

We have update color mapping of few token related to charts. you might need to update your snaps.






