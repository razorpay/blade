import type { StoryFn, Meta } from '@storybook/react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatInput } from '../ChatInput';
import type { ChatInputProps } from '../types';
import type { BladeFileList } from '~components/FileUpload/types';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { ChatMessage } from '~components/ChatMessage';
import { RayIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Radio, RadioGroup } from '~components/Radio';
import { Move } from '~components/Move';
import { Badge } from '~components/Badge';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ChatInput"
      componentDescription="ChatInput is an input component designed for AI chat interfaces. It combines a textarea, file upload, ghost suggestion autocomplete, and a submit action into a single composable input."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/QjSexUED296OBCwWwhYKQE/agenticSpark?node-id=116756-67218&m=dev"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { ChatInput } from '@razorpay/blade/components';
        
        function App() {
          return (
            <ChatInput
              placeholder="Ask a question..."
              onSubmit={({ value }) => console.log('Submitted:', value)}
            />
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/ChatInput',
  component: ChatInput,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChatInputProps>;

const ChatInputTemplate: StoryFn<typeof ChatInput> = (args) => {
  return (
    <Box maxWidth="600px">
      <ChatInput {...args} />
    </Box>
  );
};

export const Default = ChatInputTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  placeholder: 'Ask a question...',
};

export const WithPlaceholder = ChatInputTemplate.bind({});
WithPlaceholder.storyName = 'With Placeholder';
WithPlaceholder.args = {
  placeholder: 'Type your message here...',
};

export const Disabled = ChatInputTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  placeholder: 'Ask a question...',
  isDisabled: true,
};

export const WithGhostSuggestions: StoryFn<typeof ChatInput> = () => {
  return (
    <Box maxWidth="600px">
      <ChatInput
        placeholder="Ask a question..."
        suggestions={[
          'Ask Ray anything related to Razorpay',
          'Show me recent transactions',
          'Help me set up webhooks',
        ]}
        onSuggestionAccept={({ suggestion }) => {
          console.log('Accepted suggestion:', suggestion);
        }}
        onSubmit={({ value }) => console.log('Submitted:', value)}
      />
    </Box>
  );
};
WithGhostSuggestions.storyName = 'With Ghost Suggestions';

export const WithFileUpload: StoryFn<typeof ChatInput> = () => {
  const [files, setFiles] = useState<BladeFileList>([]);

  return (
    <Box maxWidth="600px" display="flex" flexDirection="column" gap="spacing.5">
      <ChatInput
        placeholder="Ask a question..."
        fileList={files}
        onFileChange={({ fileList }) => setFiles(fileList)}
        onFileRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
        accept=".jpg,.png,.pdf,.xlsx"
        onSubmit={({ value, fileList }) => {
          console.log('Submitted:', value, 'Files:', fileList);
          setFiles([]);
        }}
      />
      <Text size="small" color="surface.text.gray.muted">
        Attached files: {files.length}
      </Text>
    </Box>
  );
};
WithFileUpload.storyName = 'With File Upload';

export const WithValidationError: StoryFn<typeof ChatInput> = () => {
  const [validationState, setValidationState] = useState<'error' | 'none'>('none');
  const [errorText, setErrorText] = useState('Something went wrong. Please try again.');

  return (
    <Box
      maxWidth="600px"
      paddingTop="spacing.8"
      display="flex"
      flexDirection="column"
      gap="spacing.5"
    >
      <ChatInput
        placeholder="Ask a question..."
        validationState={validationState}
        errorText={errorText}
        onErrorDismiss={() => setValidationState('none')}
        onSubmit={({ value }) => {
          console.log('value', value);
          setErrorText(`"${value}"? What is even that. Ask better questions`);
          setValidationState('error');
        }}
      />
    </Box>
  );
};
WithValidationError.storyName = 'With Validation Error';

export const StopGeneration: StoryFn<typeof ChatInput> = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  return (
    <Box maxWidth="600px" display="flex" flexDirection="column" gap="spacing.5">
      <ChatInput
        placeholder="Ask a question..."
        isGenerating={isGenerating}
        onSubmit={({ value }) => {
          console.log('Submitted:', value);
          const controller = new AbortController();
          abortRef.current = controller;
          setIsGenerating(true);
          setTimeout(() => {
            setIsGenerating(false);
          }, 5000);
        }}
        onStop={() => {
          console.log('Stopped generation');
          abortRef.current?.abort();
          setIsGenerating(false);
        }}
      />
      <Text size="small" color="surface.text.gray.muted">
        {isGenerating ? 'Generating... (auto-stops in 5s)' : 'Ready'}
      </Text>
    </Box>
  );
};
StopGeneration.storyName = 'Stop Generation';

export const FullFeatured: StoryFn<typeof ChatInput> = () => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<BladeFileList>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = ({ value, fileList }: { value: string; fileList: BladeFileList }): void => {
    console.log('Submitted:', value, 'Files:', fileList);
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);
    setText('');
    setFiles([]);

    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <Box maxWidth="600px">
      <ChatInput
        value={text}
        onChange={({ value }) => setText(value)}
        onSubmit={handleSubmit}
        placeholder="Ask a question..."
        isGenerating={isGenerating}
        onStop={() => {
          abortRef.current?.abort();
          setIsGenerating(false);
        }}
        fileList={files}
        onFileChange={({ fileList }) => setFiles(fileList)}
        onFileRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
        accept=".jpg,.png,.pdf,.xlsx"
        suggestions={[
          'How do I integrate payment gateway?',
          'Show me recent transactions',
          'Help me set up webhooks',
        ]}
        onSuggestionAccept={({ suggestion }) => {
          setText(suggestion);
        }}
      />
    </Box>
  );
};
FullFeatured.storyName = 'Full Featured';

export const PasteImageUpload: StoryFn<typeof ChatInput> = () => {
  const [files, setFiles] = useState<BladeFileList>([]);

  return (
    <Box maxWidth="600px" display="flex" flexDirection="column" gap="spacing.8">
      <ChatInput
        placeholder="Try pasting an image here..."
        fileList={files}
        onFileChange={({ fileList }) => setFiles(fileList)}
        onFileRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
        accept="image/*"
        onSubmit={({ value, fileList }) => {
          console.log('Submitted:', value, 'Files:', fileList);
          setFiles([]);
        }}
      />
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Text size="small" color="surface.text.gray.muted">
          Right-click the image below and copy it, then paste (Ctrl/Cmd+V) into the input above.
        </Text>
        <img
          src="https://picsum.photos/300/200"
          alt="Sample"
          style={{ width: 300, borderRadius: 8 }}
        />
      </Box>
    </Box>
  );
};
PasteImageUpload.storyName = 'Paste Image Upload';

// ─── Product Usecase: Chat Experience ───────────────────────────────────────

type ChatMsg = {
  id: string;
  senderType: 'self' | 'other';
  content: string | React.ReactNode;
  messageType?: 'default' | 'last';
  isLoading?: boolean;
  isStreaming?: boolean;
  loadingTexts?: string[];
  validationState?: 'error' | 'none';
  errorText?: string;
};

type MockResponseResult =
  | { type: 'text'; text: string }
  | { type: 'rich'; content: React.ReactNode }
  | { type: 'error' };

const simulateStream = (
  text: string,
  signal: AbortSignal,
  onChunk: (partial: string) => void,
  onDone: () => void,
): void => {
  const words = text.split(' ');
  let i = 0;
  const tick = (): void => {
    if (signal.aborted) return;
    if (i < words.length) {
      onChunk(words.slice(0, i + 1).join(' '));
      i++;
      setTimeout(tick, 45);
    } else {
      onDone();
    }
  };
  tick();
};

const INITIAL_MESSAGES: ChatMsg[] = [
  {
    id: 'msg-agent-1',
    senderType: 'other',
    content:
      'Hello! This is a basic demo with ChatInput and ChatMessage components of Blade design system. You can accept the suggestions with tab in input to see different types of responses. Try adding more than 3 files in FileUpload to see error from file upload.',
  },
];

const LOADING_TEXTS = [
  'Analyzing your request...',
  'Fetching relevant details...',
  'Preparing your response...',
  'Almost there...',
];

const WebhookResponseCard = (): React.ReactElement => (
  <Card>
    <CardBody>
      <Box display="flex" gap="spacing.4" flexDirection="column">
        <Text variant="body" size="medium" weight="semibold">
          Set up your webhook endpoint
        </Text>
        <Text variant="body" size="small" color="surface.text.gray.muted">
          Choose where to receive Razorpay webhook events:
        </Text>
        <RadioGroup label="Webhook destination">
          <Radio value="existing">Use an existing server endpoint</Radio>
          <Radio value="serverless">Deploy a serverless function</Radio>
          <Radio value="ngrok">Use ngrok for local testing</Radio>
        </RadioGroup>
        <Text variant="body" size="small" color="surface.text.gray.muted">
          After selecting, I&apos;ll walk you through the configuration steps.
        </Text>
      </Box>
    </CardBody>
  </Card>
);

const TransactionsCard = (): React.ReactElement => (
  <Box display="flex" flexDirection="column" gap="spacing.3">
    <Text variant="body" size="medium">
      Here are your last 3 transactions:
    </Text>
    {[
      { id: 'pay_PQR123', amount: '₹2,499', status: 'positive' as const, label: 'Captured' },
      { id: 'pay_ABC456', amount: '₹750', status: 'positive' as const, label: 'Captured' },
      { id: 'pay_XYZ789', amount: '₹12,000', status: 'negative' as const, label: 'Failed' },
    ].map((txn) => (
      <Box
        key={txn.id}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        paddingX="spacing.3"
        paddingY="spacing.2"
      >
        <Box display="flex" flexDirection="column">
          <Text variant="body" size="small" weight="semibold">
            {txn.id}
          </Text>
          <Text variant="body" size="small" color="surface.text.gray.muted">
            {txn.amount}
          </Text>
        </Box>
        <Badge color={txn.status}>{txn.label}</Badge>
      </Box>
    ))}
  </Box>
);

const getMockResponse = (userMessage: string): MockResponseResult => {
  const lower = userMessage.toLowerCase();

  if (/webhook/i.test(lower)) {
    return { type: 'rich', content: <WebhookResponseCard /> };
  }

  if (/transaction|payment history|recent/i.test(lower)) {
    return { type: 'rich', content: <TransactionsCard /> };
  }

  if (/error|fail|broken|not working/i.test(lower)) {
    return { type: 'error' };
  }

  if (/integrate|integration|sdk|api key/i.test(lower)) {
    return {
      type: 'text',
      text:
        'To integrate Razorpay, start by signing up and grabbing your API keys from the Dashboard. Then install the SDK by running npm install razorpay in your project. Next, initialize the SDK with your key_id and key_secret. After that, create an Order using the Orders API, and finally open the Razorpay Checkout on your frontend to accept payments. Would you like a code snippet for a specific language or framework?',
    };
  }

  return {
    type: 'text',
    text:
      "That's a great question! Razorpay provides comprehensive APIs, SDKs, and a developer dashboard to help you build and manage payments seamlessly. Is there a specific area you'd like to dive deeper into — like subscriptions, refunds, or settlements?",
  };
};

const startResponse = (
  responseId: string,
  userMsgId: string | null,
  value: string,
  signal: AbortSignal,
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>,
  setIsGenerating: (v: boolean) => void,
): void => {
  if (signal.aborted) return;
  const result = getMockResponse(value);

  if (result.type === 'error') {
    setMessages((prev) =>
      prev
        .filter((msg) => msg.id !== responseId)
        .map((msg) =>
          msg.id === userMsgId
            ? {
                ...msg,
                validationState: 'error' as const,
                errorText: 'Message failed to send. Tap to retry.',
              }
            : msg,
        ),
    );
    setIsGenerating(false);
    return;
  }

  if (result.type === 'rich') {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === responseId
          ? { ...msg, isLoading: false, loadingTexts: undefined, content: result.content }
          : msg,
      ),
    );
    setIsGenerating(false);
    return;
  }

  // Text response — transition loading → streaming
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === responseId
        ? { ...msg, isLoading: false, loadingTexts: undefined, isStreaming: true, content: '' }
        : msg,
    ),
  );

  simulateStream(
    result.text,
    signal,
    (partial) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === responseId ? { ...msg, content: partial } : msg)),
      );
    },
    () => {
      if (signal.aborted) return;
      setMessages((prev) =>
        prev.map((msg) => (msg.id === responseId ? { ...msg, isStreaming: false } : msg)),
      );
      setIsGenerating(false);
    },
  );
};

export const ProductUsecaseChatExperience: StoryFn<typeof ChatInput> = () => {
  const [messages, setMessages] = useState<ChatMsg[]>(INITIAL_MESSAGES);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<BladeFileList>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputErrorText, setInputErrorText] = useState<string | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    'Set up webhooks',
    'Invalid PAN Number',
    'Show me Error',
    'How do I integrate payments?',
    'Show recent transactions',
  ];

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRetry = useCallback((failedMsgId: string, originalContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === failedMsgId ? { ...msg, validationState: 'none', errorText: undefined } : msg,
      ),
    );
    const responseId = `msg-response-${Date.now()}`;
    const controller = new AbortController();
    abortRef.current = controller;
    setIsGenerating(true);
    setMessages((prev) => [
      ...prev,
      {
        id: responseId,
        senderType: 'other',
        isLoading: true,
        loadingTexts: LOADING_TEXTS,
        content: '',
      },
    ]);
    setTimeout(() => {
      startResponse(
        responseId,
        failedMsgId,
        originalContent,
        controller.signal,
        setMessages,
        setIsGenerating,
      );
    }, 1200);
  }, []);

  const handleSubmit = useCallback(
    ({ value, fileList }: { value: string; fileList: BladeFileList }) => {
      if (value.trim().toLowerCase() === 'invalid pan number') {
        setInputErrorText(
          `"${value.trim()}" is not a valid PAN number. Please enter a valid 10-character PAN.`,
        );
        return;
      } else {
        setInputErrorText(undefined);
      }

      const userMsgId = `msg-user-${Date.now()}`;
      const responseId = `msg-response-${Date.now() + 1}`;

      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          senderType: 'self',
          content: fileList.length > 0 ? `${value} [+${fileList.length} file(s)]` : value,
          messageType: 'last',
          validationState: 'none',
        },
        {
          id: responseId,
          senderType: 'other',
          isLoading: true,
          loadingTexts: LOADING_TEXTS,
          content: '',
        },
      ]);

      setText('');
      setFiles([]);

      const controller = new AbortController();
      abortRef.current = controller;
      setIsGenerating(true);

      setTimeout(() => {
        startResponse(
          responseId,
          userMsgId,
          value,
          controller.signal,
          setMessages,
          setIsGenerating,
        );
      }, 1200);
    },
    [],
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isLoading || msg.isStreaming
          ? {
              ...msg,
              isLoading: false,
              isStreaming: false,
              loadingTexts: undefined,
              content: msg.isStreaming
                ? `${msg.content as string} [stopped]`
                : 'Generation was stopped.',
            }
          : msg,
      ),
    );
    setIsGenerating(false);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="640px"
      width="720px"
      marginX="auto"
      overflow="hidden"
      backgroundColor="surface.background.gray.intense"
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        gap="spacing.3"
        padding="spacing.4"
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
      >
        <RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />
        <Box display="flex" flexDirection="column">
          <Text variant="body" size="medium" weight="semibold">
            Ray
          </Text>
          <Text variant="body" size="small" color="surface.text.gray.muted">
            {isGenerating ? 'Typing...' : 'Razorpay AI Assistant'}
          </Text>
        </Box>
      </Box>

      {/* Messages area */}
      <Box
        flex="1"
        overflow="auto"
        padding="spacing.5"
        display="flex"
        flexDirection="column"
        gap="spacing.4"
      >
        {messages.map((msg) => (
          <Move isVisible motionTriggers={['mount']} type="inout" key={msg.id}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems={msg.senderType === 'self' ? 'flex-end' : 'flex-start'}
            >
              <ChatMessage
                senderType={msg.senderType}
                messageType={msg.messageType}
                isLoading={msg.isLoading}
                loadingText={msg.loadingTexts}
                validationState={msg.validationState ?? 'none'}
                errorText={msg.errorText}
                onClick={
                  msg.validationState === 'error'
                    ? () => handleRetry(msg.id, msg.content as string)
                    : undefined
                }
                leading={
                  msg.senderType === 'other' ? (
                    <RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />
                  ) : undefined
                }
              >
                {msg.isLoading ? undefined : msg.content}
              </ChatMessage>
            </Box>
          </Move>
        ))}
        <div ref={scrollAnchorRef} />
      </Box>

      {/* Input area */}
      <Box padding="spacing.4">
        <ChatInput
          value={text}
          onChange={({ value }) => {
            setText(value);
          }}
          onSubmit={handleSubmit}
          validationState={inputErrorText ? 'error' : 'none'}
          errorText={inputErrorText}
          onErrorDismiss={() => setInputErrorText(undefined)}
          isGenerating={isGenerating}
          onStop={handleStop}
          fileList={files}
          onFileChange={({ fileList }) => {
            if (fileList.length > 3) {
              setInputErrorText('You can attach a maximum of 3 files.');
              return;
            }
            setFiles(fileList);
          }}
          onFileRemove={({ file }) => setFiles((prev) => prev.filter((f) => f.id !== file.id))}
          accept=".jpg,.jpeg,.png,.pdf"
          suggestions={suggestions}
          onSuggestionAccept={({ suggestion }) => setText(suggestion)}
          placeholder="Ask Ray anything about Razorpay..."
        />
      </Box>
    </Box>
  );
};
ProductUsecaseChatExperience.storyName = 'Product Usecase: Chat Experience';
