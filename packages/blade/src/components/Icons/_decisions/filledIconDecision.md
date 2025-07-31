### Filled / Outline Icon Decision

**Author(s):** Gaurav Tewari
**Team/Pod:** Blade
**BU:** Platform
**Published Date:** Jul 29, 2025

-----

**Table of Contents**

1.  [Introduction](#1-introduction)
2.  [Strategy Options](#2-strategy-options)
    * [2.1 Having Variants of the Same Icon](#21-having-variants-of-the-same-icon)
    * [2.2 Adding Variants to the End of the Icon Name](#22-adding-variants-to-the-end-of-the-icon-name)
3.  [Recommendation & Rationale](#3-recommendation--rationale)
4.  [Open Questions](#4-open-questions)
5.  [Appendix](#5-appendix)
    * [5.1 References](#51-references)

-----

### 1\. Introduction

Currently in Blade, we are planning to add new variants of icons: filled and outlined. This document discusses the development implementation for this change.

### 2\. Strategy Options

#### 2.1 Having Variants of the Same Icon

This approach uses a `variant` prop to change the icon's style.

```javascript
<BladeIcon variant="outline"/>
<BladeIcon variant="filled"/>
```

**Pros:**

  * Requires minimal changes to the icon name.
  * Allows for adding more variants in the future, such as a `TwoToned` icon.

**Cons:**

  * Currently, we do not support these variants for all icons. Not all icons can have two variants. This means we would need a way to show an error for unsupported variants, which could lead to API inconsistencies.
  * There are currently 12 icons that are filled by default. If we don't create an outline variant for them, it will be inconsistent.
  * This approach might be confusing for AI tools that generate code.

#### 2.2 Adding Variants to the End of the Icon Name

This approach appends the variant name to the end of the icon's name.

```javascript
<BladeFilledIcon />

// for Colored
<BladeColoredIcon />

// for Outline
<BladeOutlineIcon />
```

This is a commonly used pattern in many icon libraries, such as Ant Design and React Icons.

**Pros:**

  * It's much easier to check if a specific icon exists.
  * Easier to maintain.
  * Common patterns are also easier for AI tools to understand.

**Cons:**

  * This approach will result in a larger number of icons, with a new icon for each variant.

### 3\. Recommendation & Rationale

Saurabh Daware suggested that if we use variants of the same icon, the bundle size will increase as we add more icons.

During the last call, we decided to check the current bundle size of the icon library and how much it would increase with each new icon variant.

**Action Item:**
Check the bundle size and determine the increase with each new icon.

| Icon Variants | Size   |
|---------------|--------|
| 1             | 1.67kb |
| 2             | 2.76kb |
| 4             | 4.17kb |

Adding each variant increases the size by approximately 1kb. If we have 20 icons on a page, adding two variants for each would increase the total size by about 20kb.

We also checked how other icon libraries handle this.

  * [Ant Design](https://ant.design/), [React Icons](https://react-icons.github.io/react-icons/), and [Material-UI](https://mui.com/material-ui/material-icons/) have separate icons for filled and outlined variants.
  * [Feather Icons](https://feathericons.com/) do not have a filled variant.
  * Pica Icons in the design team follow a similar approach with variants, but a clear developer implementation is not readily available.

**Current Decision Status:**

We are moving forward with creating a new component for each variant and adding the variant name to the icon name.

### 4\. Open Questions

N/A

### 5\. Appendix

#### 5.1 References

  * [Ant Design](https://ant.design/)
  * [React Icons](https://react-icons.github.io/react-icons/)
  * [Bootstrap Icons](https://icons.getbootstrap.com/)
  * [Material-UI Icons](https://mui.com/material-ui/material-icons/)
  * [Feather Icons](https://feathericons.com/)
  * [Pica Icons](https://pikaicons.com/)
