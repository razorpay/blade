import type { StoryFn, Meta } from '@storybook/react-vite';
import { addons } from 'storybook/preview-api';
import { UPDATE_STORY_ARGS } from 'storybook/internal/core-events';
import React, { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { Flow9Chat } from './flow9Showcase';
import { FreshLLM } from '../FreshLLM';
import type { FreshLLMProps } from '../FreshLLM';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { useTheme } from '~components/BladeProvider';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FreshLLM"
      componentDescription="RazorSense in the chat: thinking loops near the top while the answer is worked out, surges down to the chat input when it's in, and settles there to idle, pulsing into its typing surge as the next question is typed. Like RazorSense it follows Blade's color scheme: switch light and dark with Color Scheme in the toolbar. One of the Fresh RazorSense components, which ship next to RazorSense and leave it as it is."
    />
  );
};

export default {
  title: 'Components/RazorSense/Fresh LLM',
  component: FreshLLM,
  args: {
    variant: 'thinking',
    scale: 1,
    isPaused: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['thinking', 'idle'],
    },
    scale: { control: { type: 'range', min: 0.75, max: 1.25, step: 0.05 } },
    inputValue: { control: false },
    chatInputRef: { control: false },
    thinkingRef: { control: false },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: Page,
    },
  },
} as Meta<FreshLLMProps>;

/**
 * Flow 9's chat at flow 9's sizes and places, FreshLLM filling its chat panel and following the chat bar and the thinking row
 * (`chatInputRef`, `thinkingRef`). `scale` sizes the whole effect; light or dark is Color Scheme in the toolbar.
 * Switch `variant` to `idle` in Controls: the thinking surges down to the chat input and settles there (the answer shows 0.4 s in,
 * as in flow 9). Type in the chat input to see the typing surge; Enter asks the next question (`variant` back to `thinking`).
 */
const FreshLLMTemplate: StoryFn<typeof FreshLLM> = (args, context) => {
  const isThinking = args.variant !== 'idle';
  const [isAnswered, setIsAnswered] = useState(false);
  const [question, setQuestion] = useState('How is my business doing today?');
  const [text, setText] = useState('');
  const chatInputRef = useRef<HTMLDivElement | null>(null);
  const thinkingRef = useRef<HTMLDivElement | null>(null);
  const isDark = useTheme().colorScheme === 'dark';
  useEffect(() => {
    if (isThinking) {
      setIsAnswered(false);
      return undefined;
    }
    const timer = setTimeout(() => setIsAnswered(true), 400);
    return () => clearTimeout(timer);
  }, [isThinking]);
  const ask = (): void => {
    if (text.trim()) setQuestion(text.trim());
    setText('');
    // the Controls panel's variant back to thinking (the story's own args: no Storybook hook, the story keeps React state too)
    addons
      .getChannel()
      .emit(UPDATE_STORY_ARGS, { storyId: context.id, updatedArgs: { variant: 'thinking' } });
  };
  return (
    <Flow9Chat
      isDark={isDark}
      isAnswered={isAnswered}
      question={question}
      value={text}
      onChange={setText}
      onSubmit={ask}
      chatInputRef={chatInputRef}
      thinkingRef={thinkingRef}
    >
      <FreshLLM {...args} inputValue={text} chatInputRef={chatInputRef} thinkingRef={thinkingRef} />
    </Flow9Chat>
  );
};

export const Default = FreshLLMTemplate.bind({});
Default.storyName = 'Default';
