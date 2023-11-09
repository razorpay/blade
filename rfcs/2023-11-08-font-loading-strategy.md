---
Start Date: 08-11-2023
RFC PR:
Blade Issue:
---

# Blade - Font Loading Strategy [WIP ⚠️] <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->

- [Summary](#summary)
- [Final Example](#final-example)
- [Motivation](#motivation)
<!-- - [Detailed Design](#detailed-design)
- [Drawbacks/Constraints](#drawbacksconstraints)
- [Alternatives](#alternatives)
- [Adoption strategy](#adoption-strategy)
- [How do we educate people?](#how-do-we-educate-people)
- [Open Questions](#open-questions)
- [References](#references) -->

## Summary

After Brand Refresh, we have 2 major fonts. `Inter` and `Tasa Orbiter`.

## Questions

### Who loads the font?

- Blade library itself loads the font
- ✅ Blade only recommends a way to load the font
- Blade only tells consumers which fonts to load

We will recommend a way to load font. This is what most other design-systems do and because our font `Tasa Orbiter` is not easily available on popular CDNs like Google Fonts, having a recommended way can save significant amount of time on consumer's end.

### Criteria for font loading strategy

What should this recommendation be based on?

Our recommended font loading strategy should find a good balance between following criteria

- **Performance**
  Should load fonts fast enough without impacting performance on rest of the app.

- **DX**
  Should not take significant amount of time and effort on consumer's end. Should be easy to load fonts.

## Possible Solutions

> **Note**
>
> The final solution is not decided yet
>
> For React Native, we'll continue to

### 1. Self-Hosted: Download Fonts, Add them to CSS on consumer end (Preferred ✅)

- Download font files
- Link the font in CSS

The performance of variable font vs static font depends on how many weights and styles are being used, the size of that particular font in itself, etc.

Ideally TasaOrbiter should be used as Variable Font (32kb compared to ~100kb of static font) And Inter should be used as static font (600kb compared to 800kb of variable font) for least bundle-size and better performance.

```css
@font-face {
  font-family: 'TasaOrbiter';
  src: url('/fonts/TASAOrbiterVF.woff2') format('woff2-variations');
  font-weight: 125 950;
  font-stretch: 75% 125%;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
}
```

CSR apps can also add preloads to fonts to load them faster

```html
<link rel="preload" href="/fonts/TASAOrbiterVF.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Inter-Regular.ttf" as="font" type="font/ttf" crossorigin />
<link rel="preload" href="/fonts/Inter-SemiBold.ttf" as="font" type="font/ttf" crossorigin />
```

Example: https://stackblitz.com/~/github.com/saurabhdaware/blade-self-hosted-font

#### Difference between loading fonts without preload and with preload

https://github.com/razorpay/blade/assets/30949385/b2b12cbe-2c93-4af9-bc7f-7b94ed36b90b

https://github.com/razorpay/blade/assets/30949385/d468cfc1-c1a9-44ad-9d85-a3ea37320ce7

### 2. Host fonts on our CDN with css file

Similar to how you install from google font, except we can have `https://cdn.razorpay.com/blade/fonts.css` kind of URL.

### 3. Load from existing third-party CDN

While Inter can be loaded from [Google Fonts](https://fonts.google.com/specimen/Inter), Tasa Orbiter can be loaded from [CDNFonts](https://www.cdnfonts.com/tasa-orbiter-display.font)

## References

- [Adobe Spectrum Typography](https://spectrum.adobe.com/page/fonts/#Downloading-Spectrum-font-families): They own the fonts and they can be downloaded from adobe console
  - [Example](https://github.com/adobe/react-spectrum/blob/9ce2f674eab2cc8912800d3162dcf00a1ce94274/.storybook/preview-head.html#L13-L24)
- [Reshaped](https://reshaped.so/content/docs/getting-started/react/installation#using-fonts): Just gives link to the official font site but does not give recommendation or download fonts
- [Primer](https://primer.style/react/getting-started): says yolo and uses system fonts only

## Fallbacks

```css
font-family: 'Tasa Orbiter', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica
    Neue, sans-serif;

font-family: 'Inter', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica
    Neue, sans-serif;

font-family: “Menlo”, -apple-system, BlinkMacSystemFont, San Francisco Mono, Courier New, Roboto
    Mono, monospace;
```

<!--


## Final Example

Include a basic code example. Omit this section if it's not applicable.

## Motivation

- Why are we doing this?
- What use cases does it support?
- What is the expected outcome?

Try to focus on explaining the motivation so that if this RFC is not accepted, the motivation could be used to develop alternative solutions. In other words, try to list down the constraints you are trying to solve without coupling them too closely to the solution you have in mind. -->
<!--
## Detailed Design

This is the bulk of the RFC. Explain the design in enough detail for somebody familiar with the Design System to understand, and for somebody familiar with the implementation to implement. This should get into specifics and corner-cases, and include examples of how the feature is used. Any new terminology should be defined here.

## Drawbacks/Constraints

Why should we _not_ do this? Maybe try to consider the following constraints

- Implementation cost, both in terms of code size and complexity.
- The impact of it on new as well as existing consumer projects.
- Cost of migration.

There are tradeoffs to choosing any path. Attempt to identify them here.

## Alternatives

What other designs/patterns/strategies have been considered?

## Adoption strategy

If we implement this proposal, how will existing consumer projects adopt it?

- Is this a breaking change?
- Can we write a codemod?
- How do we prioritise this with business and product folks?
- How do we communicate with other teams? Will updating docs suffice or do we need a dedicated interaction with them?

## How do we educate people?

- How should this be taught to other folks?
- What names and terminology work best for these concepts and why?
- How is this idea best presented?

## Open Questions

- Any open questions that you have?
- Any undiscovered areas that you have encountered?
- Any dependencies on other teams(Design/Engineering) that needs to be resolved upfront?

## References

Any references that you can share for those who are curious to understand anything beyond the scope of this RFC in general but related to the topic of this RFC. -->
