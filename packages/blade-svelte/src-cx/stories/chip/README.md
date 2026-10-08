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

`Chip`: `value`, `children` (the label), `leading`, `color` (the
group's when omitted), `isDisabled`, `testID`, `class`. Width limits go
through `class`. The label is optional: an icon-only chip is Figma's
`showLabel` off.

The large chip sets its label in Heading/MediumRegular (the heading face,
20/26), as Blade DSL's _Chip (Figma) does; the smaller sizes use body type.

## Why `leading` is a prop

The chip places what comes before the label itself, because Figma spaces it
differently from the label. The label carries 4px on each side, which is the
gap after a leading icon or asset and also the text's inset when there is
none. The leading item has no spacing of its own.

| Size | Text only (left / right) | With a leading item (item inset / gap / right) |
| --- | --- | --- |
| xsmall, small | 12 / 12 | 8 / 4 / 12 |
| medium | 16 / 16 | 12 / 4 / 16 |
| large | 20 / 20 | 16 / 4 / 20 |

`leading` is one prop with two shapes, and the chip places each: an icon
(`IconSource`) is a glyph the chip sizes and tints (12/12/16/20px); a
snippet is an asset (an avatar, a flag) for the same slot, and receives the
chip's state.

Every label snippet (and `leading` / `trailing` where it has them) receives the control's state, `{ isChecked, isDisabled }` (`ControlState`). Groups take `labelRow`, and every hint line is `string | Snippet`, as the inputs.
