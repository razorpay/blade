---
Start Date: 04-01-2021
RFC PR: NA
Blade Issue: NA
---

# Title of the RFC <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->
- [Summary](#summary)
- [Motivation](#motivation)
    - [Why are we doing this?](#why-are-we-doing-this)
    - [The current state](#the-current-state)
    - [What is the expected outcome?](#what-is-the-expected-outcome)
- [Detailed Design](#detailed-design)
  - [Proposed Structure](#proposed-structure)
    - [Object](#object)
    - [Base](#base)
    - [Modifier](#modifier)
      - [In a nutshell](#in-a-nutshell)
  - [**Principle: Flexibility or Specificity?**](#principle-flexibility-or-specificity)
  - [**Principle: Start Within, Then Promote Across Components**](#principle-start-within-then-promote-across-components)
  - [**Principle: Don’t Globalize Decisions Prematurely**](#principle-dont-globalize-decisions-prematurely)
  - [Principle: Theme ≠ Mode](#principle-theme--mode)
  - [**Order**](#order)
  - [**Polyhierarchy**](#polyhierarchy)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)
- [References](#references)

# Summary
This RFC discusses about the naming convention and strategies for tokens in our Design System. There are different types of tokens - global, local etc. and in order to build a scalable system we need to define some convention and strategies.

# Motivation
### Why are we doing this?
As our system is scaling we are seeing a lot of ambiguities about how to name certain things. Hence, this RFC will propose certain conventions that we need to set before going to build the components.

### The current state
Until now we don't have any naming framework or guidelines that defines how we shall name things. For eg:
>If I have to refer what's in their a `theme` object I've to manually lookup the structure of theme file and then identify that color is at the first level so I can access `theme.color.primary.800`

Similarly, If I need to add any new object inside theme I don't know what shall be the structure. For eg:
> If I have to add fontFamily as a token in the theme I don't know what structure shall I follow? `theme.fontFamily.name` or `theme.font.family.name` or `theme.typography.fontFamily` . All of them look correct at a first glance but the decision making becomes difficult.

There's no guideline or framework to decide the grouping criteria. What to group, how to group. For eg:
> Assume I've a Button component and I want to set the text color of a button when it's in hovered state. Now I don't know whether `Button.color.text.hover` is the right way or `Button.hover.color.text` is the right way

As you can see with the current system there are a lot of issues with the naming structure since there's no guideline or a framework because of which we can't establish a standard way of naming things and the consumers of this design system can't understand what they are accessing at what level and what value they'll get at a particular level. Because of this our token naming and accessing them becomes unpredictable.

### What is the expected outcome?
- A well defined naming framework that we can use to name and access tokens at any level in our design system.
- A structured system which makes accessing our tokens predictable.


# Detailed Design
Tokens are the core foundation of our design system since tokens are something

We'll discuss about the proposes structure in this section but before that let's look at some example and their issues in the current system:
1. If I have to refer what's in their a `theme` object I've to manually lookup the structure of the theme file and then identify that color is at the first level so I can access `theme.color.primary.800`
2. If I have to add `fontFamily` as a token in the theme I don't know what structure shall I follow? `theme.fontFamily.name` or `theme.font.family.name` or `theme.typography.fontFamily`. All of them look correct at a first glance but the decision making becomes difficult.
3. I've a Button component and I want to set the text color of a button when it's in hovered state. Now I don't know whether `Button.color.text.hover` is the right way or `Button.hover.color.text` is the right way.

It's quite evident that we need a system that's flexible and also specific. 

We need a well descriptive tokenized language that incorporates all these concerns and gives us a structure in a hierarchical manner. The language should be elaborative enough that accessing the tokens almost becomes self explanatory. This means we need to start defining some kind of groups.

## Proposed Structure
<!-- Create an image and add that here -->

The proposed grouping that will fit our use case would look something like `object.base.modifier`. Let's look at the breakdown for each of the group:

### Object
### Base
### Modifier

#### In a nutshell
- **Object** refers to
  1. **component** - `button`, `theme` etc.
  2. **sub-component** - one or more component within a component - `left-icon`, `right-icon` etc.
- **Base** refers to a token’s backbone that combines
  1. **category** - `color`, `space`, `size`, `font` etc.
  2. **behavior** - `action`, `feedback` etc.
  3. **property** - `size`, `weight`, `border` etc.
- **Modifier** refers to one or more of
  1. **variant** - `primary`, `secondary` etc.
  2. **state** - `hover`, `pressed`, `active` etc.
  3. **scale** - `100`, `200`, `1`, `2` etc.
  4. **mode** - `dark`, `light` etc.


Object<theme/component/sub-component(s)>.Base<category/behavior/property>.Modifier<variant/state/scale/mode>

document all the possible ways to create a token name
document the dont's in the naming

## **Principle: Flexibility or Specificity?**

Tokens like `$color-success` combine *category* (`color`) and *variant* (`success`) as a parsimonious identifier applicable to many scenarios. This leaves interpretation to the user to apply `$color-success` to any of `background`, `border` or `text`.

Flexibility comes at the expense of specificity and — by extension — potentially precision of application. A `success` color may only be intended for `text` or `background` but not both. Even more, an object reflecting `success` may require distinct colors for `text` versus `background` versus `border`. In this case, including a *property* level in a token results in a more specific yet less flexibly applied `$color-background-success` or `$color-text-success`.

## **Principle: Start Within, Then Promote Across Components**

The emergent practice of identifying candidates for and promoting token ideas from **local** to **global** locations is a healthy way to add tokens gradually.

## **Principle: Don’t Globalize Decisions Prematurely**

The shared need for a consistent form element border is predictable. Such elements are designed together, and these conventions emerge quickly.

Other cases aren’t as clear cut. Imagine working on tooltip, with popover and menu maybe to come later. A system *might* reuse shadows and notch roundedness, but can’t guarantee it. In this case, keep tooltip-specific tokens local to that component, and reference them later as work on popover or menu starts. This can avoid annoyingly subjective debates (“These are the `notched-layers`!”) and polluting a global namespace prematurely.

## Principle: Theme ≠ Mode

A theme may eventually require on-light, on-dark color applications. Marriott courtyard components may very well require light and dark modes just as much as Marriott renaissance components require. As a result, a theme is orthogonal to a color mode in systems using both concepts.

## **Order**

As evidenced in reviewing tokens across my projects and other public collections, there’s no prevailing token level order. As such, here are some patterns I’ve sensed hold steady:

- **Base** levels (*category*, *property*, *concept*) are a backbone in the middle.
- Levels within **Base** vary based on preferences for hierarchical strictness (`color-interactive-background`), readability (`interactive-background-color`), or keeping levels like *category* and *property* paired together (`color-background-interactive`).
- **Namespaces** (*system*, *theme*, *domain*) are prepended first.
- **Modifiers** (*variant*, *state*, *scale*, *mode*) tend to be appended last.
- **Object** levels (*component group*, *component*, and nested *element*) are subordinate to namespaces and establish context that can contain and therefore precede **base** and **modifier** levels.
- Order within **modifiers** isn’t consistent, although *mode* is often last (given its framing of “on” and use limited to only color and, even then, only when there’s a distinction).

While level order presented here is an option, it’s not the only option. Your system’s level order depends on what levels you use, what your system needs, and the discriminating tastes of each team member.

## **Polyhierarchy**

*Concept*, *category*, *variant* and other levels can overlap and compete. For example, an “error red” can be both *concept variant* `color-feedback-error` and *object* *variant* of `ui-controls-color-text-error` (included in packages for Input, Checkbox, Select, and other form controls). This forces us to decide:

> At what level(s) do I store this purposeful decision?Is it ok to store the same decision in two different locations?If purpose of two different choices is nearly identical, should it be 1 or 2 tokens?

Both `color-feedback` and `ui-controls-color-text` concepts have other variants (`warning`, `success`, `info` and `label`, `value`, and `helper-text`, respectively) for which `error` completes a set. Even if the actual red value is the same, I value the completeness of both sets. Therefore, I would consider aliasing one (the *object variant*) to the other (the *concept variant*).

```
$ui-controls-color-text-error = $color-feedback-error
                             (= $color-red-36)
                             (= #B90000)
```

This also hedges against the possibility that the `ui-controls-color-text-error` red could be adjusted later without impacting other uses of `color-feedback-error`, tracing a change to only those values fitting that purpose.

# Drawbacks/Constraints
Why should we *not* do this? Maybe try to consider the following constraints
- Implementation cost, both in terms of code size and complexity.
- The impact of it on new as well as existing consumer projects.
- Cost of migration.

There are tradeoffs to choosing any path. Attempt to identify them here.

# Alternatives
Mention Infor design system pattern
Just write object, property convention and how that lacks
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
- [Naming Tokens in Design Systems](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676)
- [Design Tokens](https://spectrum.adobe.com/page/design-tokens/)
- [Tokens in Design System](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)

Any references that you can share for those who are curious to understand anything beyond the scope of this RFC in general but related to the topic of this RFC.

