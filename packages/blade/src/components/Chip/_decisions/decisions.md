# Chip Decisions <!-- omit in toc -->

Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions.

This document outlines the API of Chip & ChipGroup component.

<img  src="./chips-variants.png" alt="Different variants of the Chip component">

- [Design](#design)
- [`Chip` API](#checkbox-api)
- [`CheckboxGroup` API](#checkboxgroup-api)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=52377%3A27686&mode=design&t=pFzCay0x4a6sTcoQ-1) to all variants of the `Chip` component.

## `Chip` API

| Prop               | Type                    | Default     | Description                                  | Required |
| ------------------ | ----------------------- | ----------- | -------------------------------------------- | -------- |
| **children**       | `string`                | `undefined` | test description                             | :cross:  |
| **defaultChecked** | `boolean`               | `false`     | test description                             | :cross:  |
| **icon**           | `Icon`                  | `undefined` | test description                             | :cross:  |
| **isChecked**      | `boolean`               | `false`     | Control whether the chip is checked or not.  | :cross:  |
| **isDisabled**     | `boolean`               | `false`     | Control whether the chip is disabled or not. | :cross:  |
| **onChange**       | `(event) => void`       | `undefined` | test description                             | :cross:  |
| **size**           | `string`                | `default`   | test description                             | :cross:  |
| **type**           | `'checkbox' \| 'radio'` | `checkbox`  | test description                             | :cross:  |
| **variant**        | `string`                | `default`   | test description                             | :cross:  |

## `ChipGroup` API

| Prop             | Type                | Default     | Description      | Required |
| ---------------- | ------------------- | ----------- | ---------------- | -------- |
| **children**     | `React.ReactNode`   | `undefined` | test description | :cross:  |
| **defaultValue** | `string \|string[]` | `undefined` | test description | :cross:  |
| **value**        | `string \|string[]` | `undefined` | test description | :cross:  |
| **onChange**     | `(event) => void`   | `undefined` | test description | :cross:  |

### Examples

## Accessibility

## Open Questions

## References
