# Icon Decisions

## Internal Svg Components
- All the icons on blade will be rendered as SVG.
- Web will use the native `svg` elements to render the icons.
- Native will use `react-native-svg` to render the icons.
- In the past (blade-old), we used to create 2 files per icon - One for web and one for native (`WifiOn.web.js` & `WifiOn.native.js`).
- Going forward, we want to create one file per icon (`WifiOn.ts`) and internally use the correct platform specific components to render the icon.
- To achieve this, we'll create custom Svg components like `Svg`, `Path`, `G`, `Rect`, etc. within blade which will have their own platform specific implementations like `Svg.native.tsx` & `Svg.web.tsx` that would use the correct platform specific components to render the icon.
- These will be internal components and won't be exported to our consumers
- We would use these components to build our Blade Icons which would then be exported
- We will store all our custom Svg components within `components/Icons/_Svg/*` directory and not export them to our consumers (`_` indicates it is an internal component)
- After auditing components from `blade-old`, we have decided to create the following Svg components (we can add more components & props later if we get a valid use-case):
  - Svg
  - Path
  - G
  - Rect
  - Defs
  - ClipPath
  
<img src="./component-breakdown.png" />

## Icon Components
- We will store all our icons within `components/Icons/*` directory and make them available to our consumers like this: 
  ```jsx 
  import { CreditCardIcon } from '@razorpay/blade/components'
  ```
- All icons will be built using the internal `_Svg` components
- Each Icon component will follow the naming convention of having `Icon` as a suffix. For example, `CreditCardIcon`, `ProfileIcon`, etc.
- The API for each Icon component will look similar to this:
  ```jsx
  <CreditCardIcon
    color='surface.text | feedback.text | button.text'
    size='xxsmall | xsmall | small | medium | large | xlarge'
  >
  ```
  
- Each icon will have the same `height` & `width` which would be derived from its `size` prop. Here's what each size corresponds to
  - xxsmall: `width='10px'`, `height='10px'`
  - xsmall: `width='12px'`, `height='12px'`
  - small: `width='16px'`, `height='16px'`
  - medium: `width='20px'`, `height='20px'`
  - large: `width='24px'`, `height='24px'`
  - xlarge: `width='30px'`, `height='30px'`
