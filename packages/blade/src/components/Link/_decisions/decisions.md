# Link Decisions <!-- omit in toc -->
- [Design](#design)
- [Link Component](#link-component)
  - [Link API](#link-api)
- [Component Breakdown](#component-breakdown)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)

## Design
[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12699%3A147155) to the **Link** component


## Link Component
A Link component that can act as a `<button>` as well as an `<anchor>` element

### Link API

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| variant | `anchor`, `button` | *No* | `anchor` | The variant of the Link to be rendered.<br><br>Note: `button` will look like an inline Link component (no spacing; can be rendered alongside other text) but will be rendered as a `button` element. |
| children | `string` | When `icon` is passed: *No*<br>When `icon` is not passed: *Yes*   | undefined | The text to be rendered within the link. |
| icon | `Icon` | When `children` is passed: *No*<br>When `children` is not passed: *Yes* | undefined | The Blade `Icon` component to be rendered within the link. |
| iconPosition | `left`, `right` | *No* | `right` | The position of the rendered icon. |
| isDisabled | `boolean` | *No* | `false` | Control whether the link is disabled or not.<br><br>Note: This prop is only valid for `button` variant. |
| onClick | `Function` | No | undefined | The function to be called when the link is clicked. |
| href | `string` | No | undefined | The href for the link component.<br><br>Note: This prop is only valid for `anchor` variant. |
| target | `string` | No | undefined | The target for the link component.<br><br>Note: This prop is only valid for `anchor` variant. |

     
## Component Breakdown

<img src="./component-breakdown.png" width="300px"/>

## Accessibility
WIP

## Open Questions
NA