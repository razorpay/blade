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


## Various types disabilities

- **Visual:**  
  Anything that deals with sight, eg: people who have different types of sight like color blindness.
- **Cognitive:**  
  Concentration, memory, judgment, problem solving, logic skills.
- **Mobility:**  
  Anything that affects movement in a body.
- **Auditory:**  
  Disabilities related to sound or audio.

Other subcategories based on microsoft’s inclusive design:  

- **Permanent or disability that does not go away:**:   
  - Example: Someone who is deaf
- **Temporary, disability that will go away in time:**: 
  - Example: Someone who has an ear infection
- **Situational, Context based disabilities:**: 
  - Example: Someone who is at a loud sporting event
  - Example: Using the web app in bright sunlight
  - Example: Using your phone one handedly in a crowded metro station

<img src="./images/accessibility/ms-inclusive-design.png" alt="Microsoft Inclusive Design Shows Spectrum Of Disabilities" width="25%" />

# Motivation
- Why are we doing this?
- What use cases does it support?
- What is the expected outcome?

## Why are we doing this? 

Without proper accessibility, certain functionality used in web sites is not available to some users with disabilities, especially people who rely on screen readers and people who cannot use a mouse. 

Making our products accessible is important for two reasons.  
- it's the right thing to do. We believe that everyone deserves to be able to use our products, regardless of their abilities.
- It'll help build trust with our customers. By making our products accessible, we can expand our potential customer base and make our products more appealing to a wider range of people. 

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
