# ButtonGroup

Blade's ButtonGroup: Buttons joined in a row, `role="group"`. Not a toolbar:
each button is its own Tab stop.

| Prop | Notes |
| --- | --- |
| `variant`, `size`, `color` | Every button's, overriding its own (Blade's defaults: primary, medium, primary) |
| `isDisabled` | Disables every button; a button may still disable itself |
| `children` | The Buttons |
| `class`, `testID` | As everywhere |

Filled buttons are split by a 1px subtle divider that takes no width, as
in Blade DSL's Button Group (Figma); outlined ones overlap by 1px so their
rims read as one. Only the outer corners round (8px, 12px at large). The
group is exactly as wide as its buttons, with no border of its own; a
full-width group is `class="w-full [&>*]:flex-1"`.

API parity with Blade React: see `src-cx/API-PARITY.md`.
