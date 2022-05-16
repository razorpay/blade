# Button Decisions <!-- omit in toc -->
- [Internal BaseButton Component](#internal-basebutton-component)
- [Button Component](#button-component)
- [Open Questions](#open-questions)

## Internal BaseButton Component
-  Internal component that exposes certain extra props to enable creation of Component Level Action Buttons like `positive`, `negative`, `neutral`
-  **BaseButton API**:
   -  ***`variant`**: `primary` | `secondary` | `tertiary` | `plain` | `positive` | `negative` | `notice` | `info` | `neutral`
      -  **default**: `primary`
   -  **`action`**: `positive` | `negative` | `notice` | `info` | `neutral`
      -  **default**: `positive`
        -  We could have an `action` prop that decides what kind of action the button is going to take. With this we could reduce the number of variants we have in the API
      -  Having an `action` prop would cause us to create unintended variations of buttons with the combinations of `action` and `variant` props like `secondary-positive`
      -  Even if we remove the `action` prop and have more `variants` instead, we would still have unintended variations with combinations of `variant` and `contrast` props like `secondary-high`
   -  **`contrast`**: `high` | `low`
      -  **default**: `high`
      -  We need this for Component level buttons since `positive` would have a `high` as well as a `low` contrast button
      
   -  **`size`**: `large` | `medium` | `small` | `xsmall`
      - **default**: `medium`
      -  How would we control large/small screen size variations?
   -  ***`children`**: `String`
   -  **`icon`**: `IconComponent`
      -  **default**: `undefined`
   -  **`isDisabled`**: `true` | `false`
      -  **default**: `false`
      -  Should we call this `disabled` instead?
   -  **`isFullWidth`**: `true` | `false`
      -  **default**: `false`
      -  Should we call this `fullWidth` instead?
   -  **`onClick`**/**`onPress`**: `Function`
      -  **default**: `undefined`
      -  `onClick` doesn't seem right from a mobile point of view since you don't "click", you "press". `onPress` sounds okay from both mobile and desktop point of view.

## Button Component
- This will be the Button component that is exposed to our consumers and will be a wrapper on top of `BaseButton` component
-  **Button API**:
   -  **`*variant`**: `primary` | `secondary` | `tertiary` | `plain` 
      - **default**: `primary`
   -  **`size`**: `large` | `medium` | `small` | `xsmall`
      -  **default**: `medium`
      -  How would we control large/small screen size variations?
   -  ***`children`**: `String`
   -  **`icon`**: `IconComponent`
      -  **default**: `undefined`
   -  **`isDisabled`**: `true` | `false`
      -  **default**: `false`
      -  Should we call this `disabled` instead?
   -  **`onClick`**/**`onPress`**: `Function`
      -  **default**: `undefined`
      -  `onClick` doesn't seem right from a mobile point of view since you don't "click", you "press". `onPress` sounds okay from both mobile and desktop point of view.

<img src="./component-breakdown.png"/>

## Open Questions
- Should we have `variant+contrast` props or `variant+action+contrast` props?
- What about small/large screen?
- Component-level Actions look mostly like primary except Focus, what do we do?
- Link & Plain Buttons are the same?
- Should Plain/Link behave as `<a>` tag?
- Should we expose a `type` prop for `button`, `reset`, `submit`?
- Do we need `leadingIcon`/`leftIcon` `trailingIcon`/`rightIcon` props?
- Should we call it onClick or onPress?
- Scope of A11y?
  - [WAI-ARI Button](https://www.w3.org/TR/wai-aria-practices-1.2/#button)
  - [WAI-ARI Link](https://www.w3.org/TR/wai-aria-practices-1.2/#link)