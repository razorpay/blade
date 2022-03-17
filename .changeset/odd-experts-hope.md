---
"@razorpay/blade": patch
"@razorpay/blade-old": patch
---

feat(blade): add listener for toggling breakpoints

**Updates**
* Add `breakpoints` token to the themes.
* Out of the box responsiveness support for typography tokens.
* Publish `useBreakpoint` hook.
* Following breakpoints are supported as of today.
  ```
  /** max width: 320px  */
  xs: 320;
  /** min width: 321px and max width: 480px */
  s: 480;
  /** min width: 481px and max width: 768px */
  m: 768;
  /** min width: 769 and max width: 1024px */
  l: 1024;
  /** min width: 1025 and max width: 1200px */
  xl: 1200;
  /** min width: 1201px  */
  max: 1201;
  ```
* For web the typography scale will toggle between mobile and desktop
  * `xs, s, m` are considered as mobile
  * `l, xl, xl` are considered as desktop
* For react native we always default to mobile typography scale

**What does it mean for me(as a developer)?**
* If you’re already using Blade tokens then you can leverage this by just running `yarn upgrade @razorpay/blade@0.1.6` and that’s it you are set 🚀 
  * You can use the typography tokens as you were doing previously. Refer the [usage guideline here](https://61c19ee8d3d282003ac1d81c-jukcfyruls.chromatic.com/?path=/story/guides-usage--page&globals=measureEnabled:false#tokens)
* You can use these `breakpoints` as a base reference to build your next set of features by just following the [usage guidelines here](https://61c19ee8d3d282003ac1d81c-jukcfyruls.chromatic.com/?path=/story/tokens-breakpoints--page&globals=measureEnabled:false).

This is our first step towards building responsive and adaptive applications. We’ll be publishing Typography Components next which will be built on top of these tokens and you can use them directly for your projects. Meanwhile, [read more about our responsive and adaptive strategy in this RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-02-11-responsive-and-adaptive-layout-strategy.md)
