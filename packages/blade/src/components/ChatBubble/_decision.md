# ChatBubble Decisions

- [Design](#design)
- [ChatBubble Component](#ChatBubble-component)
  - [ChatBubble API](#ChatBubble-api)
- [Component Breakdown](#component-breakdown)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0) 

## ChatBubble Component

This will be our main component that will be used to render the chat bubble.

## ChatBubble API

| Prop          | Type      | Default | Required | Description                                                                                                                       |
| ------------- | --------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| isLastMessage | Boolean   | false   | No       | If the message is the last message in the chat bubble , if this prop is enabled we will add decoration like tail in messageBubble |
| isUserMessage | Boolean   | false   | No       | If the message is from the user, we will add a different styles to the chat bubble                                                |
| isLoading     | Boolean   | false   | No       | If the message is loading, we will add a loading animation to the chat bubble                                                     |
| isError       | Boolean   | false   | No       | If the message is an error, we will add a different style to the chat bubble                                                      |
| ErrorText    | String    | null    | No       | If the message is an error, we will show the error message in the chat bubble                                                     |
| onErrorClick | Function | null    | No       | callback to be called onErrorClick          |
| feedbackOptions | Array<{icon: ReactNode, onClick: Function}> | null | No | if this is passed as an array, we will show feedbacOptions, otherwise not        |
| children      | ReactNode | string | null    | yes       | The children that will be rendered inside the chat bubble. can  be react node or a string                                                                      |
| avatarIcon        | ReactNode | null    | No       | it will be an Icon that will be rendered inside avatar                                      |
| avatarIconColor        | string | null    | No       | it will be the color of the avatarIcon                                      |

```tsx
type ChatBubbleProps = {
  isLastMessage?: boolean;
  isUserMessage?: boolean;
  isLoading?: boolean;
  isError?: boolean;  
  feedbackOptions?: Array<{icon: ReactNode, onClick: Function}>;
  ErrorText?: string;
  onErrorClick?: Function;
  children?: ReactNode | string;
  avatarIcon?: IconComponent; 
  avatarIconColor?: string;
}
```

## API 
```tsx

// for animation
<Move>
  <ChatBubble>Demo Text</ChatBubble>
</Move>

// with card
<ChatBubble><Card></Card></ChatBubble>

//Feedback Options 
<ChatBubble feedbackOptions={[{icon: <Icon />, onClick: () => {},}]}>
  <Text> Demo Text</Text>
  <ChipGroup></ChipGroup>
</ChatBubble>

<ChatBubble><Markdown>  Demo Text </Markdown></ChatBubble>
<ChatBubble><Markdown> Demo Text </Markdown></ChatBubble>

# Alternative API

// for animation
<Move>
<ChatBubble message="Demo Text"/>
</Move>

// with card
<ChatBubble cardBody={<SomeComponent/>} />

//Feedback Options 
<ChatBubble feedbackOptions={[{icon: <Icon />, onClick: () => {},}]} message="Demo text"/>


// Markdown
<ChatBubble markdown="# this is markdown" />
````


## Open Questions
- should we have validation state for chat bubble?
- should their be an animation in case of error?
- do we really need feedback options?
- should we add an prop to disable the animation?
- should we add a trailing option to the chat bubble?
- Still need to think about the name ?