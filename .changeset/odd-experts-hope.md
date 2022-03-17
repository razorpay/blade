---
"@razorpay/blade": patch
"@razorpay/blade-old": patch
---

feat(blade): add listener for toggling breakpoints

**Updates**
* After upgrading to this version you'll get responsiveness out of the box in typography tokens.

* This release adds support for following breakpoints
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

[Read more about our responsive and adaptive strategy in this RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-02-11-responsive-and-adaptive-layout-strategy.md)

**How to get this for your project?**
* Run `yarn upgrade @razorpay/blade@0.1.6`
* Use the typography tokens as you were doing previously. Refer the [usage guideline here](https://61c19ee8d3d282003ac1d81c-jukcfyruls.chromatic.com/?path=/story/tokens-typography--page&globals=measureEnabled:false)
