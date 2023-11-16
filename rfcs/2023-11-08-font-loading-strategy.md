---
Start Date: 08-11-2023
RFC PR: https://github.com/razorpay/blade/pull/1803
Blade Issue:
---

# Blade - Font Loading Strategy <!-- omit in toc -->

### Table Of Contents <!-- omit in toc -->

- [Summary](#summary)
- [Proposed Solution](#proposed-solution)
  - [Web](#web)
  - [React Native](#react-native)
- [Detailed Design](#detailed-design)
  - [Criteria for Font Loading Strategy](#criteria-for-font-loading-strategy)
  - [Explored Solutions](#explored-solutions)
- [Implementation Details](#implementation-details)
- [References](#references)

## Summary

After Brand Refresh, we have 2 major fonts. `Inter` and `Tasa Orbiter`.

So far when we had Lato, we could load it from `@fontsource/lato`. But Tasa Orbiter does not exist on fontsource and we also selectively load weights from Inter and Lato.

This document is created to explore and decide on what should be the font loading strategy after brand refresh

## Proposed Solution

### Web

Consumers add import from `@razorpay/blade/fonts.css` which sets the font face and loads the fonts

```js
// index.tsx
import '@razorpay/blade/fonts.css';
```

Consumers add font on `body` in their global Styled Components File with-

```js
// With styled-components
const GlobalStyles = createGlobalStyles`
  body {
    font-family: ${(theme) => theme.typography.fonts.family.text}
  }
`;
```

Live Example (POC): https://stackblitz.com/~/github.com/saurabhdaware/blade-self-hosted-font/tree/blade-import-css?file=index.tsx

### React Native

In React Native, people will continue to load the font the way they do right now (Download font files, link them to android and ios projects)

Refer: https://blade.razorpay.com/?path=/docs/guides-installation--page#react-native-projects

## Detailed Design

### Criteria for font loading strategy

Our recommended font loading strategy should find a good balance between following criteria

- **Performance**
  Should load fonts fast enough without impacting performance on rest of the app.

- **DX**
  Should not take significant amount of time and effort on consumer's end. Should be easy to load fonts.

### Explored Solutions

#### 1. Self Hosted: Manual Method

- Download font files from respective sites
- Define font-face in your CSS

**Pros:**

- Since consumers know the final font URL, they can be preloaded
- Self-hosted so does not require additional DNS connection and thus fonts load faster

**Cons:**

- Consumers need to make sure fallbacks are set properly for browsers
- Consumers need to make sure the place where fonts are hosted are correctly cached on CDN
- Consumers need to make sure the correct lightweight fonts are used with correct configurations
- Time consuming method to implement

<details>
<summary>Example</summary>

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

</details>

<!-- #### Difference between loading fonts without preload and with preload

https://github.com/razorpay/blade/assets/30949385/b2b12cbe-2c93-4af9-bc7f-7b94ed36b90b

https://github.com/razorpay/blade/assets/30949385/d468cfc1-c1a9-44ad-9d85-a3ea37320ce7 -->

#### 2. Self Hosted: Using CSS Imports from Blade (✅ Preferred)

Similar to how we load Lato font from `@fontsource/lato` right now, Consumers add import from `@razorpay/blade/fonts.css`

```js
import '@razorpay/blade/fonts.css';
```

**Pros:**

- Easy Implementation
- Self-hosted so does not require additional DNS connection and thus fonts load faster
- Font names, font files, fallbacks for browsers, definition of fonts, is taken care by Blade

**Cons:**

- Fonts cannot be preloaded with HTML preload in CSR apps (SSR apps can loop through their build manifest to know the font URLs and preload them if required)

#### 3. Host fonts on Razorpay's CDN

Similar to how you install from google font, except we can have `https://cdn.razorpay.com/blade/fonts.css` kind of URL.

**Pros:**

- Easy Implementation
- Font definitions are taken care by blade
- Can be preloaded

**Cons:**

- More implementation and maintainance cost since we don't have well-owned CDN currently
- Requires additional DNS connection before fonts start to load
- Unlike method 2, this cannot be versioned or easily be kept in-sync with Blade's version

#### 4. Load from existing third-party CDN

While Inter can be loaded from [Google Fonts](https://fonts.google.com/specimen/Inter), Tasa Orbiter can be loaded from [CDNFonts](https://www.cdnfonts.com/tasa-orbiter-display.font)

Cons from all of the above 🙈

## Implementation Details

### Variable Fonts vs Static Fonts

Should Blade load variable fonts or static-fonts?

The performance of variable font vs static font depends on how many weights and styles are being used, the size of that particular font in itself, etc.

These are the weights and styles being used right now

**Tasa Orbiter:** 400, 500, 600
**Inter:** 400, 600

**Conclusion**

- We use Tasa Orbiter as variable font since its 32kb in size compared to ~90kb (30kb x 3 weights) of static font
- We use Inter as static font. We use lighter version of Inter from [@fontsource/inter](https://www.npmjs.com/package/@fontsource/inter?activeTab=code) as static fonts there are 70kb each compared to ~200kb on Google Fonts version. The variable font of Inter from Google Fonts is ~800kb.

### Font Fallbacks

```css
{
  font-family: 'Tasa Orbiter', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif,

  font-family: 'Inter', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif,

  font-family: “Menlo”, San Francisco Mono, Courier New, Roboto Mono, monospace,
}
```

## References

- [Adobe Spectrum Typography](https://spectrum.adobe.com/page/fonts/#Downloading-Spectrum-font-families): They own the fonts and they can be downloaded from adobe console
  - [Example](https://github.com/adobe/react-spectrum/blob/9ce2f674eab2cc8912800d3162dcf00a1ce94274/.storybook/preview-head.html#L13-L24)
- [Reshaped](https://reshaped.so/content/docs/getting-started/react/installation#using-fonts): Just gives link to the official font site but does not give recommendation or download fonts
- [Primer](https://primer.style/react/getting-started) uses system fonts only
- [@fontsource/inter](https://www.npmjs.com/package/@fontsource/inter?activeTab=code) was referred for lighter inter version
