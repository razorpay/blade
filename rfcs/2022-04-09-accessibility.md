---
Start Date: 08-04-2022
RFC PR: (leave this empty if no PR yet)
Blade Issue: (leave this empty if no issue yet)
---

# Blade Accessibility <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->
- [Summary](#summary)
- [Motivation](#motivation)
- [Detailed Design](#detailed-design)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)
- [References](#references)

# Summary


## What is Accessibility?

Accessibility is the practice of making websites usable by people of all abilities and disabilities.   
This includes people with visual, auditory, physical, and cognitive impairments, as well as those with temporary disabilities such as broken bones, color blindness, and temporary loss of vision, but the practice of making sites accessible also benefits other groups such as people using mobile phones, people with temporary disabilities, situational limitations.

## Accessibility for who? 

Accessibility is essential for some, useful for all.  
It's not just for people with disabilities, accessible websites also improve the user experience of normal users. 

For example:  

- Prodiving captions for a video can benefit users who watch videos in loud environments or in a library. 
- Sufficient color contrast is good for different lighting conditions and people with visual impairments.
- Older people with changing abilities due to ageing can benefit from accessible experiences. 
- Good layouts and design helps users with cognitive disabilities but also people who are unconfident with technology or old aged people.
- Large buttons and links helps people with reduced dexterity but also improves user experience of mobile devices.
- Ensuring keyboard accessibility helps people with temporary/permanent mobility but also improves experience for normal users by providing better user experience for components like Select or Modals. 

> Check out this youtube [video about Web Accessibility Perspectives](https://www.youtube.com/watch?v=3f31oufqFSM) by W3C for more details about how accessibility can help wide range of people with or without disabilities.

## Various types disabilities

- **Visual:**  
  Anything that deals with sight, eg: people who have different types of sight like color blindness.
- **Cognitive:**  
  Concentration, memory, judgment, problem solving, logic skills.
- **Mobility:**  
  Anything that affects movement in a body.
- **Auditory:**  
  Disabilities related to sound or audio.

Other subcategories based on [microsoft’s inclusive design](https://www.microsoft.com/design/inclusive):  

- **Permanent or disability that does not go away:**:   
  - Example: Someone who is deaf
- **Temporary, disability that will go away in time:**: 
  - Example: Someone who has an ear infection
- **Situational, Context based disabilities:**: 
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
- Why are we doing this?
- What use cases does it support?
- What is the expected outcome?

## Why are we doing this? 

Without proper accessibility, certain functionality used in web sites is not available to some users with disabilities, especially people who rely on screen readers and people who cannot use a mouse. 

Making our products accessible is important for two reasons.  
- it's the right thing to do. We believe that everyone deserves to be able to use our products, regardless of their abilities.
- It'll help build trust with our customers. By making our products accessible, we can expand our potential customer base and make our products more appealing to a wider range of people. 

> [The Business Case Study for Accessibility](https://www.w3.org/WAI/business-case/)

**Making customers happy & respecting human rights:**  

> In 2020, A 29 year old banker who is visually impaired opened petitions to make [zomato](https://www.change.org/p/zomato-make-zomato-accessible-with-screen-readers-for-visually-challenged-people) & [swiggy](https://www.change.org/p/swiggy-make-swiggy-accessible-with-screen-readers-in-android-for-visually-challenged-people) accessible because they couldn’t order food from it due to their inaccessible apps.  
> Over **15,000 & 27,000 people had signed the petition.**  
> Later zomato, swiggy listened to the people and [improved their accessibility.](https://theprint.in/tech/why-the-visually-challenged-are-signing-petitions-addressed-to-apps-such-as-zomato-swiggy/507282/) 

**Accessibility laws & policies** 

While in India, there's no mandatory law to building accessible web apps, 
There's still [policies/laws](https://www.w3.org/WAI/policies/india/) which are passed to ensure rights of disabled people remains intact.

- [Rights of Persons with Disabilities Act, 2016 (RPD)](https://legislative.gov.in/sites/default/files/A2016-49_1.pdf)
- [**Mandatory** Guidelines for Indian Government Websites](https://guidelines.india.gov.in/)

## The current state  

In the current state, blade components are not very accessible out of the box, and neither are our existing frontend products. 

Here’s the screen reader accessibility of Razorpay mobile app

- Missing accessibilityLabel in input box.
- Missing accessibilityRole=button in buttons
- Missing accessibilityRole=link in links
- Grouping text together so they get announced at once.
- Unlabeled password toggle icon 
- Wrongly focus on text input's placeholder text

https://user-images.githubusercontent.com/35374649/167380507-71e60b7f-d36e-42b3-b649-911400e2c66f.mp4

Even though only a few of the teams are on boarded to blade, when more teams will migrate this will become a problem since every app/site will be inaccessible if we don’t implement accessibility in blade components. 

Adding accessible components to blade will iron out all these inconsistencies and teams can build more accessible apps with minimal effort.

## What is the expected outcome? 

The goal of this RFC is to lay the foundations so that we can ship blade components that are accessible out of the box such that consumers don't have to worry about every minute detail. Here are couple of areas that this RFC will touch upon: 

- Research about cross platform accessibility between web and native.
- Ensure components are accessible through assistive technologies.
- Ensure components adhere to the [WAI-ARIA design patterns](https://www.w3.org/TR/wai-aria-practices-1.2/)
- Set accessibility guidelines to make sure products built with blade are accessible by people with various disabilities. 
- Document the component development lifecycle for blade developers on building accessible components. (Similar to a checklist)

By baking in accessibility at the foundational level we will ensure our products are accessible to as many people as possible, and this includes people with disabilities.

# Detailed Design

## Scope 

- Web
  - Keyboard accessibility
    - [General navigation](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_generalnav)
    - [Navigation inside components](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_general_within)
  - Focus management
    - [Focus order](https://www.w3.org/WAI/WCAG21/Understanding/focus-order)
    - [Focus trap](https://github.com/focus-trap/focus-trap)
    - [Focus ring](https://react-spectrum.adobe.com/react-aria/FocusRing.html)
    - [Focus zone / roving index](https://reakit.io/docs/composite/)
  - Screen reader support
    - Cross platform solution to aria attributes
    - Implement WAI-ARIA [design patterns](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion)
- Native
  - Focus management
    - [Focus trap](https://github.com/focus-trap/focus-trap)
  - Screen reader support
    - Cross platform solution to aria attributes
    - Implement WAI-ARIA [design patterns](https://www.w3.org/TR/wai-aria-practices-1.1/#accordion)
- A11y testing
    - Static analysis
    - Jest unit tests
    - Manual testing
- Guidelines
  - General web accessibility guidelines

## Out of scope

- [Motion](https://github.com/razorpay/blade/blob/master/rfcs/2022-03-22-motion-rfc.md)  
  We will pick up motion accessibility at a later point, we are first prioritizing foundations.

## Keyboard Accessibility

> [Specification](https://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation.html)

**Target:** Everyone and especially people with motor disabilities who use a keyboard to navigate.  
**Goal:** Ensure users who cannot use the mouse (blind, motor disabilities) can access the crucial parts of the app through keyboard.  

For a web page to be accessible, all interactive elements must be operable via the keyboard, Not all users are able to use a mouse to navigate a web page, Keyboard-only and screen reader users rely on navigating and using a web page with only a keyboard. 

### Areas to cover

- [Keyboard tab order](https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation-order)
- [Using tabindex](https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute)
- [Skip navigation](https://html.spec.whatwg.org/multipage/interaction.html#the-tabindex-attribute)
- [Composite widgets](https://www.w3.org/TR/wai-aria-1.2/#composite)
  - [Roving tabindex pattern](https://www.w3.org/TR/wai-aria-practices/#kbd_roving_tabindex)
  - [aria-activedescendant pattern (skipped in implementation)](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant)

## Keyboard tab order

> [Specification](https://www.w3.org/WAI/WCAG21/quickref/#focus-order)

Tab order is important for proper navigation through a keyboard interface. 
The tab order of the page must be logical and follow the visual order of elements on the page.

**Best practices for logical tab order:**

- Structure html so that the reading/navigation [order is correct](https://www.w3.org/WAI/WCAG21/Techniques/css/C27).
- If necessary, use CSS to control the visual presentation of the elements on the page.
- [Avoid using tabindex](https://www.w3.org/WAI/WCAG21/Techniques/failures/F44) values of 1 or greater to change the default keyboard navigation order.

## Using tabindex

`tabindex` attribute authors can make the element focusable and appear in [sequential focus order](https://html.spec.whatwg.org/multipage/interaction.html#sequential-focus-navigation)

Setting tabindex to any non-negative integer makes elements focusable, allow or prevent them from being sequentially focusable, and determine their relative ordering

When set to `0`, the element becomes focusable by keyboard and via programatic means with `focus()`. 
When set to `-1`, the element becomes focusable programatically, but it does not become part of the keyboard focus order.

The following table describes tabindex behavior in modern browsers:

| tabindex attribute |	Focusable with mouse or programatically |	Tab navigable |
| :-- | :-- | :-- |
| not present	| The user agent will decide | The user agent will decide |
| Negative (tabindex="-1")	| Yes | No, can only be focused programatically |
| Zero (tabindex="0") | Yes | Yes, In tab order relative to element's position in document | 
| Positive (tabindex="2") | Yes | Yes, tabindex value determines where this element is positioned in the tab order | 

> Warning: avoid using positive values for tabindex. Using positive values means authors will have to set (and maintain) tabindex values for all focusable elements on the page whenever they use one or more positive values for tabindex.  

> *[Failure of Success Criterion 2.4.3](https://www.w3.org/WAI/WCAG21/Techniques/failures/F44) due to using tabindex to create a tab order that does not preserve meaning and operability*


## Skip navigations

> [Specification](https://www.w3.org/TR/2013/NOTE-WCAG20-TECHS-20130905/G1)

A skip navigation link provides a way for keyboard and screen reader users to skip to main content of a webpage.  
Without skip links, keyboard and screen reader users must navigate a long list of navigation links and other elements before ever arriving at the main content, This can be particularly difficult for users with some forms of motor disabilities.

**Temporarily hidden skip links**

Most common type of skip links are which that is hidden until the user navigates to it with a keyboard.

The link must be:

- Hidden by default
- Accessible to keyboard navigation
- Visible when it is focused
- Set focus to the main content area when activated

### Implementations

Skip nav implementations are fairly simple: 

> [Live Demo](https://stackblitz.com/edit/react-ts-nnnymu?file=App.tsx)

```html
<body>
  <a class='skip-link' href='#main-content'>
    Skip Navigation or Skip to Content
  </a>
  <main id='main-content'>
    Content here
  </main>
</body>
```

The `skip-link` class here is a screen reader only [visually hidden](https://webaim.org/techniques/css/invisiblecontent/) class, which is only accessible through screen readers. By using the `:focus` pesudo class it becomes visible when focused.

- [ReachUI SkipNav](https://reach.tech/skip-nav/)
- [ChakraUI SkipNav](https://chakra-ui.com/docs/components/navigation/skip-nav)

## Composite widgets

*What are composite widgets?*

A composite is a widget that may contain navigable descendants or childrens. Composite widgets should only have single navigation tab stop.
Once the composite widget has focus, It's required to provide a separate navigation mechanism for users to navigate to elements that are descendants (generally with arrow keys).

You can think of composite widgets as a way of grouping multiple elements into single navigatable element.

Examples of composite widgets are: 

- Radio Groups
- Tabs
- Listbox
- Toolbars

## Roving Tabindex

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

# Drawbacks/Constraints
Why should we *not* do this? Maybe try to consider the following constraints
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
