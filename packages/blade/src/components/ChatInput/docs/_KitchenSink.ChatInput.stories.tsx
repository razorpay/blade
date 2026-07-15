import { ChatInput as BladeChatInput } from '../ChatInput';
import { Box } from '~components/Box';
import { Heading } from '~components/Typography';

export const ChatInput = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6" maxWidth="375px">
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Heading size="small">Single-line</Heading>
        <BladeChatInput variant="single-line" placeholder="Ask anything..." />
      </Box>

      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Heading size="small">With value</Heading>
        <BladeChatInput variant="single-line" defaultValue="Show recent settlements" />
      </Box>

      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Heading size="small">Generating</Heading>
        <BladeChatInput
          variant="single-line"
          defaultValue="Summarise this report"
          isGenerating
          onStop={() => undefined}
        />
      </Box>

      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Heading size="small">Disabled</Heading>
        <BladeChatInput variant="single-line" placeholder="Ask anything..." isDisabled />
      </Box>
    </Box>
  );
};

export default {
  title: 'Components/KitchenSink/ChatInput',
  component: ChatInput,
  parameters: {
    chromatic: { disableSnapshot: false },
    options: { showPanel: false },
  },
};
