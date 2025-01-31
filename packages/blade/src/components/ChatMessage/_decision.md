# ChatMessage Decisions

- [Design](#design)
- [ChatMessage Component](#ChatMessage-component)
  - [ChatMessage API](#ChatMessage-api)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0)

## ChatMessage Component

This will be our main component that will be used to render the chat bubble.

## ChatMessage API

| Prop                   | Type                                        | Default | Required | Description                                                                                                                                                     |
| ---------------------- | ------------------------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isLastMessage          | "last |  default"                                  | default   | No       | If the message is the last message in the chat and if this prop is enabled we will add decorations messageBubble                                                |
| senderType          | "self | other"                                     | self   | No       | we will add  different styles based on this bubble                              |
| isLoading              | Boolean                                     | false   | No       | If the message is loading, we will add a loading animation to the chat bubble                                                                                   |
| validationState                | "error | none"                                     | none   | No       |  if validation state is error we will show error decoration and message|
| errorText              | String                                      | null    | No       | If the message is an error message, we will show the error message in the chat bubble                                                                                   |
| onClick           | Function                                    | null    | No       | callback to be called when ever component is clicked.                                                                                                                          |
| footerActions        | ReactNode | null    | No       | if this is passed we will render this at the end of chat bubble                               |
| children               | ReactNode                                   | null    | yes      | The children that will be rendered inside the chat bubble. can be react node or a string                                                                        |
| leading             | ReactNode                                   | null    | No       | will be displayed only in case  if message is other and also, will contain animation by default                                   |
|loadingText | String | null | No | if loading is true, we will show this text in the chat bubble |

```tsx
type ChatMessageProps = {
  isLastMessage?: boolean;
  isUserMessage?: boolean;
  isLoading?: boolean;
  isError?: boolean;
  feedbackOptions?: Array<{ icon: ReactNode; onClick: Function }>;
  errorText?: string;
  onErrorClick?: Function;
  children?: ReactNode | string;
  avatarIcon?: IconComponent;
  avatarIconColor?: string;
  disableAvatarAnimation?: boolean;
};
```

## API

```tsx

// for animation
<Move>
  <ChatMessage>Demo Text</ChatMessage>
</Move>

// with card
<ChatMessage><Card></Card></ChatMessage>

//Feedback Options
<ChatMessage feedbackOptions={[{icon: <Icon />, onClick: () => {},}]}>
  <Text> Demo Text</Text>
  <ChipGroup></ChipGroup>
</ChatMessage>

<ChatMessage><Markdown>  Demo Text </Markdown></ChatMessage>
<ChatMessage><Markdown> Demo Text </Markdown></ChatMessage>
```

## Alternative API

```tsx
// for animation
<Move>
<ChatMessage message="Demo Text"/>
</Move>

// with card
<ChatMessage cardBody={<SomeComponent/>} />

//Feedback Options
<ChatMessage feedbackOptions={[{icon: <Icon />, onClick: () => {},}]} message="Demo text"/>


// Markdown
<ChatMessage markdown="# this is markdown" />
```

## Open Questions

- should we have validation state for chat bubble?
- should their be an animation in case of error?
- do we really need feedback options?
- we add a trailing option to the chat bubble?
- Still need to think about the name ?
