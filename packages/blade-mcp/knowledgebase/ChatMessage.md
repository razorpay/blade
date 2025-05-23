## Component Name

ChatMessage

## Description

ChatMessage is a visual representation of a message in a chat interface. It provides a consistent way to display messages from different senders, supporting various states such as loading and error, and can include icons, custom content, and interactive elements. This component is designed to handle different message types and can be customized with various styling options.

## TypeScript Types

The following types represent the props that the ChatMessage component accepts. These allow you to properly configure the component according to your needs.

```typescript
/**
 * Props for the ChatMessage component
 */
type ChatMessageProps = {
  /**
   * The content of the chat message
   */
  children?: React.ReactNode;

  /**
   * Indicates the type of sender for the message
   * 'self': Messages from the current user
   * 'other': Messages from other users or agents
   */
  senderType: 'self' | 'other';

  /**
   * Type of message which affects styling and layout
   * 'default': Standard message in a sequence
   * 'last': Last message in a sequence (has different styling)
   * @default 'default'
   */
  messageType?: 'default' | 'last';

  /**
   * Element to display before the message (like an avatar or icon)
   * Typically used with senderType="other"
   */
  leading?: React.ReactNode;

  /**
   * Whether the message is in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Text to display when the message is in loading state
   */
  loadingText?: string;

  /**
   * Validation state of the message
   */
  validationState?: 'error';

  /**
   * Text to display when the message is in an error state
   */
  errorText?: string;

  /**
   * Function called when the message is clicked
   */
  onClick?: () => void;

  /**
   * Content to render in the footer of the message
   */
  footerActions?: React.ReactNode;

  /**
   * How to handle word breaking in the message
   * @default 'normal'
   */
  wordBreak?: 'normal' | 'break-all' | 'break-word' | 'keep-all';
} & StyledPropsBlade &
  TestID &
  DataAnalyticsAttribute;
```

## Examples

### Comprehensive Chat Interface

This example demonstrates a complete chat interface with various ChatMessage types, states, interactions, and accessibility considerations.

```tsx
import React, { useState } from 'react';
import {
  ChatMessage,
  Box,
  Text,
  Card,
  CardBody,
  RadioGroup,
  Radio,
  ChipGroup,
  Chip,
  Button,
  RayIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  SendIcon,
} from '@razorpay/blade/components';

const ComprehensiveChatExample = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! How can I assist you with Razorpay today?',
      senderType: 'other',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      text: 'I need help setting up payment gateway',
      senderType: 'self',
      timestamp: '10:31 AM',
    },
    {
      id: '3',
      text: 'Sure, I can help with that. What platform are you integrating with?',
      senderType: 'other',
      timestamp: '10:32 AM',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [failedMessage, setFailedMessage] = useState({
    id: '4',
    text: 'I am using React for a web application',
    senderType: 'self',
    failed: true,
    timestamp: '10:33 AM',
  });

  const handleRetry = () => {
    setFailedMessage((prev) => ({ ...prev, failed: false }));
    // Simulate sending message again
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: '4',
          text: 'I am using React for a web application',
          senderType: 'self',
          timestamp: '10:34 AM',
        },
      ]);

      // Simulate response after sending
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: '5',
            text:
              'Great! For React applications, you can use our React SDK. Would you like me to show you how to set it up?',
            senderType: 'other',
            timestamp: '10:35 AM',
          },
        ]);
      }, 2000);
    }, 500);
  };

  const handleFeedback = (value) => {
    console.log(`Feedback: ${value}`);
  };

  return (
    <Box
      maxWidth="600px"
      margin="auto"
      padding="spacing.5"
      aria-label="Chat conversation about payment gateway integration"
    >
      <Text
        size="small"
        color="surface.text.gray.muted"
        textAlign="center"
        marginBottom="spacing.4"
        aria-hidden="true"
      >
        Today
      </Text>

      <Box
        backgroundColor="surface.background.gray.subtle"
        padding="spacing.5"
        borderRadius="medium"
        display="flex"
        flexDirection="column"
        gap="spacing.4"
      >
        {/* Messages */}
        <Box display="flex" flexDirection="column" gap="spacing.3">
          {/* Regular messages */}
          {messages.map((message, index) => {
            const isLastFromSender =
              index === messages.length - 1 ||
              messages[index + 1]?.senderType !== message.senderType;

            const showLeadingIcon =
              message.senderType === 'other' &&
              (index === 0 || messages[index - 1]?.senderType !== 'other');

            return (
              <ChatMessage
                key={message.id}
                senderType={message.senderType === 'self' ? 'self' : 'other'}
                messageType={isLastFromSender ? 'last' : 'default'}
                leading={
                  showLeadingIcon ? (
                    <RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />
                  ) : undefined
                }
                wordBreak="break-word"
                marginLeft={message.senderType === 'other' && !showLeadingIcon ? '24px' : undefined}
                footerActions={
                  message.senderType === 'other' && index === messages.length - 1 ? (
                    <Box display="flex" justifyContent="flex-start" marginTop="spacing.2">
                      <ChipGroup label="">
                        <Chip value="helpful" icon={ThumbsUpIcon} />
                        <Chip value="not-helpful" icon={ThumbsDownIcon} />
                      </ChipGroup>
                    </Box>
                  ) : undefined
                }
                data-analytics={`chat-message-${message.id}`}
                aria-label={`${message.senderType === 'self' ? 'You' : 'Support agent'}: ${
                  message.text
                }`}
              >
                {message.text}
                <Text
                  size="xsmall"
                  color="surface.text.gray.muted"
                  display="block"
                  marginTop="spacing.2"
                  aria-hidden="true"
                >
                  {message.timestamp}
                </Text>
              </ChatMessage>
            );
          })}

          {/* Failed message */}
          {failedMessage.failed && (
            <ChatMessage
              senderType="self"
              messageType="last"
              validationState="error"
              errorText="Message not sent. Tap to retry."
              onClick={handleRetry}
              testID="failed-message"
              aria-label={`Failed message: ${failedMessage.text}. Tap to retry sending.`}
            >
              {failedMessage.text}
              <Text
                size="xsmall"
                color="surface.text.gray.muted"
                display="block"
                marginTop="spacing.2"
                aria-hidden="true"
              >
                {failedMessage.timestamp}
              </Text>
            </ChatMessage>
          )}

          {/* Loading state */}
          {isLoading && (
            <ChatMessage
              isLoading
              senderType="other"
              loadingText="Typing a response..."
              leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
              aria-label="Support agent is typing a response"
            />
          )}
        </Box>

        {/* Interactive question with radio options */}
        <ChatMessage
          senderType="other"
          leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
          messageType="last"
          aria-label="Support agent: What kind of business do you run?"
        >
          <Card>
            <CardBody>
              <Box display="flex" flexDirection="column" gap="spacing.3">
                <Text variant="body" size="medium">
                  What kind of business do you run?
                </Text>
                <RadioGroup
                  value={selectedOption}
                  onChange={({ value }) => setSelectedOption(value)}
                  aria-label="Business type options"
                >
                  <Radio value="ecommerce">E-commerce</Radio>
                  <Radio value="saas">SaaS</Radio>
                  <Radio value="marketplace">Marketplace</Radio>
                  <Radio value="other">Other</Radio>
                </RadioGroup>
                {selectedOption && (
                  <Button
                    variant="primary"
                    size="small"
                    icon={SendIcon}
                    iconPosition="right"
                    marginTop="spacing.2"
                    onClick={() => console.log(`Selected: ${selectedOption}`)}
                    aria-label={`Submit selected option: ${selectedOption}`}
                  >
                    Submit
                  </Button>
                )}
              </Box>
            </CardBody>
          </Card>
        </ChatMessage>
      </Box>
    </Box>
  );
};

export default ComprehensiveChatExample;
```
