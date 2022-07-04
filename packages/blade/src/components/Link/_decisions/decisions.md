# Link Decisions <!-- omit in toc -->
- [Design](#design)
- [Link Component](#link-component)
  - [Link API](#link-api)
- [Component Breakdown](#component-breakdown)
- [Open Questions](#open-questions)

## Design
[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=12699%3A147155) to the **Link** component


## Link Component
A Link component that can act as a `<button>` as well as an `<anchor>` element

### Link API

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| variant | `anchor`, `button` | No | `anchor` | - The variant of the Link to be rendered.<br><br>Note: `button` will look like an inline Link component but will be rendered as a `button` element |
| children | `string` | No | undefined | The text to be rendered within the link. |
| icon | `Icon` | No | undefined | The Blade `Icon` component to be rendered within the link. |
| iconPosition | `left`, `right` | No | `right` | The position of the rendered icon. |
| isDisabled | `boolean` | No | `false` | Control whether the link is disabled or not. |
| onClick | `Function` | No | undefined | The function to be called when the link is clicked. |
| href | `string` | No | undefined | The href for the link component.<br><br>Note: This will be ignored when the variant is `button` |

     
## Component Breakdown

<img src="./component-breakdown.png" width="300px"/>

## Open Questions
NA