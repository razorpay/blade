# Blade Component Accessibility Checklist <!-- omit in toc -->

This document will contain information and guidance on how to ensure accessibility of components,
And how we can incorporate it in the component development life cycle.

## 5 Minute Guide for ensuring accessibility in blade components

https://user-images.githubusercontent.com/35374649/175493627-4c5f29e9-0625-44fe-a5a8-03df7700f886.mp4

## Checklist
- [ ] Add `Accessibility` section to component's `decision.md`. [More Details](#component-decisions)
- [ ] Use `makeAccessible` utility to make components accessible across platforms. [More Details](#implementations)
- [ ] Adhere to the aria states & roles for the component ([Example](https://www.w3.org/WAI/ARIA/apg/example-index/checkbox/checkbox.html#rps_label))
- [ ] Adhere to the keyboard accessibility requirements for the component ([Example](https://www.w3.org/WAI/ARIA/apg/example-index/checkbox/checkbox.html#kbd_label))
- [ ] Manual Testing and Self Review - [More Details](#manual-testing--review)
    - [ ] Use only keyboard to check for keyboard accessibility
    - [ ] Use voice-over to check for assistive technologies can announce the component states
- [ ] Take accessibility reviews from other team members(whenever required)

## Component Decisions

While writing `decision.md` file for component make sure to include `Accessibility` section and link to the appropriate [WAI ARIA component pattern](https://www.w3.org/WAI/ARIA/apg/patterns/) 

Example: 

Let's say you are building a `Checkbox` component. 

- Step 1: Write the core logic for checkbox behaviour 
- Step 2: Find the appropriate [WAI-ARIA Pattern for checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- Step 3: According to the pattern implement [proper keyboard accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/#keyboard-interaction-5), like in checkbox we have to make sure to pressing <kbd>Space</kbd> should toggle the state. 
- Step 4: Each pattern will have [an example section](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/#examples-1) which you can check for implementation and detailed information about [Accessibility Features](https://www.w3.org/WAI/ARIA/apg/example-index/checkbox/checkbox.html#accessibilityfeatures), [Keyboard Support](https://www.w3.org/WAI/ARIA/apg/example-index/checkbox/checkbox.html#kbd_label) and what various [aria attributes](https://www.w3.org/WAI/ARIA/apg/example-index/checkbox/checkbox.html#rps_label) the component needs to be accessible. 
  
Following these patterns & examples we can make our components accessible.  
General rule of thumb is to visit the component patterns page, read about the component's accessibility requirements and learn from the examples.

## Implementation

To implement the proper aria attributes make use of our `makeAccessible` utility which we proposed [in the RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-04-09-accessibility.md#platform-specific-implementation--5) - See usage [example](https://github.com/razorpay/blade/blob/master/packages/blade/src/storybook-recipes/AccessibilityInterop/AccessibilityInteropDemo.web.tsx). 

At this point we will also adhere to all the keyboard specific accessibility features, and implement proper keyboard management per component basis. 

## Manual Testing & Review

After building the component we have to do few rounds of manual testing to make sure that screen readers are announcing the component correctly.

In MacOS we can press `fn+⌘+f5` to open up voice-over and test out our component with keyboard only. 

We also have a manual testing checklist in [Accessibility RFC](https://github.com/razorpay/blade/blob/master/rfcs/2022-04-09-accessibility.md#manual-testing)

> If you are not familiar with using screen reader you can [follow this guide](https://dequeuniversity.com/tips/learn-voiceover),
> And also ask for manual reviews from Anurag or Abinash.

