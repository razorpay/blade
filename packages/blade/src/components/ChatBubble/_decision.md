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
| messageType          | 'last' or  'default'                                | default   | No       | If  messageType is  lastmessage in the chat we will add different styles in chat message. currently we have different borderRadius if messageType is last or default                                                |
| senderType          | 'self' or 'other'                              | self   | No       | we will add  different styles based on this bubble                              |
| isLoading              | Boolean                                     | false   | No       | If the message is loading, we will add a loading animation to the chat bubble                                                                                   |
| validationState                | 'error' or 'none'                              | none   | No       |  if validation state is error we will show error decoration and message|
| errorText              | String                                      | null    | No       | If the message is an error message, we will show the error message in the chat bubble                                                                                   |
| onClick           | Function                                    | null    | No       | callback to be called when ever component is clicked.                                                                                                                          |
| footerActions        | ReactNode | null    | No       | if this is passed we will render this at the end of chat bubble                               |
| children               |  'ReactNode' or 'string'                          | null    | yes      | The children that will be rendered inside the chat bubble. can be react node or a string                                                                        |
| leading             | ReactNode                                   | null    | No       | will be displayed only in case  if message is other and also, will contain animation by default                                   |
|loadingText | String | null | No | if loading is true, we will show this text in the chat bubble |

```tsx
type ChatMessageProps = {
  messageType?: 'last' | 'default';
  senderType?: 'self' | 'other';
  isLoading?: boolean;
  validationState?: 'error' | 'none';
  errorText?: string;
  onClick?: () => void;
  footerActions?: ReactNode;
  children: ReactNode | string;
  leading?: ReactNode;
  loadingText?: string;
};
```

## API

```tsx

// for animation
<Move>
  <ChatMessage senderType="self">Demo Text</ChatMessage>
</Move>

// with error
<ChatMessage validationState="error" errorText="Error Message">Demo Text</ChatMessage>

// with card
<ChatMessage><Card></Card></ChatMessage>


<ChatMessage><Markdown>  Demo Text </Markdown></ChatMessage>
<ChatMessage><Markdown> Demo Text </Markdown></ChatMessage>


// with footer actions
   <ChatMessage
     footerActions={
       <ChipGroup>
         <Chip value="value1">value1</Chip>
         <Chip value="value2">value2</Chip>
       </ChipGroup>
     }
   >
   demo message
   </ChatMessage>
```

## Alternative API

```tsx
// for animation
<Move>
<ChatMessage message="Demo Text"/>
</Move>

// with card
<ChatMessage cardBody={<SomeComponent/>} />



// Markdown
<ChatMessage markdown="# this is markdown" />

// 
```

## Open Questions

- should their be an animation in case of error?