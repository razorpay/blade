# CatBubble Decisions

- [Design](#design)
- [ChatBubble Component](#ChatBubble-component)
  - [ChatBubble API](#ChatBubble-api)
- [Component Breakdown](#component-breakdown)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0) to all variants of the Button component

## ChatBubble Component

This will be our main component that will be used to render the chat bubble.

## ChatBubble API

| Prop          | Type      | Default | Required | Description                                                                                                                       |
| ------------- | --------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| message       | String    | Default | No       | The message that will be displayed in the chat bubble                                                                             |
| isLastMessage | Boolean   | false   | No       | If the message is the last message in the chat bubble , if this prop is enabled we will add decoration like tail in messageBubble |
|               | Boolean   | false   | No       | If the message is from the user, we will add a different styles to the chat bubble                                                |
| isLoading     | Boolean   | false   | No       | If the message is loading, we will add a loading animation to the chat bubble                                                     |
| isError       | Boolean   | false   | No       | If the message is an error, we will add a different style to the chat bubble                                                      |
| cardBody      | ReactNode | null    | No       | If their is no message and isLoading is false, we will render the card body in the chat bubble|

```tsx
type ChatBubbleProps = {
  message?: string;
  isLastMessage?: boolean;
  isUserMessage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  cardBody?: ReactNode;
}
```
** API **
```tsx
// with message
<ChatBubble message="Hello" isLastMessage isUserMessage />
// with card body
<ChatBubble  isLastMessage cardBody={<CustomComponent/>} />
//  with loading
<ChatBubble isLoading />
````


## Open Questions
- In case of Error what should we provide an trailing element for showing error message?