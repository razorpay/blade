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
| `prefix`, `leading` | Before the text: `prefix` is text (₹, +91); `leading` is an icon (`IconSource`), drawn as a glyph first, before `prefix`, or a snippet for a selector (a currency or country picker) after `prefix` |
| `suffix`, `trailing` | After the text, after the clear button: `suffix` is text (@okaxis); `trailing` is an icon, drawn as a glyph, or a snippet for a link or a button, last |
| `size` | `small` (32px), `medium` (36px, default), `large` (48px): the sizes Blade DSL's Text Input (Figma) draws |
| `accessibilityLabel` | Names the control when there is no visible `label` |

## Why `prefix`, `leading` and their trailing twins are props

Blade DSL's Text Input (Figma) gives each kind of affix its own spacing, so
the field places them itself. The field has 4px of padding all round its
parts; each part then carries its own inset beside it:

| Part | small | medium, large |
| --- | --- | --- |
| The text, from the edge | 8px | 12px |
| An icon `leading` or `trailing`, `prefix`, `suffix`, a snippet `trailing`, from the edge | 8px | 12px |
| A snippet `leading` (a selector), from the edge | 4px | 4px |
| Between leading parts | 2px | 8px |
| Last leading part → text | 4px | 8px |
| Text → first trailing part | 2px | 8px |
| Between trailing parts | 4px | 8px |
| Glyph size | 12px | 16px, 20px |

A selector has its own frame (a pill with its padding), so it sits on the
field's padding; a glyph or a word needs the field to inset it. That
difference can't be expressed with one generic slot, so the text is its own
prop (`prefix`, `suffix`), and `leading` and `trailing` each take one of
two shapes that the field places: an icon draws as its glyph, a snippet
goes in the slot. An icon and a snippet can't be combined on one side.
A `trailing` snippet takes a link's inset; a selector placed there sits
8px further in than Figma's trailing selector.

Medium sets 16px text on phones (iOS zooms into anything smaller) and
Figma's 14px on desktop (`d`).

## Formatting

`format.parse` runs on every edit and decides the stored value; `format.format`
renders it. One prop, because the halves only mean something together.
Prefer rule lists (`[pattern, flags, replacement]`) over functions: native
then formats in its own text pass. There is no mask-string form — see
`packages/blade/explorer/deviations.md`.
The input model keeps the caret in place across the rewrite.

## TextArea

Multi-line entry is a separate component, `TextArea` (`numberOfLines`,
no affixes, no `type`/`format`), in `medium` and `large` only, as Blade DSL's
TextArea Input (Figma): 8px top and bottom, 12px in, 8px round (12px at
large). It shares the field glue
(`runes/text-input/text-control.ts`) and takes every style part from
text-input's styles. On native, which has no multi-line mapping yet, its control
element degrades to a single-line input through `TextAreaControl.native.svelte`.

## PasswordInput and SearchInput

Blade's two specialised fields, each a TextInput underneath with the same
label, hint and look, in `medium` and `large` only (Figma draws no small).

- **PasswordInput:** masked, never autocapitalized; `showRevealButton`
  (default on) toggles it to text, and a disabled field has no button and
  stays masked. `autoComplete` is `current-password`, `new-password` or
  `off`. Takes `span` inside an InputGroup. Figma's Password Input also has
  `leading` (a glyph), `prefix`, `suffix` and a trailing link (`trailing`), placed
  as TextInput's; the link and the reveal button are 8px apart.
- **SearchInput:** a text control with `role="searchbox"` and the search
  key, led by the search glyph (`showSearchIcon`), with the clear button
  whenever it holds text (`onClearButtonClick`). The glyph is TextInput's
  icon `leading`, 12px in and 8px from the text; `trailing` (Figma's trailing
  selector) sits after the clear button.
