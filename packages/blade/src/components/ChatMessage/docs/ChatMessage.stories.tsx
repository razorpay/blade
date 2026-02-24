import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { ChatMessage } from '../ChatMessage';
import type { ChatMessageProps } from '../types';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { CopyIcon, RayIcon, ThumbsDownIcon, ThumbsUpIcon, ShareIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Text } from '~components/Typography';
import { Radio, RadioGroup } from '~components/Radio';
import { Move } from '~components/Move';
import { Stagger } from '~components/Stagger';
import { Fade } from '~components/Fade';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { IconButton as IconButtonComponent } from '~components/Button/IconButton';
import { Divider } from '~components/Divider';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Chip, ChipGroup } from '~components/Chip';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '~components/Table';
import type { TableData } from '~components/Table';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ChatMessage"
      componentDescription="A Chat Message is a visual representation of a message in a chat application."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { ChatMessage } from '@razorpay/blade/components';
        
        function App() {
          return (
            <ChatMessage senderType="self">Hi, from ray!</ChatMessage>
          )
        }

        export default App;
      `}
      </Sandbox>
      <Heading size="large">Rolling Loading Text</Heading>
      <Sandbox showConsole>
        {`
        import { ChatMessage } from '@razorpay/blade/components';
        import { RayIcon } from '@razorpay/blade/components';

        function App() {
          return (
            <ChatMessage
              isLoading
              senderType="other"
              loadingText={[
                'Analyzing your request...',
                'Fetching relevant details...',
                'Preparing your response...',
                'Almost there...',
              ]}
              leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
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
  title: 'Components/ChatMessage',
  component: ChatMessage,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChatMessageProps>;

const ChatMessageTemplate: StoryFn<typeof ChatMessage> = (args) => {
  return (
    <ChatMessage wordBreak="normal" {...args}>
      Hi, Can you help me with the docs?
    </ChatMessage>
  );
};

export const Default = ChatMessageTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  senderType: 'self',
  messageType: 'default',
};

const ChatMessageMessageTypeTemplates: StoryFn<typeof ChatMessage> = () => {
  const messageTypes = ['last', 'default'] as const;
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      {messageTypes.map((message, index) => (
        <ChatMessage senderType="self" messageType={message} key={index}>
          Hi, Can you help me with the docs?
        </ChatMessage>
      ))}
    </Box>
  );
};

export const MessageTypes = ChatMessageMessageTypeTemplates.bind({});
MessageTypes.storyName = 'Message Types';
MessageTypes.args = {};

const ChatMessageSenderTypeTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage senderType="self" messageType="last">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
      <ChatMessage senderType="other" marginLeft="24px">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
    </Box>
  );
};

export const SenderTypes = ChatMessageSenderTypeTemplates.bind({});
SenderTypes.storyName = 'Sender Types';

const SenderTypeWithAndWithoutIconsTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
      <ChatMessage senderType="other" marginLeft="24px">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </ChatMessage>
    </Box>
  );
};
export const SenderTypeWithAndWithoutIcons = SenderTypeWithAndWithoutIconsTemplate.bind({});
SenderTypeWithAndWithoutIcons.storyName = 'Sender Type With and Without Icons';

const ChatMessageLoadingTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage
        isLoading
        senderType="other"
        loadingText="Analyzing your response..."
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      />
    </Box>
  );
};

export const Loading = ChatMessageLoadingTemplates.bind({});
Loading.storyName = 'Loading Chat Message';

const ChatMessageRollingLoadingTextTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage
        isLoading
        senderType="other"
        loadingText={[
          'Analyzing your request...',
          'Fetching relevant details...',
          'Preparing your response...',
          'Almost there...',
        ]}
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      />
    </Box>
  );
};

export const RollingLoadingText = ChatMessageRollingLoadingTextTemplate.bind({});
RollingLoadingText.storyName = 'Rolling Loading Text';

const ChatMessageErrorTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <ChatMessage
        validationState="error"
        senderType="self"
        messageType="last"
        errorText="Message not sent. Tap to retry."
        onClick={() => {
          console.log('Retrying...');
        }}
      >
        Can you help me with the docs?
      </ChatMessage>
    </Box>
  );
};

export const Error = ChatMessageErrorTemplates.bind({});
Error.storyName = 'Error Chat Message';

const ChatMessageBodyTemplates: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box>
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
      >
        <Card>
          <CardBody>
            <Box display="flex" gap="8px" flexDirection="column">
              <Text variant="body" size="medium">
                Where do you want to collect payments?
              </Text>
              <RadioGroup>
                <Radio value="website">Website</Radio>
                <Radio value="android">Android App</Radio>
                <Radio value="ios">iOS App</Radio>
              </RadioGroup>
            </Box>
          </CardBody>
        </Card>
      </ChatMessage>
    </Box>
  );
};

export const ChatMessageBody = ChatMessageBodyTemplates.bind({});
ChatMessageBody.storyName = 'Chat Message Body';

const AnimatedChatMessageTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <Move isVisible motionTriggers={['mount']} type="inout">
          <ChatMessage senderType="self" messageType="last">
            This is a demo message
          </ChatMessage>
        </Move>
      </Box>
    </Box>
  );
};

export const AnimatedChatMessage = AnimatedChatMessageTemplate.bind({});
AnimatedChatMessage.storyName = 'Animated Chat Message';

const ChatMessageWithClickTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <ChatMessage
          senderType="self"
          messageType="last"
          onClick={() => {
            console.log('this is a demo message');
          }}
        >
          This is a demo message
        </ChatMessage>
      </Box>
    </Box>
  );
};

export const ChatMessageWithClick = ChatMessageWithClickTemplate.bind({});
ChatMessageWithClick.storyName = 'Chat Message with Click';

const ChatMessageWithFooterActionsTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <ChatMessage
          senderType="self"
          messageType="last"
          footerActions={
            <Box display="flex" justifyContent="flex-end">
              {/* <ChipGroup label="">
                <Chip value="yes" icon={ThumbsUpIcon} />
                <Chip value="no" icon={ThumbsDownIcon} />
              </ChipGroup> */}
            </Box>
          }
        >
          This is a demo message
        </ChatMessage>
        <ChatMessage
          senderType="other"
          footerActions={
            <Box display="flex" alignItems="center" justifyContent="center" gap="spacing.3">
              <IconButtonComponent
                icon={ThumbsUpIcon}
                accessibilityLabel="Thumbs Up"
                onClick={() => {
                  console.log('Thumbs Up...');
                }}
              />
              <IconButtonComponent
                icon={ThumbsDownIcon}
                accessibilityLabel="Thumbs Down"
                onClick={() => {
                  console.log('Thumbs Down...');
                }}
              />
              <IconButtonComponent
                icon={CopyIcon}
                accessibilityLabel="Copy"
                onClick={() => {
                  console.log('Copying...');
                }}
              />
              <IconButtonComponent
                icon={ShareIcon}
                accessibilityLabel="Share"
                onClick={() => {
                  console.log('Sharing...');
                }}
              />
            </Box>
          }
          leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        >
          This is a demo message
        </ChatMessage>
      </Box>
    </Box>
  );
};

export const ChatMessageWithFooterActions = ChatMessageWithFooterActionsTemplate.bind({});
ChatMessageWithFooterActions.storyName = 'Chat Message with Footer Actions';

const TypingText = ({ text }: { text: string }): React.ReactElement => {
  return (
    <Stagger>
      {text.split(' ').map((letter, index) => (
        <Fade key={index}>
          <Text
            display="inline"
            color="surface.text.gray.normal"
            weight="regular"
            variant="body"
            size="medium"
          >
            {letter}{' '}
          </Text>
        </Fade>
      ))}
    </Stagger>
  );
};
const ChatMessageWithCustomTypingAnimationTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="4px">
      <Box display="flex" flexDirection="column" alignContent="end" gap="4px" width="300px">
        <ChatMessage
          senderType="other"
          leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
        >
          <Box>
            <TypingText text="This is a demo message." />
          </Box>
        </ChatMessage>
      </Box>
    </Box>
  );
};
export const ChatMessageWithCustomTypingAnimation = ChatMessageWithCustomTypingAnimationTemplate.bind(
  {},
);
ChatMessageWithCustomTypingAnimation.storyName = 'Chat Message with Custom Typing Animation';

const suggestedQuestions = [
  'Why is the netbanking pending?',
  'How do I initiate a refund for failed payment?',
  'What are the supported payment methods?',
];

const ChatMessageWithSuggestedQuestionsTemplate: StoryFn<typeof ChatMessage> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.3" maxWidth="400px">
      <ChatMessage
        senderType="other"
        leading={<RayIcon size="large" color="surface.icon.onSea.onSubtle" />}
        footerActions={
          <ActionList>
            {suggestedQuestions.map((question, index) => (
              <ActionListItem
                key={index}
                title={`${index + 1}. ${question}`}
                value={`suggestion-${index}`}
                onClick={() => console.log(`Selected: ${question}`)}
              />
            ))}
          </ActionList>
        }
      >
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Text color="surface.text.gray.normal" weight="regular" variant="body" size="medium">
            How can I help you next?
          </Text>
        </Box>
      </ChatMessage>
      <Divider dividerStyle="dashed" marginLeft="24px" />
    </Box>
  );
};

export const ChatMessageWithSuggestedQuestions = ChatMessageWithSuggestedQuestionsTemplate.bind({});
ChatMessageWithSuggestedQuestions.storyName = 'Chat Message with Suggested Questions';

type PaymentRow = {
  id: string;
  status: string;
  amount: number;
  col3: string;
  col4: string;
  col5: string;
};

const paymentTableData: TableData<PaymentRow> = {
  nodes: [
    {
      id: '1',
      status: 'Captured',
      amount: 1000,
      col3: 'Row Title',
      col4: 'Row Title',
      col5: '01234',
    },
    {
      id: '2',
      status: 'Captured',
      amount: 1000,
      col3: 'Row Title',
      col4: 'Row Title',
      col5: '01234',
    },
    {
      id: '3',
      status: 'Pending',
      amount: 1000,
      col3: 'Row Title',
      col4: 'Row Title',
      col5: '01234',
    },
    {
      id: '4',
      status: 'Captured',
      amount: 1000,
      col3: 'Row Title',
      col4: 'Row Title',
      col5: '01234',
    },
  ],
};

// step 0 → user message visible
// step 1 → AI loading slides in
// step 2 → loading swaps to full content
// step 3 → suggested questions slide in
const FullChatExampleTemplate: StoryFn<typeof ChatMessage> = () => {
  const [step, setStep] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);

  const startAnimation = React.useCallback(() => {
    setStep(0);
    // bump key so Move components remount and re-animate on replay
    setAnimKey((k) => k + 1);
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 5800); // 5s typing animation
    const t3 = setTimeout(() => setStep(3), 6800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  React.useEffect(() => {
    return startAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const footerActions = (
    <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="spacing.3">
      <Box display="flex" gap="spacing.1">
        <IconButtonComponent
          icon={ThumbsUpIcon}
          accessibilityLabel="Thumbs Up"
          onClick={() => console.log('Thumbs Up')}
        />
        <IconButtonComponent
          icon={ThumbsDownIcon}
          accessibilityLabel="Thumbs Down"
          onClick={() => console.log('Thumbs Down')}
        />
        <IconButtonComponent
          icon={CopyIcon}
          accessibilityLabel="Copy"
          onClick={() => console.log('Copy')}
        />
        <IconButtonComponent
          icon={ShareIcon}
          accessibilityLabel="Share"
          onClick={() => console.log('Share')}
        />
      </Box>
      <Text size="small" color="surface.text.gray.muted">
        5 min ago
      </Text>
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" gap="spacing.5" padding="spacing.6">
      <Box display="flex" justifyContent="flex-end">
        <Button size="small" variant="secondary" onClick={startAnimation}>
          Replay
        </Button>
      </Box>

      {/* Self message — always visible, no animation per requirement */}
      <Box display="flex" justifyContent="flex-end">
        <ChatMessage senderType="self" messageType="last">
          How much was settled into my account today?
        </ChatMessage>
      </Box>

      {/* AI message: slides in at step 1; isLoading flips to false at step 2 */}
      {step >= 1 && (
        <Move key={`ai-${animKey}`} isVisible motionTriggers={['mount']} type="inout">
          <ChatMessage
            senderType="other"
            leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
            isLoading={step < 2}
            loadingText={[
              'Analyzing your request...',
              'Fetching payment details...',
              'Preparing your response...',
            ]}
            footerActions={step >= 2 ? footerActions : undefined}
          >
            <Box display="flex" flexDirection="column" gap="spacing.5">
              <Heading size="small" weight="semibold">
                Recent payments from pingal@gmail.com
              </Heading>

              <Text color="surface.text.gray.normal" size="medium">
                Pingal has{' '}
                <Text as="span" weight="semibold" color="surface.text.gray.normal" size="medium">
                  3 recent payments totalling ₹26,000
                </Text>
                . Two are successful (captured) and have been settled. The{' '}
                <Text as="span" weight="semibold" color="surface.text.gray.normal" size="medium">
                  third—a netbanking payment—is still pending
                </Text>{' '}
                as we wait for the customer&apos;s bank to confirm the transfer.
              </Text>

              <Table data={paymentTableData}>
                {(tableData) => (
                  <>
                    <TableHeader>
                      <TableHeaderRow>
                        <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                        <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                        <TableHeaderCell headerKey="COL3">Payment ID</TableHeaderCell>
                        <TableHeaderCell headerKey="COL4">Method</TableHeaderCell>
                        <TableHeaderCell headerKey="COL5">Reference</TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((item, index) => (
                        <TableRow key={index} item={item}>
                          <TableCell>
                            <Badge color={item.status === 'Pending' ? 'notice' : 'positive'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Amount value={item.amount} />
                          </TableCell>
                          <TableCell>{item.col3}</TableCell>
                          <TableCell>{item.col4}</TableCell>
                          <TableCell>{item.col5}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </>
                )}
              </Table>

              <ChipGroup
                accessibilityLabel="Select platform"
                defaultValue="website"
                onChange={({ values }) => console.log('Platform:', values)}
              >
                <Chip value="website">Website</Chip>
                <Chip value="android">Android</Chip>
                <Chip value="ios">iOS</Chip>
                <Chip value="social_media">Social Media</Chip>
                <Chip value="others">Others</Chip>
              </ChipGroup>

              <Box display="flex" gap="spacing.3">
                <Button>Button</Button>
                <Button variant="secondary">Button</Button>
              </Box>
            </Box>
          </ChatMessage>
        </Move>
      )}

      {/* Suggested questions — slides in at step 3 */}
      {step >= 3 && (
        <Move key={`suggestions-${animKey}`} isVisible motionTriggers={['mount']} type="inout">
          <Box display="flex" flexDirection="column" gap="spacing.0">
            <ChatMessage
              senderType="other"
              leading={<RayIcon size="xlarge" color="surface.icon.onSea.onSubtle" />}
            >
              <Box display="flex" flexDirection="column" gap="spacing.3">
                <Text color="surface.text.gray.normal" size="medium">
                  How can I help you next?
                </Text>
                <ActionList>
                  <ActionListItem
                    title="1. Why is the netbanking pending?"
                    value="q1"
                    onClick={() => console.log('Q1 selected')}
                  />
                  <ActionListItem
                    title="2. How long does settlement take?"
                    value="q2"
                    onClick={() => console.log('Q2 selected')}
                  />
                </ActionList>
              </Box>
            </ChatMessage>
            <Divider dividerStyle="dashed" marginLeft="24px" />
          </Box>
        </Move>
      )}
    </Box>
  );
};

export const FullChatExample = FullChatExampleTemplate.bind({});
FullChatExample.storyName = 'Full Chat Example';
