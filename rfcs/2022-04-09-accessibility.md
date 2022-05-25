---
Start Date: 08-04-2022
RFC PR: (leave this empty if no PR yet)
Blade Issue: (leave this empty if no issue yet)
---

# Blade Accessibility <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->

- [Summary](#summary)
  - [What is Accessibility?](#what-is-accessibility)
  - [Accessibility for whom?](#accessibility-for-whom)
  - [Various types of disabilities](#various-types-of-disabilities)
  - [Accessibility Principles](#accessibility-principles)
- [Motivation](#motivation)
  - [Why are we doing this?](#why-are-we-doing-this)
  - [The current state](#the-current-state)
  - [What is the expected outcome?](#what-is-the-expected-outcome)
- [Detailed Design](#detailed-design)
  - [Keyboard Accessibility](#keyboard-accessibility)
    - [Keyboard tab order](#keyboard-tab-order)
    - [Composite widgets](#composite-widgets)
      - [Roving Tabindex](#roving-tabindex)
    - [Skip navigations](#skip-navigations)
    - [Manual Testing](#manual-testing)
  - [Focus management](#focus-management)
    - [Focus order](#focus-order)
    - [Focus ring styling](#focus-ring-styling)
    - [Focus trap](#focus-trap)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)
- [References](#references)


# Summary

## What is Accessibility?

Accessibility is the practice of making websites usable by people of all abilities and disabilities. This includes people with visual, auditory, physical, and cognitive impairments, as well as those with temporary disabilities such as broken bones, color blindness, and temporary loss of vision.

## Accessibility for whom?

Accessibility is essential for some, useful for all. It's not just for people with disabilities, accessible websites also improve the user experience of normal users.

For example:

- Ensuring keyboard accessibility helps people with temporary/permanent mobility but also improves the experience for normal users by providing a better user experience for components like Select or Modals.
- Large buttons and links helps people with reduced dexterity but also improve the user experience of mobile devices.
- Providing captions for a video can benefit users who watch videos in loud environments or in a library.
- Sufficient color contrast is good for different lighting conditions and people with visual impairments.
- Older people with changing abilities due to aging can benefit from accessible experiences.

> Check out this youtube [video about Web Accessibility Perspectives](https://www.youtube.com/watch?v=3f31oufqFSM) by W3C for more details about how accessibility can help wide range of people with or without disabilities.

## Various types of disabilities

- **Visual:**  
  Anything that deals with sight, eg: people who have different types of sight like color blindness.
- **Cognitive:**  
  Difficulties with concentration, memory, judgment, problem solving, eg: older people with changing abilities.
- **Mobility:**  
  Anything that affects physical movement, eg: broken/missing arm.
- **Auditory:**  
  Disabilities related to sound or audio, eg: someone who is deaf.

Other subcategories based on [Microsoft’s inclusive design](https://www.microsoft.com/design/inclusive):

- **Permanent, disability that does not go away:**
  - Example: Someone who is deaf
- **Temporary, disability that will go away in time:**
  - Example: Someone who has an ear infection
- **Situational, Context based disabilities:**
  - Example: Someone who is at a loud sporting event
  - Example: Using the web app in bright sunlight
  - Example: Using your phone one handedly in a crowded metro station  

<img src="./images/accessibility/ms-inclusive-design.png" alt="Microsoft Inclusive Design Shows Spectrum Of Disabilities" width="25%" />

## Accessibility Principles

According to [Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) or WCAG, Web contents should be:

**Perceivable**

- Provide text alternatives for non-text content.
- Provide captions and other alternatives for multimedia.
- Create content that can be presented in different ways, including by assistive technologies, without losing meaning.
- Make it easier for users to see and hear content.

**Operable**

- Make all functionality available from a keyboard.
- Give users enough time to read and use content.
- Do not use content that causes seizures or physical reactions.
- Help users navigate and find content.
- Make it easier to use inputs other than keyboard.

**Understandable**

- Make text readable and understandable.
- Make content appear and operate in predictable ways.
- Help users avoid and correct mistakes.

**Robust**

- Maximize compatibility with current and future user tools.

# Motivation

## Why are we doing this?

Without proper accessibility, certain functionality used in web sites is not available to some users with disabilities, especially people who rely on screen readers and people who cannot use a mouse.

Making our products accessible is important for two reasons.

- It's the right thing to do. We believe that everyone deserves to be able to use our products, regardless of their abilities.
- It'll help build trust with our customers. By making our products accessible, we can expand our potential customer base and make our products more appealing to a wider range of people.

> [The Business Case Study for Accessibility](https://www.w3.org/WAI/business-case/)

**Making customers happy & respecting human rights:**

> In 2020, A 29 year old banker who is visually impaired opened petitions to make [Zomato](https://www.change.org/p/zomato-make-zomato-accessible-with-screen-readers-for-visually-challenged-people) & [Swiggy](https://www.change.org/p/swiggy-make-swiggy-accessible-with-screen-readers-in-android-for-visually-challenged-people) accessible because they couldn’t order food from it due to their inaccessible apps.  
> Over **15,000 & 27,000 people had signed the petition.**  
> Later Zomato, Swiggy listened to the people and [improved their accessibility.](https://theprint.in/tech/why-the-visually-challenged-are-signing-petitions-addressed-to-apps-such-as-zomato-swiggy/507282/)

**Accessibility laws & policies**

While in India, there are no mandatory laws to build accessible web apps, there are still [policies/laws](https://www.w3.org/WAI/policies/india/) that are passed to ensure that the rights of disabled people remain intact.

- [Rights of Persons with Disabilities Act, 2016 (RPD)](https://legislative.gov.in/sites/default/files/A2016-49_1.pdf)
- [**Mandatory** Guidelines for Indian Government Websites](https://guidelines.india.gov.in/)

## The current state

In the current state, blade components are not very accessible out of the box, and neither are our existing frontend products.

Here’s the screen reader accessibility of Razorpay mobile app

- Missing `accessibilityLabel` in input box.
- Missing `accessibilityRole=button` in buttons
- Missing `accessibilityRole=link` in links
- Grouping text together so they get announced at once. eg: "Don't have an account? Sign Up"
- Unlabeled show password toggle icon
- Wrongly focus on text input's placeholder text

https://user-images.githubusercontent.com/35374649/167380507-71e60b7f-d36e-42b3-b649-911400e2c66f.mp4

Adding accessible components to blade will iron out all these inconsistencies and teams can build more accessible apps with minimal effort.

## What is the expected outcome?

The goal of this RFC is to lay the foundations so that we can ship accessible components out of the box so that consumers don't have to worry about every minute detail. Here are couple of areas that this RFC will touch upon:

- Research about cross platform accessibility between web and native.
- Ensure components are accessible through assistive technologies.
- Ensure components adhere to the [WAI-ARIA design patterns](https://www.w3.org/TR/wai-aria-practices-1.2/)
- Set accessibility guidelines to make sure products built with blade are accessible by people with various disabilities.
- Document the component development lifecycle for blade developers on building accessible components. (Similar to a checklist)

By baking in accessibility at the foundational level we will ensure our products are accessible to as many people as possible, and this includes people with disabilities.

# Detailed Design

## Keyboard Accessibility

> [Specification](https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation.html)

**Accessibility Principal:** Operable  
**Target:** Everyone and especially people with motor disabilities who use a keyboard to navigate.  
**Goal:** Ensure users who cannot use the mouse (blind, motor disabilities) can access the crucial parts of the app through keyboard.

For a web page to be accessible, all interactive elements must be operable via the keyboard. Not all users are able to use a mouse to navigate a web page, keyboard-only and screen reader users rely on navigating and using a web page with a physical or a virtual keyboard.

### Areas to cover <!-- omit in toc -->

- [Keyboard tab order](#keyboard-tab-order)
  - [Platform Specific Implementation](#platform-specific-implementation----omit-in-toc)
- [Composite widgets](#composite-widgets)
  - [Roving Tabindex](#roving-tabindex)
    - [Platform Specific Implementation](#platform-specific-implementation----omit-in-toc-1)
- [Skip navigations](#skip-navigations)
  - [Platform Specific Implementation](#platform-specific-implementation----omit-in-toc-2)
- [Manual Testing](#manual-testing)

### Keyboard tab order

> [Specification](https://www.w3.org/WAI/WCAG21/quickref/#focus-order)

Tab order is important for proper navigation through a keyboard interface.
The tab order of the page must be logical and follow the visual order of elements on the page.

#### Best practices for logical tab order: <!-- omit in toc -->

- Structure html so that the reading/navigation [order is correct](https://www.w3.org/WAI/WCAG21/Techniques/css/C27).
- If necessary, use CSS to control the visual presentation of the elements on the page.
- [Avoid using tabindex](https://www.w3.org/WAI/WCAG21/Techniques/failures/F44) values of 1 or greater to change the default keyboard navigation order.

#### Platform Specific Implementation <!-- omit in toc -->

**Web: Using `tabindex`**

`tabindex` attribute authors can make the element focusable and appear in [sequential focus order](https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation)

Setting tabindex to any positive integer makes elements focusable, allow or prevent them from being sequentially focusable, and determine their relative ordering

When set to `0`, the element becomes focusable by keyboard and via programmatic means with `focus()`.
When set to `-1`, the element becomes focusable programmatically, but it does not become part of the keyboard focus order.

The following table describes tabindex behavior in modern browsers:

| tabindex attribute       | Focusable with mouse or programmatically | Tab navigable                                                                    |
| :----------------------- | :--------------------------------------- | :------------------------------------------------------------------------------- |
| not present              | The user agent will decide               | The user agent will decide                                                       |
| Negative (tabindex="-1") | Yes                                      | No, can only be focused programmatically                                         |
| Zero (tabindex="0")      | Yes                                      | Yes, In tab order relative to element's position in document                     |
| Positive (tabindex="2")  | Yes                                      | Yes, tabindex value determines where this element is positioned in the tab order |

> Warning: Avoid using positive values for tabindex. Using positive values means authors will have to set (and maintain) tabindex values for all focusable elements on the page whenever they use one or more positive values for tabindex.

> _[Failure of Success Criterion 2.4.3](https://www.w3.org/WAI/WCAG21/Techniques/failures/F44) due to using tabindex to create a tab order that does not preserve meaning and operability_

**Native: Using `accessible` prop**

In react-native there is no `tabindex` like behaviour for components, instead we have access to the [`accessible`](https://reactnative.dev/docs/accessibility#accessible) prop, setting `accessible` to true elements get grouped into a single selectable component.

### Composite widgets

A composite is a widget that may contain navigable descendants or childrens. Composite widgets should only have single navigation tab stop.
Once the composite widget has focus, it should provide for a separate navigation mechanism for users to navigate to elements that are descendants (generally with arrow keys).

You can think of composite widgets as a way of grouping multiple elements into single navigatable element.

Examples of composite widgets are:

- Radio Groups
- Tabs
- Listbox
- Toolbars

#### Roving Tabindex

> [Specification](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex)

One way to manage focus within `composite` widgets is roving tabindex pattern.  
The element that is to be included in the tab sequence has tabindex of "0" and all other focusable elements contained in the composite have tabindex of "-1".

**Roving tabindex behaviour**:

- When the component loads, the element that will initially be included in the tab sequence will have `tabindex=0`, and all other focusable elements will have `tabindex=-1`.
- At a time only one children will have `tabindex=0` set and all other focusable elements will have `tabindex=-1`.
- When the component contains focus and the user presses a navigation key that moves focus within the component (eg: arrow keys)
  - set `tabindex=-1` on the element that has `tabindex=0`.
  - Set `tabindex=0` on the element that will become focused as a result of the key event.
  - Set focus with `element.focus()`, on the element that has `tabindex=0`.

**Roving tabindex keyboard accessibility**

- Pressing <kbd>↑</kbd> moves focus to the previous element if orientation is vertical or not defined.
- Pressing <kbd>↓</kbd> moves focus to the next element if orientation is vertical or not defined.
- Pressing <kbd>→</kbd> moves focus to the next element if orientation is horizontal or not defined.
- Pressing <kbd>←</kbd> moves focus to the previous element if orientation is horizontal or not defined.
- Pressing <kbd>Home</kbd> or <kbd>PageUp</kbd> moves focus to the first element.
- Pressing <kbd>End</kbd> or <kbd>PageDown</kbd> moves focus to the last element.

https://user-images.githubusercontent.com/35374649/170195582-85cb688a-8e10-42de-9154-420d5c8873ad.mov

#### Platform Specific Implementation <!-- omit in toc -->

**Web:**

There are various third party library implementations for roving tabindex pattern.

We tried out 3 of them to understand the pros and cons for each and decided on X.

**FluentUI** - [Demo](https://codesandbox.io/s/blade-comp-fluentui-focuszone-0sjyv1?file=/src/App.tsx) | [Doc](https://developer.microsoft.com/en-us/fluentui#/controls/web/focuszone)

<details>
  <summary>Pros and cons</summary>

**Bundle size:** ~12kb

**Pros:**

- Easy to use
- Handles roving index by default
- Can handle nested focus zones
- Provides tabbable focus, means we can enable use of tab + arrow keys
- Support layout grid behavior (we might not need this)

**Cons:**

- Not much flexibility to write our own logic, doesn’t provide any focus manager
- Doesn’t provide any other utilities like focus trap, we need to install another package for it `@fluentui/react/lib/focusZoneTrap`
- FluentUI’s architecture is very complex & confusing because of their need to be cross platform, If we pick this up we might not be able to use their other components to our advantage. Plus their components are not headless.

</details>

**React Aria** - [Demo](https://codesandbox.io/s/blade-comp-react-aria-focus-2v9wtp?file=/src/App.tsx) | [Doc](https://react-spectrum.adobe.com/react-aria/FocusScope.html)

<details>
  <summary>Pros and cons</summary>

**Bundle size:** ~12kb

ReactAria’s behavior is very different from fluentui, it’s FocusScope doesn’t provide roving index behavior instead it’s like a focus trap. Which is equivalent to FluentUI’s FocusTrapZone

Although ReactAria does provides low level primitives to manage focus like `useFocusManager`

**Pros:**

- Provides other helpful features with it’s focus package, which makes it worth the bundle size compared to other solutions, with other libs we will have to look for alternatives for:
  - [FocusScope](https://react-spectrum.adobe.com/react-aria/FocusRing.html) (Trapping focus)
  - [FocusRing](https://react-spectrum.adobe.com/react-aria/FocusRing.html)
  - [useFocusRing](https://react-spectrum.adobe.com/react-aria/useFocusRing.html)
- Provides low level primitives for building roving index like behaviors, eg: useFocusManager, getFocusableTreeWalker, createFocusManager
- Picking react aria will also encourage use of react-native-aria & the eco system of react aria.

**Cons:**

- Doesn’t provide roving index behavior by default
- A lot of manual logic and code has to be written to implement a proper Roving index component which handles edge cases,
- The implementation in the codesandbox has various bugs & edge cases, for eg: initially the elements don't have tabIndex set, these kinds of edge cases we need to solve for.

</details>

**Ariakit** - [Demo](https://codesandbox.io/s/blade-comp-ariakit-composite-ewc9i4?file=/src/App.tsx) | [Doc](https://reakit.io/docs/composite/)

<details>
  <summary>Pros and cons</summary>

Ariakit is the only out of the three which properly implements the composite widget specification.
It even supports virtual focus with aria-activedescendant. It’s the most complete implementation.

**Bundle size:** ~15kb tree shakable depending on which features we use

**Pros:**

- Easy to use
- Most spec compliant and holistic implementation
- Very flexible with its hooks based architecture. Composition is ariakit’s best selling point
- Lots of other features, like [composite groups, typeahead, input, hover, separator](https://github.com/ariakit/ariakit/tree/main/packages/ariakit/src/composite)
- [Supports 2d navigation](https://reakit.io/docs/composite/#two-dimensional-navigation) same as FluentUI
- Support virtual focus + roving index. ++respect!
- Ariakit also provides primitives and utilities like useFocusTrap & useFocusable, although they will increase the bundle size further

**Cons:**

- The biggest issue with ariakit is that it’s not stable yet :(  
  So ariakit is the successor to reakit, Haz has been developing it for over 4 years now.
  But as the doc says ariakit is better but still the API is not stable and can have breaking changes
- The new version of ariakit lacks documentation
- No separate package scope for their focus utilities, we will have to rely on treeshaking to be able to shave all other unnecessary components.

</details>

**Native:**

For native we are scoping out keyboard accessibility, because it will only be effective in scenarios when using a hardware keyboard. We will revisit this once we have usecases for it.

#### aria-activedescendant <!-- omit in toc -->

> [Specification](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant)

Skipping implementation for now, since this pattern is useful only in very specific usecases like a Combobox component where the input needs to be focused and the list items needs virtual focus.

### Skip navigations

> [Specification](https://www.w3.org/TR/2013/NOTE-WCAG20-TECHS-20130905/G1)

A skip navigation link provides a way for keyboard and screen reader users to skip to main content of a webpage.  
Without skip links, keyboard and screen reader users must navigate a long list of navigation links and other elements before ever arriving at the main content. This can be particularly difficult for users with some forms of motor disabilities.

**Temporarily hidden skip links**

Most common type of skip links are the ones that are hidden until the user navigates to it with a keyboard.

The link must be:

- Hidden by default
- Accessible to keyboard navigation
- Visible when it is focused
- Set focus to the main content area when activated

https://user-images.githubusercontent.com/35374649/170200270-ba39b749-83ab-45ce-8629-30a366521cda.mov

#### Platform Specific Implementation <!-- omit in toc -->

**Web:**

Skip nav implementations are fairly simple:

> [Live Demo](https://stackblitz.com/edit/react-ts-nnnymu?file=App.tsx)

```html
<body>
  <a class="skip-link" href="#main-content"> Skip Navigation or Skip to Content </a>
  <main id="main-content">Content here</main>
</body>
```

The `skip-link` class here is a screen reader only [visually hidden](https://webaim.org/techniques/css/invisiblecontent/) class, which is only accessible through screen readers. By using the `:focus` pesudo class it becomes visible when focused.

- [ReachUI SkipNav](https://reach.tech/skip-nav/)
- [ChakraUI SkipNav](https://chakra-ui.com/docs/components/navigation/skip-nav)

**Native:**

In native we usually don't need skip navigations since the navigation menus are smaller in mobile devices due to less screen real estate, and most of the nav items are hidden inside drawers and menus.

### Manual Testing

To make sure all functionality can be operated through a keyboard or assistive technology we need to do manual testing, This can also be automated but generally it's better to do one round of manual testing.

Checklist:

- Do all the interactive elements in the page are:
  - Navigatable through keyboard? ([Success Criterion](https://www.w3.org/WAI/WCAG21/Techniques/general/G202))
  - Actions can be triggered by keyboard? ([Failure of Success Criterion](https://www.w3.org/WAI/WCAG21/Techniques/failures/F54.html))
  - Remains focused until user moves it? ([Failure of Success Criterion](https://www.w3.org/WAI/WCAG21/Techniques/failures/F55.html))
- Does the tab order match the logical reading order of the page? ([Failure of Success Criterion](https://www.w3.org/WAI/WCAG21/Techniques/failures/F44.html))
- Focus visible ([Failure Of Success Criterion](https://www.w3.org/WAI/WCAG21/Techniques/failures/F78.html))
  - Do all keyboard interactive elements display visual keyboard focus?
  - Is the visual keyboard focus easy to identify?
- During the navigation, are there any instances when you become trapped in an element? ([Failure of Success Criterion](https://www.w3.org/WAI/WCAG21/Techniques/failures/F10.html))
- Make sure hidden popuops or titles are accessible through keyboard.

## Focus management

> Specification

**Accessibility Principal:** Perceivable, Operable  
**Target:** Everyone, especially people with visual impairments or cognitive limitations & motor disabilities.  
**Goal:** Setting guidelines for general focus behaviours & providing screen reader & keyboard users a smooth experience by managing focus behavior for certain elements like Modals/Page transition etc.

Well-planned focus management is important to ensuring a comfortable user experience & to guide the user through the intended flow of the app.

Focus management goes hand in hand with keyboard accessibility, so there will be interoperability between the two.

### Areas to cover <!-- omit in toc -->

- [Focus order](#focus-order)
- [Focus ring styling](#focus-ring-styling)
  - [Platform Specific Implementation](#platform-specific-implementation----omit-in-toc-3)
- [Focus trap](#focus-trap)
  - [Platform Specific Implementation](#platform-specific-implementation----omit-in-toc-4)

### Focus order

We have already covered focus order or tab order in the [keyboard tab order section](#keyboard-tab-order)

### Focus ring styling

The focus ring must be visible to all users.  
By default, the browser uses the user agent specific focus styling. But this behaviour can be overriden with CSS.

#### Best practices for focus styling: <!-- omit in toc -->

- Provide focus styles that are highly visible.
- Make sure that a visible element has focus at all times when using a keyboard.
- Avoid using `*:focus { outline: none }` snippet to hide focus
- Design focus rings such that it has proper contrast

> Not providing visible focus ring is [Failure of Success Criterion 2.4.7](https://www.w3.org/WAI/WCAG21/Techniques/failures/F78)

**Keyboard only focus rings**

While focus indicators are neccesary, mouse clicks also change the focus, for example clicking on a button also makes the focus ring visible.

This behavior can be undesirable from design perspective, preferring focus styling to only be present only if a keyboard is used can be a solution.

https://user-images.githubusercontent.com/35374649/170203071-5688c459-64fc-4435-860d-fc17b6d26393.mov

#### Platform Specific Implementation <!-- omit in toc -->

**Web:**

- CSS
- ReactAria

**CSS:**

> [Demo](https://codesandbox.io/s/blade-a11y-css-focus-ring-051xff?file=/src/App.tsx)

CSS provides us with a pesudo class called [`:focus-visible`](https://css-tricks.com/keyboard-only-focus-styles). Browser support for focus-visible is [good enough](https://caniuse.com/?search=%3Afocus-visible).  
And we can also use the [official pollyfill](https://github.com/WICG/focus-visible) for older browsers.

**ReactAria:**

> [Demo](https://codesandbox.io/s/blade-a11y-reactaria-focus-ring-hc3cub?file=/src/App.tsx)

ReactAria provides a [FocusRing](https://react-spectrum.adobe.com/react-aria/FocusRing.html) component which solves this.

While this works great, this solution can be a bit of an overkill since ReactAria does this all with JavaScript and has its own event handling system.  
I think it will be better and easier if we stick to `:focus-visible` CSS property which is becoming standard in browser & a platform feature.

**Native:**

In native we don't need to handle focus-visible since the focus will only be visible when the screen reader is open.

### Focus trap

Trapping focus is a behaviour we usually want when there is modality in a page.

**Why focus traps?**

Focus traps are essential to communicate a modal's bounds to people who are visually impaired or have mobility issues, and it helps inform them what is and is not contained within a modal.

The idea is that if for parts of the site where we prevent clicks, we should also prevent focus on the same elements.

- People with low vision who rely on screen readers need to know when the modal opens.
- People with low vision who cannot properly see the focus ring can get lost if focus isn't contained in the modal, this can be confusing and disorienting.
- People with mobility issues using keyboard could tab out of the modal and have a hard time getting back into the modal.

#### Best practices for focus traps: <!-- omit in toc -->

- Ensure users don't get permanently trapped in the focus trap, If the user can open the modal with keyboard, they should also have the ability to exit the modal with keyboard.
- The focus should loop when reaching the last or first element inside modal.
- Convey the intent to screen reader users that there is a context switch, and they are now in a modal or in a focus trapped state.


https://user-images.githubusercontent.com/35374649/170202482-b9af775d-4622-4b88-bda5-a4fa91395764.mov


#### Platform Specific Implementation <!-- omit in toc -->

**Web:**

- [HTML `inert` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert)
- [ReactAria FocusScope](https://react-spectrum.adobe.com/react-aria/FocusScope.html)

**Inert**

> [Demo](https://lx5rik.csb.app/)

In the [HTML spec](https://github.com/WICG/inert/blob/main/explainer.md) there's a new proposal/property `inert`, when present, makes the browser "ignore" user input events for the element, including focus events and events from assistive technologies. This can be used for focus trapping.

Downsides of inert:

- Browser [support is very bad](https://caniuse.com/?search=inert), only works on modern browsers under experimental flag
- Polyfill is [expensive performance-wise](https://github.com/WICG/inert#performance-and-gotchas)
  Although the browser support for it is very bad, and we will need the [polyfill](https://github.com/WICG/inert).
- Won't handle other edge cases like focus restoration.

**ReactAria**

> [Demo](https://codesandbox.io/s/blade-a11y-reactaria-focustrap-6z537u?file=/src/App.tsx)

ReactAria's `FocusScope` component is a fully fledged solution with other edge cases handled for us.

It also handles:

- Focus restoration to trigger
- Auto focusing to children elements

Considering the `inert` attribute is not supported in major browsers & we will have to write custom logic to handle other edge cases, it's better to use the ReactAria's component in this case.

**Native:**

To simulate `inert` behaviour in react-native we have platform specific accessibility props:

- For android: [`importantForAccessibility`](https://reactnative.dev/docs/accessibility#importantforaccessibility-android)
- For iOS: [`accessibilityViewIsModal`](https://reactnative.dev/docs/accessibility#accessibilityviewismodal-ios) & [`accessibilityElementsHidden`](https://reactnative.dev/docs/accessibility#accessibilityelementshidden-ios)

# Drawbacks/Constraints

Why should we _not_ do this? Maybe try to consider the following constraints

- Implementation cost, both in terms of code size and complexity.
- The impact of it on new as well as existing consumer projects.
- Cost of migration.

There are tradeoffs to choosing any path. Attempt to identify them here.

# Alternatives

What other designs/patterns/strategies have been considered?

# Adoption strategy

If we implement this proposal, how will existing consumer projects adopt it?

- Is this a breaking change?
- Can we write a codemod?
- How do we prioritise this with business and product folks?
- How do we communicate with other teams? Will updating docs suffice or do we need a dedicated interaction with them?

# How do we educate people?

- How should this be taught to other folks?
- What names and terminology work best for these concepts and why?
- How is this idea best presented?

# Open Questions

- Any open questions that you have?
- Any undiscovered areas that you have encountered?
- Any dependencies on other teams(Design/Engineering) that needs to be resolved upfront?

# References

Any references that you can share for those who are curious to understand anything beyond the scope of this RFC in general but related to the topic of this RFC.
