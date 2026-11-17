import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, waitFor } from 'storybook/test';
import React, { useState } from 'react';
import { RazorSenseChat, RazorSenseBottomWave } from '..';
import { RazorSenseLoader } from '../../RazorSenseLoader';
import { RazorSenseChatBackground } from '../../RazorSenseChatBackground';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ChatInput } from '~components/ChatInput';
import { ChatMessage } from '~components/ChatMessage';
import { Text } from '~components/Typography';

// These hold with or without a GPU: where the effect can't animate (CI's browsers often have no WebGL2) each component shows
// its still, and what's checked here (the thinking label, the splash completing, the wrapped inputs) works the same either way.

// A loading ChatMessage inside a RazorSenseChat shows its loadingText as the thinking label, and its answer once it's loaded
export const TestRazorSenseChatThinksWhileAMessageLoads: StoryFn<typeof RazorSenseChat> = () => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <Box height="520px" display="flex" flexDirection="column">
      <Button size="small" variant="secondary" onClick={() => setIsLoading(false)}>
        Answer
      </Button>
      <Box flex="1" minHeight="0px">
        <RazorSenseChat>
          <Box display="flex" flexDirection="column" height="100%" paddingX="spacing.6">
            <Box flex="1" paddingY="spacing.9">
              <ChatMessage
                senderType="other"
                isLoading={isLoading}
                loadingText="Searching your settlements"
              >
                <Text>Here are your settlements for March.</Text>
              </ChatMessage>
            </Box>
            <RazorSenseBottomWave>
              <ChatInput placeholder="Ask anything..." />
            </RazorSenseBottomWave>
          </Box>
        </RazorSenseChat>
      </Box>
    </Box>
  );
};

TestRazorSenseChatThinksWhileAMessageLoads.play = async ({ canvasElement }) => {
  const { getByText, queryByText, getByRole } = within(canvasElement);
  await waitFor(() => expect(getByText('Searching your settlements')).toBeInTheDocument());
  await userEvent.click(getByRole('button', { name: 'Answer' }));
  await waitFor(() =>
    expect(getByText('Here are your settlements for March.')).toBeInTheDocument(),
  );
  await waitFor(() => expect(queryByText('Searching your settlements')).not.toBeInTheDocument());
};

// The splash calls onComplete once loading ends: at once if it hadn't drawn yet, else once it has played out (up to 8 s)
export const TestRazorSenseLoaderCompletesOnceLoaded: StoryFn<typeof RazorSenseLoader> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [completed, setCompleted] = useState(0);
  return (
    <Box>
      <Button size="small" variant="secondary" onClick={() => setIsLoading(false)}>
        Page ready
      </Button>
      <Text>{`completed: ${completed}`}</Text>
      <Box position="relative" width="480px" height="320px">
        <RazorSenseLoader isLoading={isLoading} onComplete={() => setCompleted((n) => n + 1)} />
      </Box>
    </Box>
  );
};

TestRazorSenseLoaderCompletesOnceLoaded.play = async ({ canvasElement }) => {
  const { getByText, getByRole } = within(canvasElement);
  await expect(getByText('completed: 0')).toBeInTheDocument();
  await userEvent.click(getByRole('button', { name: 'Page ready' }));
  await waitFor(() => expect(getByText('completed: 1')).toBeInTheDocument(), { timeout: 12000 });
};

// The chat background and the bottom wave wrap their chat input without getting in its way: it takes focus and typing
export const TestRazorSenseKeepsItsInputsUsable: StoryFn<typeof RazorSenseChatBackground> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.10" padding="spacing.10">
    <RazorSenseChatBackground>
      <ChatInput placeholder="Ask on the landing" />
    </RazorSenseChatBackground>
    <Box height="200px" position="relative">
      <RazorSenseChat>
        <Box display="flex" flexDirection="column" justifyContent="flex-end" height="100%">
          <RazorSenseBottomWave>
            <ChatInput placeholder="Ask in the chat" />
          </RazorSenseBottomWave>
        </Box>
      </RazorSenseChat>
    </Box>
  </Box>
);

TestRazorSenseKeepsItsInputsUsable.play = async ({ canvasElement }) => {
  const { getByPlaceholderText } = within(canvasElement);
  for (const [placeholder, text] of [
    ['Ask on the landing', 'Settlements for March'],
    ['Ask in the chat', 'And for April?'],
  ]) {
    const input = getByPlaceholderText(placeholder);
    await userEvent.click(input);
    await expect(input).toHaveFocus();
    await userEvent.type(input, text);
    await expect(input).toHaveValue(text);
  }
};

export default {
  title: 'Components/Interaction Tests/RazorSense 2.0',
  component: RazorSenseChat,
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
