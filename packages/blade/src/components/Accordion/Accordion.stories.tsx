import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { Accordion as AccordionComponent } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionItemHeader } from './AccordionItemHeader';
import { AccordionItemBody } from './AccordionItemBody';
import type { AccordionProps } from '.';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import {
  AnnouncementIcon,
  QRCodeIcon,
  RoutesIcon,
  StarIcon,
  SubscriptionsIcon,
  UserIcon,
} from '~components/Icons';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Alert } from '~components/Alert';
import { isReactNative } from '~utils';
import { Code, Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';
import { TextInput } from '~components/Input/TextInput';
import { Indicator } from '~components/Indicator';
import { Amount } from '~components/Amount';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Accordion"
      componentDescription="An accordion is used to allow users to toggle between different content sections in a compact vertical stack."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74858-50167&t=Kp8hYSNEvkkPXfFF-1&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { Accordion, AccordionItem, AccordionItemHeader, AccordionItemBody } from '@razorpay/blade/components';

        function App() {
          return (
            <Accordion>
              <AccordionItem>
                <AccordionItemHeader title="How can I setup Route?" />
                <AccordionItemBody>
                  You can use Razorpay Route from the Dashboard or using APIs to transfer money to
                  customers. You may also check our docs for detailed instructions.
                </AccordionItemBody>
              </AccordionItem>
              <AccordionItem>
                <AccordionItemHeader title="How can I setup QR Codes?" />
                <AccordionItemBody>
                  Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                  search functionality to ask your queries.
                </AccordionItemBody>
              </AccordionItem>
              <AccordionItem>
                <AccordionItemHeader title="How can I setup Subscriptions?" />
                <AccordionItemBody>
                  Just use Razorpay. You may also check our docs for detailed instructions. Please use the
                  search functionality to ask your queries.
                </AccordionItemBody>
              </AccordionItem>
            </Accordion>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<AccordionProps> = {
  title: 'Components/Accordion',
  component: AccordionComponent,
  args: {},
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const AccordionTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <AccordionComponent {...args}>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Route?" />
        <AccordionItemBody>
          You can use Razorpay Route from the Dashboard or using APIs to transfer money to
          customers. You may also check our docs for detailed instructions.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup QR Codes?" />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions. Please use the
          search functionality to ask your queries.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Subscriptions?" />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions. Please use the
          search functionality to ask your queries.
        </AccordionItemBody>
      </AccordionItem>
    </AccordionComponent>
  );
};

const AccordionWithIconsTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <AccordionComponent {...args}>
      <AccordionItem>
        <AccordionItemHeader
          leading={<RoutesIcon size="large" />}
          title="How can I setup Route?"
          subtitle="Subtitle of how to setup route"
          titleSuffix={<Badge>New</Badge>}
          trailing={
            <Link
              variant="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              Apply
            </Link>
          }
        />
        <AccordionItemBody>
          You can use Razorpay Route from the Dashboard or using APIs to transfer money to
          customers. You may also check our docs for detailed instructions.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader
          leading={<QRCodeIcon size="large" />}
          title="How can I setup QR Codes?"
        />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions. Please use the
          search functionality to ask your queries.
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader
          leading={<SubscriptionsIcon size="large" />}
          title="How can I setup Subscriptions?"
        />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions. Please use the
          search functionality to ask your queries.
        </AccordionItemBody>
      </AccordionItem>
    </AccordionComponent>
  );
};

export const BasicExample = AccordionTemplate.bind({});

export const WithShowNumberPrefix = AccordionTemplate.bind({});

WithShowNumberPrefix.args = {
  showNumberPrefix: true,
};

WithShowNumberPrefix.parameters = {
  docs: {
    description: {
      story:
        'Use the `showNumberPrefix` prop to automatically add numeric indexes. **Note:** this should not be used with `icon` prop in `AccordionItem`',
    },
  },
};

export const WithIcons = AccordionWithIconsTemplate.bind({});

WithIcons.parameters = {
  docs: {
    description: {
      story:
        'Use the `icon` prop in `AccordionItem` to pass blade icons. **Note:** this should not be used with `showNumberPrefix` on `Accordion`.',
    },
  },
};

const AccordionControlledTemplate: StoryFn<typeof AccordionComponent> = ({
  expandedIndex: _expandedIndex,
  onExpandChange,
  defaultExpandedIndex,
  ...rest
}) => {
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const gap = isReactNative() ? 'spacing.1' : 'spacing.0';

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        gap="spacing.4"
        marginBottom="spacing.6"
        flexWrap="wrap"
      >
        <Button marginX={gap} marginY={gap} onClick={() => setExpandedIndex(0)}>
          Expand First
        </Button>
        <Button marginX={gap} marginY={gap} onClick={() => setExpandedIndex(1)}>
          Expand Second
        </Button>
        <Button marginX={gap} marginY={gap} onClick={() => setExpandedIndex(2)}>
          Expand Third
        </Button>
        <Button marginX={gap} marginY={gap} onClick={() => setExpandedIndex(-1)}>
          Collapse
        </Button>
      </Box>
      <AccordionComponent
        {...rest}
        expandedIndex={expandedIndex}
        onExpandChange={({ expandedIndex }) => setExpandedIndex(expandedIndex)}
      >
        <AccordionItem>
          <AccordionItemHeader title="How can I setup Route?" />
          <AccordionItemBody>
            You can use Razorpay Route from the Dashboard or using APIs to transfer money to
            customers. You may also check our docs for detailed instructions.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="How can I setup QR Codes?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="How can I setup Subscriptions?" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
      </AccordionComponent>
    </>
  );
};

export const ControlledExample = AccordionControlledTemplate.bind({});

ControlledExample.parameters = {
  docs: {
    description: {
      story:
        'Use `expandedIndex`: `number` and `onExpandChange`: `({ expandedIndex }) => void` to build controlled behavior. **Note:** a `-1` value signifies no expanded items.',
    },
  },
};
ControlledExample.args = {
  showNumberPrefix: true,
};

const AccordionWithCustomHeaderBodyTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <AccordionComponent {...args}>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Route?" />
        <AccordionItemBody>
          <Text color="surface.text.gray.subtle" marginBottom="spacing.0">
            You can use Razorpay Route from the Dashboard or using APIs to transfer money to
            customers. You may also check our docs for detailed instructions.
          </Text>
          {isVisible && (
            <Alert
              title="Custom slot"
              description="You can render anything here along with description"
              onDismiss={() => setIsVisible(false)}
            />
          )}
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader>
          <Text color="surface.text.primary.normal">CUSTOM SLOT HEADER</Text>
        </AccordionItemHeader>
        <AccordionItemBody>
          <Alert
            title="Custom Slot Body"
            description="Or you can skip description altogether and just render a custom component here"
            isDismissible={false}
            isFullWidth
          />
        </AccordionItemBody>
      </AccordionItem>
      <AccordionItem>
        <AccordionItemHeader title="How can I setup Subscriptions?" />
        <AccordionItemBody>
          Just use Razorpay. You may also check our docs for detailed instructions. Please use the
          search functionality to ask your queries.
        </AccordionItemBody>
      </AccordionItem>
    </AccordionComponent>
  );
};

export const CustomHeaderBody = AccordionWithCustomHeaderBodyTemplate.bind({});

CustomHeaderBody.parameters = {
  docs: {
    description: {
      story:
        'Pass a custom slot component / JSX as `children` in `AccordionItemHeader` and `AccordionItemBody`.',
    },
  },
};

const MultiAccordionCompositionTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <Box maxWidth={{ base: '100%', s: '480px' }}>
      <AccordionComponent {...args}>
        <AccordionItem>
          <AccordionItemHeader title="PhonePe Wallet" subtitle="+ ₹50 Extra Charge" />
          <AccordionItemBody>
            <TextInput label="Phone Number" type="telephone" placeholder="Enter Phone Number" />
            <Button>Continue</Button>
          </AccordionItemBody>
        </AccordionItem>
      </AccordionComponent>
      <AccordionComponent marginTop="spacing.5" {...args}>
        <AccordionItem>
          <AccordionItemHeader
            title="HDFC Credit Card"
            subtitle="No EMI Cost Avaliable"
            titleSuffix={<Badge color="positive">Upto ₹500 off</Badge>}
          />
          <AccordionItemBody>
            <TextInput label="Card Number" type="number" placeholder="Enter Card Number" />
            <Button>Continue</Button>
          </AccordionItemBody>
        </AccordionItem>
      </AccordionComponent>
      <AccordionComponent marginTop="spacing.5" {...args}>
        <AccordionItem>
          <AccordionItemHeader
            title="Google Pay"
            titleSuffix={<Badge color="positive">5% Cashback</Badge>}
          />
          <AccordionItemBody>
            <TextInput label="Google Pay UPI ID" type="number" placeholder="xyz@okhdfcbank" />
            <Button isFullWidth>Continue</Button>
          </AccordionItemBody>
        </AccordionItem>
      </AccordionComponent>
    </Box>
  );
};

export const MultipleAccordionComposition = MultiAccordionCompositionTemplate.bind({});

MultipleAccordionComposition.args = {
  variant: 'solid',
};

const IndividualAccordionItemTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <Box maxWidth={{ base: '100%', s: '480px' }}>
      <AccordionComponent {...args}>
        <AccordionItem>
          <AccordionItemHeader>
            <Text size="medium" color="surface.text.gray.muted">
              #8218851
            </Text>
            <Text marginY="spacing.2" size="large" weight="semibold">
              Transactions and settlement related
            </Text>
            <Box display="flex" flexDirection="row" gap="spacing.3">
              <Indicator size="medium" color="information">
                In Progress
              </Indicator>
              <Box display="flex" alignItems="center" flexDirection="row" gap="spacing.2">
                <UserIcon size="medium" color="surface.icon.gray.subtle" />
                <Text size="medium" color="surface.text.gray.subtle">
                  Merchant Risk
                </Text>
              </Box>
            </Box>
          </AccordionItemHeader>
          <AccordionItemBody>
            <Text color="surface.text.gray.subtle">
              Razorpay please verify a payment of{' '}
              <Amount color="surface.text.gray.subtle" value={5000} /> done by me to Razer for
              reloading gold as it seem they haven't received it. Payment Id :{' '}
              <Code>pay_LlI3slkdirf234</Code>
            </Text>
          </AccordionItemBody>
        </AccordionItem>
      </AccordionComponent>
    </Box>
  );
};

export const IndividualAccordionItem = IndividualAccordionItemTemplate.bind({});

IndividualAccordionItem.args = {
  variant: 'solid',
};

const AccordionItemHeaderVariantsTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <>
      <Heading size="xlarge" marginBottom="spacing.4">
        Accordion Header Types
      </Heading>
      <AccordionComponent {...args}>
        <AccordionItem>
          <AccordionItemHeader title="Simple Title & Text Item" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader title="Title Text of Accordion" subtitle="Subtitle Text" />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader
            leading={<AnnouncementIcon size="large" />}
            title="Item with Icon and subtitle"
            subtitle="Subtitle Text"
          />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader
            leading={<AnnouncementIcon size="large" />}
            title="Item with Trailing"
            subtitle="Subtitle Text"
            trailing={
              <Link
                variant="button"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Apply
              </Link>
            }
          />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader
            leading={<AnnouncementIcon size="large" />}
            title="Item with Badge"
            subtitle="Subtitle Text"
            titleSuffix={<Badge>New</Badge>}
          />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionItemHeader>
            <Box>
              <Text>Custom Slot Header</Text>
            </Box>
          </AccordionItemHeader>
          <AccordionItemBody>
            <Box>
              <Text>Custom Slot BODY</Text>
            </Box>
          </AccordionItemBody>
        </AccordionItem>
        <AccordionItem isDisabled={true}>
          <AccordionItemHeader
            leading={<AnnouncementIcon size="large" color="surface.icon.gray.disabled" />}
            title="Item with Badge"
            subtitle="Subtitle Text"
            titleSuffix={<Badge>New</Badge>}
          />
          <AccordionItemBody>
            Just use Razorpay. You may also check our docs for detailed instructions. Please use the
            search functionality to ask your queries.
          </AccordionItemBody>
        </AccordionItem>
      </AccordionComponent>
    </>
  );
};

export const AccordionItemHeaderVariants = AccordionItemHeaderVariantsTemplate.bind({});

AccordionItemHeaderVariants.args = {
  variant: 'solid',
};

const AccordionDeprecatedAPITemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <AccordionComponent {...args}>
      <AccordionItem
        icon={StarIcon}
        title="How can I setup Subscriptions?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
      />
      <AccordionItem
        icon={QRCodeIcon}
        title="How can I setup QR Codes?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
      />
      <AccordionItem icon={RoutesIcon} title="How can I setup Routes?">
        <Box>
          <Text>Deprecated slot</Text>
          <Text>Deprecated slot</Text>
        </Box>
      </AccordionItem>
    </AccordionComponent>
  );
};

export const AccordionDeprecatedAPI = AccordionDeprecatedAPITemplate.bind({});

AccordionDeprecatedAPI.args = {
  variant: 'transparent',
  size: 'large',
};

export default meta;
