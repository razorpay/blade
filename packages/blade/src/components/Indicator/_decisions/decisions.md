# Indicator

Indicators describe the condition of an entity. They can be used to convey semantic meaning, such as statuses and semantical-categories.

This document outlines the API of `Indicator` component.

<img src="./indicator-thumbnail.png" width="380" alt="" />

## Design

- [Figma - Indicator](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8224%3A1)

## API

Sample usecase:

<img src="./with-label.png" width="380" alt="" />

Sample usage:

```jsx
<Indicator
  intent="positive"
  label="Active | xyz@email.com"
  accessibilityLabel="Active for xyz@email.com"
/>
```
