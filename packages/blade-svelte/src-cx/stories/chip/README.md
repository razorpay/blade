# Chip

`ChipGroup` and `Chip` (`components/chip/`) are Blade's: a choice among
chips — one (`selectionType="single"`, native radios) or many
(`"multiple"`, checkboxes). The group is the headless choice list
(`runes/base/choice-list.svelte.ts`) over a form field, like OptionList; the
keys are the platform's, as in Blade — a radio group picks as the arrows
move, and each checkbox is its own tab stop.

```svelte
<ChipGroup label="Business type" name="type" bind:value>
  <Chip value="proprietorship">Proprietorship</Chip>
  <Chip value="public">Public</Chip>
</ChipGroup>
```

`ChipGroup`: `label` / `accessibilityLabel`, `selectionType`, `value`
(bindable; an array with `multiple`), `onChange` (`{ name, values }`), `name`, `isDisabled`,
`isRequired`, `necessityIndicator`, `validationState`, `helpText`,
`errorText`, and the style props `size` (`xsmall` … `large`) and `color`
(`primary`, `positive`, `negative`). The label is always on top.

`Chip`: `value`, `children` (the label), `icon` or `leading`, `color` (the
group's when omitted), `isDisabled`, `testID`, `class`. Width limits go
through `class`.

Every label snippet (and `leading` / `trailing` where it has them) receives the control's state, `{ isChecked, isDisabled }` (`ControlState`). Groups take `labelArea`, and every hint line is `string | Snippet`, as the inputs.
