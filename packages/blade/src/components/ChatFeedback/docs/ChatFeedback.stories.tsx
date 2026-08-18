import type { StoryFn, Meta } from '@storybook/react-vite';
import React, { useState } from 'react';
import { ChatFeedback } from '../ChatFeedback';
import type { ChatFeedbackProps } from '../types';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Heading } from '~components/Typography';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ChatFeedback"
      componentDescription="ChatFeedback is a compact, inline feedback flow for AI chat surfaces. It walks the user from a four-point mood scale, to a quick tag follow-up, to a thank-you — with an optional free-text comment. It renders no surface of its own and does not remove itself: pair it with a composer and hide it when `onDismiss` fires. Currently web-only and under evaluation."
      apiDecisionLink={null}
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { ChatFeedback } from '@razorpay/blade/components';

        function App() {
          const [show, setShow] = React.useState(true);

          if (!show) return null;


          return (
            <ChatFeedback
             
              question="How's Ray doing so far?"
              onSubmit={(payload) => console.log('feedback', payload)}
              onDismiss={() => setShow(false)}
            />
          );
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/ChatFeedback',
  component: ChatFeedback,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: { page: Page },
  },
} as Meta<ChatFeedbackProps>;

/**
 * ChatFeedback does not remove itself — it fires `onDismiss` when the flow ends and the
 * consumer hides it. The replay button remounts a fresh flow, since no state survives unmount.
 */
const ChatFeedbackTemplate: StoryFn<typeof ChatFeedback> = (args) => {
  const [show, setShow] = useState(true);

  return (
    <Box width="100%" maxWidth="660px" display="flex" flexDirection="column" gap="spacing.4">
      {show ? (
        <ChatFeedback
          {...args}
          onSubmit={(payload) => {
            // eslint-disable-next-line no-console
            console.log('onSubmit', payload);
          }}
          onDismiss={() => setShow(false)}
        />
      ) : (
        <Button variant="tertiary" size="small" onClick={() => setShow(true)}>
          Show feedback again
        </Button>
      )}
    </Box>
  );
};

export const Default = ChatFeedbackTemplate.bind({});
Default.args = { question: "How's Ray doing so far?" };
Default.storyName = 'Default';

export const WithoutAutoDismiss = ChatFeedbackTemplate.bind({});
WithoutAutoDismiss.args = {
  question: "How's Ray doing so far?",
  // Nothing hides the flow after the thank-you; the consumer stays in control.
  autoDismiss: false,
};
WithoutAutoDismiss.storyName = 'Without auto dismiss';

export const CustomMoodConfig = ChatFeedbackTemplate.bind({});
CustomMoodConfig.args = {
  question: 'How was this answer?',
  // Only the moods you pass are overridden; the rest keep their defaults.
  moodConfig: {
    'very-satisfied': {
      question: 'Amazing! What made it great?',
      tags: ['Accurate', 'Well written', 'Saved me time', 'Other'],
    },
    'very-dissatisfied': {
      question: 'Sorry about that. What broke?',
      tags: ['Wrong', 'Off-topic', 'Too vague', 'Other'],
    },
  },
};
CustomMoodConfig.storyName = 'Custom mood config';
