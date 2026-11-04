import type { StoryFn, Meta } from '@storybook/react-vite';
import React, { useState } from 'react';
import type { ReactElement } from 'react';
import { Flow9Landing } from './flow9Showcase';
import { FreshChatBackground } from '../FreshChatBackground';
import type { FreshChatBackgroundProps } from '../FreshChatBackground';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { useTheme } from '~components/BladeProvider';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FreshChatBackground"
      componentDescription="RazorSense behind the chat input. Idle, it's a soft fluted strip drifting and breathing; as someone types it pulses into its typing surge and dies back down to idle. One component: `variant` holds it idle or in its typing surge, and like RazorSense it follows Blade's color scheme (switch light and dark with Color Scheme in the toolbar). One of the Fresh RazorSense components, which ship next to RazorSense and leave it as it is."
    />
  );
};

export default {
  title: 'Components/RazorSense/Fresh Chat Background',
  component: FreshChatBackground,
  args: {
    variant: 'idle',
    width: 840,
    height: 97,
    scale: 1,
    isPaused: false,
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['idle', 'typing-surge'],
    },
    width: { control: { type: 'range', min: 504, max: 1260, step: 4 } },
    height: { control: { type: 'range', min: 58, max: 146, step: 1 } },
    scale: { control: { type: 'range', min: 0.75, max: 1.25, step: 0.05 } },
    inputValue: { control: false },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: Page,
    },
  },
} as Meta<FreshChatBackgroundProps>;

/**
 * Flow 9's landing chat input, the chat background laid on it as flow 9 lays it. `width` and `height` in Controls size the chat
 * input and the chat background with it (its strip stretches to fit, the bands keep their size); `scale` sizes the whole effect;
 * `variant` holds it idle or in its typing surge; light or dark is Color Scheme in the toolbar. Type in the chat input: every
 * keystroke pulses the typing surge in; it dies back down to idle a moment after you stop.
 */
const FreshChatBackgroundTemplate: StoryFn<typeof FreshChatBackground> = (args) => {
  const [text, setText] = useState('');
  const isDark = useTheme().colorScheme === 'dark';
  return (
    <Flow9Landing
      isDark={isDark}
      value={text}
      onChange={setText}
      inputWidth={typeof args.width === 'number' ? args.width : undefined}
      inputHeight={typeof args.height === 'number' ? args.height : undefined}
    >
      <FreshChatBackground {...args} inputValue={text} />
    </Flow9Landing>
  );
};

export const Default = FreshChatBackgroundTemplate.bind({});
Default.storyName = 'Default';
