# Text input

The component is `packages/blade/components/text-input/TextInput.svelte`
over the `createInput` and `createField` models. It has no style axes yet
(`components/text-input/index.ts`).

## Behaviour props

| Prop | Notes |
| --- | --- |
| `value` | Bindable |
| `format` | `{ parse, format }` — functions, or declarative rule lists (preferred: native then formats in its own text pass). Splits the stored value from the displayed one |
| `name` | Registers the field with the enclosing Form under this key |
| `isRequired`, `pattern`, `type` | Declarative constraints evaluated by the form model |
| `onChange` | `{ name, value }` on a user edit (the parsed value, with `format`) |
| `type` defaults | Each type brings Blade's keyboard and autofill: `tel` → `autocomplete="tel"`; `email` → `autocomplete="email"`, no autocapitalize; `url` → Go key; `number` → rendered `text` with the decimal keypad. `inputMode`, `enterKeyHint`, `autoComplete`, `autoCapitalize` override |
| `validationState`, `helpText`, `errorText`, `successText` | Blade's three lines: the state shows its own text, `helpText` stands in for a missing one. Omit `validationState` inside a Form to mirror its error once touched or submitted (the message replaces the line while it lasts); pass it to own the state |
| `leading`, `trailing` | Affix before/after the text: a string or a snippet |
| `accessibilityLabel` | Names the control when there is no visible `label` |

## Formatting

`format.parse` runs on every edit and decides the stored value; `format.format`
renders it. One prop, because the halves only mean something together.
Prefer rule lists (`[pattern, flags, replacement]`) over functions: native
then formats in its own text pass. There is no mask-string form — see
`packages/blade/explorer/deviations.md`.
The input model keeps the caret in place across the rewrite.

## TextArea

Multi-line entry is a separate component, `TextArea` (`numberOfLines`,
no affixes, no `type`/`format`). It shares the field glue
(`runes/text-input/text-control.ts`) and takes every style part from
text-input's styles. On native, which has no multi-line mapping yet, its control
element degrades to a single-line input through `TextAreaControl.native.svelte`.

## PasswordInput and SearchInput

Blade's two specialised fields, each a TextInput underneath with the same
label, hint, sizes and look.

- **PasswordInput:** masked, never autocapitalized; `showRevealButton`
  (default on) toggles it to text, and a disabled field has no button and
  stays masked. `autoComplete` is `current-password`, `new-password` or
  `off`. Takes `span` inside an InputGroup.
- **SearchInput:** a text control with `role="searchbox"` and the search
  key, led by the search glyph (`showSearchIcon`), with the clear button
  whenever it holds text (`onClearButtonClick`). `trailing` sits after it.
