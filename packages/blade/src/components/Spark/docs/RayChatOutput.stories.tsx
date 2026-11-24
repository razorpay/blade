import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { ReactElement } from 'react';
import { RayChatOutput, rayChatOutputGenUI } from '../RayChatOutput';
import type { RayChatOutputProps } from '../RayChatOutput';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { ChatMessage } from '~components/ChatMessage';
import { Code, Text } from '~components/Typography';
import { GenUIProvider, GenUISchemaRenderer } from '~components/GenUI';
import type { GenUIComponent } from '~components/GenUI';

const FIGMA_URL =
  'https://www.figma.com/design/zDA6HofksN59UPR8Kkt4vU/Agentic-Dashboard?node-id=2947-31563';

const Page = (): ReactElement => (
  <StoryPageWrapper
    componentName="RayChatOutput"
    componentDescription="RayChatOutput draws RAY's chat text (the words outside the cards) the way RAY's chat looks: the answer first as the main title when the reply has sections, then titles, body, lists and code. It tidies RAY's text before drawing it: its JSON wrapper, literal \n and emoji. Use rayChatOutputGenUI to make GenUI draw its TEXT this way."
    figmaURL={FIGMA_URL}
    apiDecisionLink={null}
    imports={`import { RayChatOutput, rayChatOutputGenUI } from '@razorpay/blade/components';`}
  >
    <Text>RAY&apos;s reply is Markdown, passed as children.</Text>
  </StoryPageWrapper>
);

export default {
  title: 'Components/RayChatOutput',
  component: RayChatOutput,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<RayChatOutputProps>;

/**
 * The chat column of the RAY dashboard, as in the reference mock. `sb-unstyled` opts it out of
 * Storybook's preview-head font overrides, which would force Inter on the main title's `<p>`.
 */
const ChatColumn = ({ children }: { children: React.ReactNode }): ReactElement => (
  <div className="sb-unstyled">
    <Box maxWidth="752px" marginX="auto" display="flex" flexDirection="column" gap="spacing.7">
      {children}
    </Box>
  </div>
);

const FIGMA_REPLY = `For an Indian investing in US stocks, the real costs are FX spread, LRS/TCS cash lockup, US dividend tax, and Indian capital-gains tax—brokerage is usually the smallest piece.

### First: what “really” costs you money
For a **resident Indian** buying US stocks directly (Groww, Zerodha, foreign broker, etc.), think of four buckets of cost.

1. Getting money out (LRS, TCS and bank/FX costs)
2. Trading costs (brokerage and regulatory fees)
3. Ongoing tax on dividends
4. Tax on capital gains when you sell

A recent SEBI-RIA guide comparing routes to US stocks broadly matches this breakdown and shows that **FX and tax matter more than headline brokerage.**

### 1. LRS, TCS and outward remittance
All direct US-stock investing as a resident goes through **RBI’s Liberalised Remittance Scheme (LRS).**

- You can remit up to **$250,000 per financial year per person** for investments abroad.
- Up to **₹10 lakh a year** in total LRS remittances has **no TCS.**
- Above **₹10 lakh,** banks collect **20% TCS** on the excess you send for investments.`;

const RayChatOutputTemplate: StoryFn<typeof RayChatOutput> = ({ children, ...args }) => (
  <ChatColumn>
    <Box alignSelf="flex-end">
      <ChatMessage senderType="self">
        What does it really cost to invest in US stocks from India?
      </ChatMessage>
    </Box>
    <RayChatOutput {...args}>{children}</RayChatOutput>
  </ChatColumn>
);

export const Default = RayChatOutputTemplate.bind({});
Default.storyName = 'Default';
Default.args = { children: FIGMA_REPLY };

export const EveryMarkdownPart = RayChatOutputTemplate.bind({});
EveryMarkdownPart.storyName = 'Every Markdown Part';
EveryMarkdownPart.args = {
  children: `Your settlement of ₹48,200 for 21 Sep reached your bank on 23 Sep.

# A # heading
## A ## heading
### A ### heading
**A bold line on its own is a title too**
A paragraph with **bold**, *italic (drawn plain)*, [a link](https://razorpay.com/docs) and an ID: \`pay_29QQoUBi66xm2f\`.
A line break inside a paragraph starts a new one.

1. An ordered list
2. With a nested list
   - nested item one
   - nested item two
3. Back at the top

- An unordered list
- Second item

\`\`\`
curl -u rzp_test_key:secret https://api.razorpay.com/v1/payments?from=1695254400&to=1695340800&count=100&skip=0&expand[]=card
\`\`\`

---

After a divider the next block opens a section, 24 below.

> A quote is drawn as plain text.

Tables are drawn as cards, so a table in the text becomes an aligned block:

| Payment | Amount | Status |
|---|---:|---|
| pay_29QQoUBi66xm2f | ₹48,200 | **Captured** |
| pay_29QQoUBi66xm2g | ₹900 | Refunded |

Emoji are left out 🎉, and so is <b>HTML</b>. An image is drawn as its alt text: ![settlement chart](https://x.test/chart.png)`,
};

export const CleansRaysText: StoryFn<typeof RayChatOutput> = () => {
  const raw =
    '```json\n{"assistant_reply": "No paid orders were found on 21 Sep 2026 😊\\\\nWant me to check 22 Sep? 👋"}\n```';
  return (
    <ChatColumn>
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Text size="small" color="surface.text.gray.muted">
          What RAY sent
        </Text>
        <Code size="small">{raw}</Code>
      </Box>
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Text size="small" color="surface.text.gray.muted">
          What the chat draws
        </Text>
        <RayChatOutput>{raw}</RayChatOutput>
      </Box>
    </ChatColumn>
  );
};
CleansRaysText.storyName = "Cleans RAY's Text";

const GENUI_REPLY: GenUIComponent[] = [
  {
    component: 'TEXT',
    content:
      'Your payouts for September are on time.\n\n### Settled this week\nTwo settlements reached your bank. The larger one is below.',
  },
  {
    component: 'CARD',
    title: 'Settlement setl_N4h2xQ',
    description: 'Reached HDFC Bank ••4821 on 23 Sep',
    children: [{ component: 'AMOUNT', value: 48200, currency: 'INR' }],
  },
  {
    component: 'TEXT',
    content: '### What next\nAsk me about any payment ID to see where it is.',
  },
] as GenUIComponent[];

export const InGenUI: StoryFn<typeof RayChatOutput> = () => (
  <ChatColumn>
    <GenUIProvider config={{ components: { TEXT: rayChatOutputGenUI } }}>
      <GenUISchemaRenderer components={GENUI_REPLY} />
    </GenUIProvider>
  </ChatColumn>
);
InGenUI.storyName = 'In GenUI';
