---
"@razorpay/blade": patch
---

fix: remove className from Button, svg, Link

> **Note**
> 
> There was an internal bug introduced with styled-props which allowed certain props like className to pass through and get added on DOM. This release fixes that bug.

This will be non-breaking for most projects (especially if you're using TypeScript). 

If your project happened to use `className` prop on Button, SVG Icons, or Link, it will stop working post this release.
