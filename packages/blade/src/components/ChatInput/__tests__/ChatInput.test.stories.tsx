import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import { ChatInput } from '../ChatInput';
import { Box } from '~components/Box';

const onSubmit = fn();

export const SingleLineInteraction: StoryFn<typeof ChatInput> = (): React.ReactElement => {
  return (
    <Box maxWidth="375px">
      <ChatInput variant="single-line" placeholder="Ask anything..." onSubmit={onSubmit} />
    </Box>
  );
};

SingleLineInteraction.play = async ({ canvasElement }) => {
  onSubmit.mockClear();
  const canvas = within(canvasElement);
  const input = canvas.getByRole('textbox', { name: 'Chat input' });
  const submitButton = canvas.getByRole('button', { name: 'Submit' });

  await expect(input).toHaveAttribute('enterkeyhint', 'send');
  await expect(submitButton).toBeDisabled();

  await userEvent.type(input, 'Show recent settlements');
  await expect(submitButton).toBeEnabled();
  await userEvent.keyboard('{Enter}');

  await expect(onSubmit).toHaveBeenCalledWith({
    value: 'Show recent settlements',
    fileList: [],
  });
};

export default {
  title: 'Components/Interaction Tests/ChatInput',
  component: ChatInput,
  parameters: {
    controls: { disable: true },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: false },
  },
};
