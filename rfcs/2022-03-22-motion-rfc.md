---
Start Date: 22-03-2022
RFC PR:
Blade Issue:
---

# Motion - Tokens & Frameworks <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->
- [Summary](#summary)
- [Motivation](#motivation)
    - [Why are we doing this?](#why-are-we-doing-this)
    - [What use cases does it support?](#what-use-cases-does-it-support)
    - [What is the expected outcome?](#what-is-the-expected-outcome)
- [Detailed Design](#detailed-design)
  - [Types of Motion](#types-of-motion)
  - [Scope of Motion](#scope-of-motion)
  - [Actions of Motion](#actions-of-motion)
  - [Rules (Tokens) of Motion](#rules-tokens-of-motion)
    - [Delay](#delay)
      - [Tokens - Delay](#tokens---delay)
    - [Duration](#duration)
      - [Perception of Duration](#perception-of-duration)
      - [Tokens - Duration](#tokens---duration)
    - [Easing](#easing)
      - [Bezier Curve](#bezier-curve)
        - [Linear Easing](#linear-easing)
        - [Rapid Start - Slow End Easing](#rapid-start---slow-end-easing)
        - [Ease In - Ease Out Easing](#ease-in---ease-out-easing)
      - [Tokens - Easing](#tokens---easing)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
    - [Spring Animations instead of Easing Animations](#spring-animations-instead-of-easing-animations)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)
- [References](#references)

# Summary


# Motivation
### Why are we doing this?
Motion brings your UI to life. It makes your UI feel closer to our physical reality. Just like we have **pre-defined physical laws** in the **real world** that dictate the reactions to our different actions (like throwing a ball high up and expecting it to fall back down in a predictable manner), we want to define similar **set of rules** for **motion** **within** our **Design System**. If two balls thrown up with the same force, come back down in the same manner then why should two buttons on a UI react differently when hovered over?

With this RFC, we want to **establish** certain **rules** (*tokens*) through which we can build predictable motion for our components and **evaluate** **multiple ways** through which we can **use these rules** to build motion within Blade.

### What use cases does it support?
The rules we establish for motion here can be applied for both Web (**React**) and Mobile (**React Native**) 

### What is the expected outcome?
1. Have a **set of tokens** that can be consumed within our components for animating them
2. Conclude on **how we can consume** these **tokens** to create animations


# Detailed Design
## Types of Motion
We can have 2 types of motion while building user interfaces,
1. **Realtime**: User is directly interacting with an object on the UI.

    *Example: When a user drags a carousel, the carousel slides as per the user's drag.*
    
    <img alt="Realtime Animation Example" src="./images/motion/realtime.gif" width="300px">

2. **Non-Realtime**: The object's behavior is *post-interactive* i.e it occurs after a user's action, and is transitional.

    *Example: When a user taps on a carousel card, it flips over within a set timeframe*
    
    <img alt="Realtime Animation Example" src="./images/motion/non-realtime.gif" width="300px">

## Scope of Motion
As of this RFC, we will be defining rules of motion only for **Non-Realtime** interactions. 

Few examples of non-realtime motion are:
1. Changing the size of a button on mouse hover
2. Changing the opacity of a card on press
3. Fading out a modal when the user closes it


## Actions of Motion
These are the actions an object on our UI can perform:

1. **Scale**: An object can change it's dimensions (size) in X and Y axis

    <img alt="scale" src="./images/motion/scale.gif" width="100px">

3. **Move**: An object can change it's position in X and Y axis

    <img alt="move" src="./images/motion/move.gif" width="100px">

4. **Fade**: An object can change it's opacity within the range of 0 to 1

    <img alt="fade" src="./images/motion/fade.gif" width="100px">

5. **Fill**: An object can change it's color

    <img alt="fill" src="./images/motion/fill.gif" width="100px">

6. **Morph**: An object can morph itself into another object

    <img alt="morph" src="./images/motion/morph.gif" width="100px">

7. **Rotation**: An object can rotate itself in a range of 0 to 360 degrees

    <img alt="rotate" src="./images/motion/rotate.gif" width="100px">

## Rules (Tokens) of Motion
While defining motion for an object transitioning from one state to another, we need to consider the following:
1. **Delay**: When should the motion start?
2. **Duration**: How long should an object take to transition from one state to another?
3. **Easing**: How should an object accelerate/decelerate while transitioning from one state to another?

### Delay
You can *start* or *stop* your motion with some delay. For example, in the image below, it becomes difficult to reach a sub-menu in the drop down since the exit animation for the sub-menu starts instantly after the mouse is out of hover range. This can be fixed by adding a delay to the exit animation.
> You can use `transition-delay` CSS property in the exit animation of the sub-menu to achieve this.

<img alt="rotate" src="./images/motion/dropdown.gif" width="300px">

#### Tokens - Delay
We will be storing these tokens in `blade/src/tokens/global/motion.ts` as a `string` of milliseconds.

> *Note: The naming for these tokens is not finalized yet. We will be updating this in the future.*

Here is the list of tokens that we will store in Blade for `Delay`:
```js
delay: {
  delay1: '70ms',
  delay2: '120ms',
  delay3: '180ms',
  delay4: '3000ms',
  delay5: '5000ms',
}
```

> For React Native, we would need to store delay as `number` instead of `string`. Eg: `delay1: 70`

### Duration
Duration is the time taken to complete any transition, interaction and animation. Each animation can run for a duration of time depending on factors like size of the object, distance of travel, direction of travel, etc. 

*Example: The card takes 300ms to open and 250ms to close*

<img alt="rotate" src="./images/motion/card-duration.gif" width="300px">

#### Perception of Duration
Letting an animation run for different durations will have an impact on whether the users perceive the action to be instant, fast, normal or slow. 

After thorough research & experimentation on perception our design team has created a guideline on how users would perceive different durations of animations. We will be using this as a reference while building out components and their animations.

<img alt="rotate" src="./images/motion/duration-chart.png" width="700px">

#### Tokens - Duration
We will be storing these tokens in `blade/src/tokens/global/motion.ts` as a `string` of milliseconds.

> *Note: The naming for these tokens is not finalized yet. We will be updating this in the future.*

Here is the list of tokens that we will store in Blade for `Duration`:
```js
duration: {
  duration1: '70ms',
  duration2: '150ms',
  duration3: '200ms',
  duration4: '250ms',
  duration5: '300ms',
  duration6: '400ms',
  duration7: '600ms',
}
```
> For React Native, we would need to store duration as `number` instead of `string`. Eg: `duration1: 70`

### Easing
Easing refers to the way in which a motion proceeds between two states. You can think of easing as acceleration or deceleration of an object's transition from one state to another. 

#### Bezier Curve
- A bezier curve allows us to mathematically represent how our easing should behave. Bezier curves can be represented on a graph where the x-axis represents **time** and the y-axis represents the **progression** of the motion. It can also be represented with a `cubic-bezier()` function which takes 4 arguments (`x1`,`y1`,`x2`,`y2`) within the range of 0 to 1.

- We can use Bezier Curves with both **React** & **React Native** to define the easing of our animations.
 
- **CSS** natively understands `cubic-bezier` functions and allows you to define `transition-timing-function: cubic-bezier(0, 0, 1, 1)`. Other libraries like `framer-motion`, `react-spring` & `react-motion` also allow you to define your easing with a `cubic-bezier` function.

- React Native's **Animated API** understands `Easing` functions and allows you to define `easing: Easing.bezier(0, 0, 1, 1)`. Other libraries like `react-native-reanimated` also allow you to define your easing with their own `Easing.bezier` function.
To understand easing better, lets take a look at a few different examples of easing

##### Linear Easing

If we move an object from one point to another with a linear motion where it's acceleration as well as deceleration is linear, it would look like this: 

<img alt="linear-easing" src="./images/motion/linear-easing.gif" width="300px">

We can represent this as a bezier function `cubic-bezier(0, 0, 1, 1)` and a bezier curve:

<img alt="linear-curve" src="./images/motion/linear-curve.png" width="200px">

##### Rapid Start - Slow End Easing

If we move an object from one point to another where it will start at a higher velocity and slow down as it approaches the destination, it would look like this:

<img alt="fast-in-ease-out" src="./images/motion/rapid-start-easing.gif" width="300px">

We can represent this as a bezier function `cubic-bezier(0, 1, 1, 1)` and a bezier curve:

<img alt="rapid-start-curve" src="./images/motion/rapid-start-curve.png" width="200px">

We can also represent this as a bezier function: `cubic-bezier(0, 1, 1, 1)`

##### Ease In - Ease Out Easing

If you're familiar with easing in CSS, you must have come across a transition timing property of `ease-in-out`. This is the same as linear but with a slower acceleration at the beginning and a slower deceleration at the end.

<img alt="ease-in-out-easing" src="./images/motion/ease-in-out-easing.gif" width="300px">

We can represent this as a bezier function `cubic-bezier(0.42, 0, 0.58, 1)` and a bezier curve:

<img alt="rapid-start-curve" src="./images/motion/ease-in-out-curve.png" width="200px">

> You can experiment with different bezier curves to see how they look here: cubic-bezier.com

#### Tokens - Easing
We will be storing these tokens in `blade/src/tokens/global/motion.ts` as a `cubic-bezier()` function.

> Note: *The naming for these tokens is not finalized yet. We will be updating this in the future.*

After thorough research & experimentation, our design team has created 3 broad intents of easing: `standard`, `entrance`, & `exit`. Each of these intents can have `effective`, `revealing`, `wary`, & `attentive` easing which we can use in our motion as per our use case.

For example, if we want to have an easing on an object's entrance that needs to grab a user's attention, we can the `entrance.attentive` easing.

Here is the list of tokens that we will store in Blade for `Easing`:
```js
easing: {
  standard: {
    effective: 'cubic-bezier(0.3, 0, 0.2, 1)',
    revealing: 'cubic-bezier(0.5, 0, 0, 1)',
    wary: 'cubic-bezier(1, 0.5, 0, 0.5)',
    attentive: 'cubic-bezier(0.5, 0, 0.3, 1.5)',
  },
  entrance: {
    effective: 'cubic-bezier(0, 0, 0.2, 1)',
    revealing: 'cubic-bezier(0, 0, 0, 1)',
    attentive: 'cubic-bezier(0.5, 0, 0.3, 1.5)',
  },
  exit: {
    effective: 'cubic-bezier(0.17, 0, 1, 1)',
    revealing: 'cubic-bezier(0.5, 0, 1, 1)',
    attentive: 'cubic-bezier(0.7, 0, 0.5, 1)',
  },
}
```

For React Native, we need to store easing as `Easing.bezier` where `Easing` can be imported from react-native's `Animated` or `react-native-reanimated` depending on the library you are using.

```js
easing: {
  standard: {
    effective: Easing.bezier(0.3, 0, 0.2, 1),
    revealing: Easing.bezier(0.5, 0, 0, 1),
    wary: Easing.bezier(1, 0.5, 0, 0.5),
    attentive: Easing.bezier(0.5, 0, 0.3, 1.5),
  },
  entrance: {
    effective: Easing.bezier(0, 0, 0.2, 1),
    revealing: Easing.bezier(0, 0, 0, 1),
    attentive: Easing.bezier(0.5, 0, 0.3, 1.5),
  },
  exit: {
    effective: Easing.bezier(0.17, 0, 1, 1),
    revealing: Easing.bezier(0.5, 0, 1, 1),
    attentive: Easing.bezier(0.7, 0, 0.5, 1),
  },
}
```

# Drawbacks/Constraints
WIP

# Alternatives
### Spring Animations instead of Easing Animations
- Instead of using Easing for our animations we can use spring-physics based animations. 
- Spring animations *claim* to look more fluid and natural since the animations are based on the same physical rules as that of a spring. 
- Spring animations can be controlled by defining the characteristics of a spring like `Mass`, `Tension` & `Friction`
- To use spring animations, we need to use some 3rd party library like `framer-motion` or `react-spring` since it is not natively supported by CSS.
- **Non-realtime** motion include a bunch of actions like scale, move, fade, fill, etc. All of which can be achieved using **spring animations as well as easing animations**.
- **Realtime** motion is a lot more complex and we would **not be able to achieve** the same fluid animations **just** by **using easing** animations.
- Spring animations make the most sense for animations that are dependent on user interactions like dragging chat bubbles, dragging bottom sheet to open and close, swiping cards to dismiss them, swiping to another tab
- **We will dive deeper** into whether or not we want to use **spring animations** when we explore **realtime motion** **in the future**. As of the scope of this RFC which is only Non-realtime motion, we will continue using easing animations.
- You can read more about spring based animations here:
  - react-spring.io
  - [A friendly introduction to spring physics
](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)
  - [The physics behind spring animations
](https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/) 

# Adoption strategy
WIP

# How do we educate people?
WIP

# Open Questions
WIP

# References
- https://shengbanx.gitbooks.io/motion-system/content/chapter2.html
- https://www.joshwcomeau.com/animation/css-transitions
