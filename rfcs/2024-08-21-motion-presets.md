---
Start Date: 21-08-2024
RFC PR: (leave this empty if no PR yet)
Blade Issue: (leave this empty if no issue yet)
---

# Motion Presets RFC <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->

- [Summary](#summary)
- [Basic Example](#basic-example)
- [Motivation](#motivation)
- [Detailed Design](#detailed-design)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)
- [References](#references)

# Summary

# Basic Example

Include a basic code example. Omit this section if it's not applicable.

# Motivation

- Why are we doing this?
- What use cases does it support?
- What is the expected outcome?

Try to focus on explaining the motivation so that if this RFC is not accepted, the motivation could be used to develop alternative solutions. In other words, try to list down the constraints you are trying to solve without coupling them too closely to the solution you have in mind.

# Detailed Design

For building presets, we have to figure out few things like

- [Libarary to use for Animations](#library-comparison)
- [API Decision for Motion Presets]

## Library Comparison

### Goals of Ideal Library

1. License (Preferrably free to use)
2. Hardware Accelarated Animations (Using CSS or [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API))
3. Easy to implement complex animations
4. React Router page transition support
5. Morph Animations / Layout Animations
6. Small bundle-size

Lets compare some libraries over these ideals-

### Comparison Table

| **Goal**                                 | **Framer Motion**                                                                                                                             | **Motion One**                                | **GSAP**                               | **Vanilla CSS Animations**                    |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | -------------------------------------- | --------------------------------------------- |
| **License** (Preferrably free to use)    | ✅ MIT                                                                                                                                        | ✅ MIT                                        | ❌ (Commercial License + Paid Plugins) | ✅ No License                                 |
| **Hardware Accelarated Animations**      | ✅ (Hybrid - WAAPI for some transformations with fallback to JS) [Hardware Accelarated POC](#hardware-accelarated-motion-using-framer-motion) | ✅ (Built on WAAPI)                           | ❌                                     | ✅                                            |
| **Easy to implement complex animations** | ✅ (Declarative API)                                                                                                                          | ❌                                            | ❌                                     | ❌                                            |
| **React Router Page Transition**         | ✅                                                                                                                                            | ❌ (No native support but can be implemented) | ✅                                     | ❌ (No native support but can be implemented) |
| **Morph Animations / Layout Animations** | ✅ [Framer Motion POC](#morph-animations-with-framer-motion)                                                                                  | ❌                                            | ✅                                     | ❌                                            |
| **Small bundle size**                    | ❌ (4.6kb core + 40kb features that can be lazy loaded)                                                                                       | ✅ (4kb )                                     | ❌ (26kb core + features)              | ✅ (0kb)                                      |

There is also detailed comparison of these libraries at [Motion One Docs - Feature Comparisons](https://motion.dev/docs/feature-comparison#comparison-table)

## POCs

### Hardware Accelarated Motion using Framer Motion

https://github.com/user-attachments/assets/5aa7ba3f-666e-449c-ae1d-821f93c12962

<p align="right">
  <a href="https://codesandbox.io/p/sandbox/framer-motion-enter-animation-forked-rk3tvd?file=%2Fsrc%2FApp.tsx%3A27%2C28"><img src="https://codesandbox.io/static/img/play-codesandbox.svg" /></a>
</p>

### Hardware Accelarated Motion using GSAP

> [!NOTE]
>
> While GSAP does offload some work to hardware using CSS, it still requires javascript to work and stops working if JS thread is blocked

https://github.com/user-attachments/assets/57593b19-3a19-4713-b768-9bcbf69097ee

<p align="right">
<a href="https://codesandbox.io/p/sandbox/framer-motion-hardware-accelarated-animations-forked-7qjyg9">
  <img alt="Edit GSAP: Hardware Accelarated Animations " src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>
</p>

### Morph / Layout Animations with Framer Motion

https://github.com/user-attachments/assets/ad3d4a23-c3b9-4980-a051-a0f44e7224dc

<p align="right">
  <a href="https://codesandbox.io/p/sandbox/framer-motion-hardware-accelarated-animations-forked-q674t5">
  <img alt="Edit Framer Motion: Morph Animations" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>
</p>

### Other POCs

- [Framer Motion Layout Animations with Blade Components](https://stackblitz.com/edit/framer-motion-blade-poc?file=App.tsx,Logger.tsx)

## Goals

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

- React Native support for presets?
- Should motion components be imported from `@razorpay/blade/components` like other components or `@razorpay/blade/motion`

# References

- ### Libraries

  - [Framer Motion](https://www.framer.com/motion/)
  - [Motion One](https://motion.dev/docs)
  - [GSAP](https://gsap.com/)

- ### Design Systems with Motion Presets

  - [Material UI - Transitions](https://mui.com/material-ui/transitions/)
  - [Carbon - Motion (Only export easing curves to consumers)](https://carbondesignsystem.com/elements/motion/code)
  - [Fluent UI - Motion APIs](https://react.fluentui.dev/?path=/docs/motion-apis-createmotioncomponent--docs)
  - [Atlaskit by Atlassian - Motion Components](https://atlassian.design/components/motion/entering-motions/examples)

- ### Other Motion References

  - [Framer Motion vs Motion One by Matt Perry (Creator of both libraries)](https://motion.dev/blog/should-i-use-framer-motion-or-motion-one)
  - [Motion One vs Other Libraries - Feature Comparison](https://motion.dev/docs/feature-comparison)
  - [Motion One & Browser Performance Guide](https://motion.dev/docs/performance)
  - [Framer Motion - Hardware Accelarated Animations](https://www.framer.com/motion/animation/#hardware-accelerated-animations)
    - [Release Date](https://github.com/framer/motion/blob/main/CHANGELOG.md#910-2023-02-23)
  - [View Transitions API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
  - [Web Animations API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API)
  - [CSS Triggers - What CSS property triggers which type of render](https://csstriggers.com/)
  - [Framer Motion Page Transitions Demo](https://codesandbox.io/p/sandbox/framer-motion-react-router-6-page-transitions-2f2olf?file=%2Fsrc%2Ftemplate%2FGallery.tsx%3A18%2C38&from-embed=)
  - [Framer Motion Scroll Animations](https://codesandbox.io/p/sandbox/framer-motion-whileinview-2hbg5?file=%2Fsrc%2Findex.tsx&from-embed=)
