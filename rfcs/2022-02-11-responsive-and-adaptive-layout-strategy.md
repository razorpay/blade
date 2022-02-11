---
Start Date: 11-02-2022
RFC PR: (leave this empty if no PR yet)
Blade Issue: (leave this empty if no issue yet)
---

# Responsive and Adaptive Layout Strategy <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->

- [Summary](#summary)
- [Basic Example](#basic-example)
- [Motivation](#motivation)
    - [Why are we doing this?](#why-are-we-doing-this)
    - [What use cases does it support?](#what-use-cases-does-it-support)
    - [What is the expected outcome?](#what-is-the-expected-outcome)
- [Detailed Design](#detailed-design)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)
- [References](#references)

# Summary

To render content on different device screen resolutions there are different strategies

1. Responsive - Make the content fluid so it'll render based on the space available
2. Adaptive - Make content targeted for specific screen sizes so it'll render exactly like that regardless of the available space.

This RFC will focus on what approach and strategies we shall take in our Design System.

# Basic Example

<img alt="Responsive Modal" src="./images/responsive-adaptive-layout/responsive-modal.png">

<br/>

<img alt="Responsive Modal" src="./images/responsive-adaptive-layout/adaptive-search-field.png">

# Motivation

### Why are we doing this?

As of today, we don't have any strategy or approach in place for designing layouts for different screen sizes. Ensuring that elements fit within a page is not enough. There are different experiences that works for different screen sizes.

Just going Responsive(Fluid) Design blindly is not correct. Imagine for example, you have different experiences(styles, javascript) for mobile vs desktop but if you just go blindly with responsive we might be unnecessary downloading assets for all the screen sizes our application would run on.

Similarly, just going adaptive blindly is not correct too. We might unnecessary be creating redundant variant of the same component. For example, imagine that we are creating 2 variants of a modal - 1 for desktop(which has a width of `600px`) and 1 for mobile(which has `100%` width). Now we could have just made it responsive by setting the `maxWidth` property of the modal so it could have been `600px` in width on desktop and `100%` in width on mobile.

But because we don't have these strategies in place we don't know how to approach building layouts and components for different screen sizes.

### What use cases does it support?

- Handling responsiveness internally in the components based on different screen sizes.
- Layout components that will help you define different layouts based on screen sizes
- Rendering different variants of a component based on screen sizes, optimising for performance without bloating the bundlesize.

### What is the expected outcome?

We'll basically define the approach and strategy we'll be taking in Blade to build components that will address the concerns of rendering based on different screen sizes.

# Detailed Design

This is the bulk of the RFC. Explain the design in enough detail for somebody familiar with the Design System to understand, and for somebody familiar with the implementation to implement. This should get into specifics and corner-cases, and include examples of how the feature is used. Any new terminology should be defined here.

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
