import type { StoryFn, Meta } from '@storybook/react';
import React, { useState, useRef } from 'react';
import { ChatInput } from '../ChatInput';
import type { ChatInputProps } from '../types';
import type { BladeFileList } from '~components/FileUpload/types';
import { Box } from '~components/Box';
import { Heading, Text } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';

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
        maxFileSize={5 * 1024 * 1024}
        maxFileCount={5}
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
        maxFileSize={5 * 1024 * 1024}
        maxFileCount={5}
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
