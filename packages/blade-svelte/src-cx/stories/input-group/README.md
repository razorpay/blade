# Input group

The component is `packages/blade/components/input-group/InputGroup.svelte`.
It has no style axes yet (`components/input-group/index.ts`).

## Behaviour props

| Prop | Notes |
| --- | --- |
| `label` | The group's visible label; `accessibilityLabel` names it when there is none |
| `validationState`, `helpText`, `errorText`, `successText` | Omit `validationState` inside a Form to mirror the first visible member error (it replaces `hint` while it lasts); pass it to own the frame, the line and every member's state |
| `isDisabled` | Disables every member |
| `children` | The fields |

## Inside a group

A TextInput in a group keeps its `label` as the control's accessible name
but shows neither it nor a hint line of its own; it is described by the
group's line. It draws the same frame it has alone, so its focus, error
and hover look the same; the group joins the frames so neighbours share
one border line, rounds the members at its corners, and stacks a member's
states so a shared edge shows focus over error over hover over the rest.

## Layout

There is no row component and no column count. Each member says how much of
a row it takes — `span`: `full` (the default), `1/2`, `1/3`, `2/3`, `1/4`,
`3/4` — and members flow in order, so spans that add up to 1 form a row.
Rows are expected to add up to 1: the first and last rows give their end
members the group's corners.
