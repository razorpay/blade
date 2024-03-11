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
} from '~components/Icons';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Alert } from '~components/Alert';
import { isReactNative } from '~utils';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Link } from '~components/Link';

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

const AccordionWithSlotTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
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
            title="Custom slot"
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

export const CustomSlot = AccordionWithSlotTemplate.bind({});

CustomSlot.parameters = {
  docs: {
    description: {
      story: 'Pass a custom slot component / JSX as `children` in `AccordionItem`.',
    },
  },
};

const IndividualAccordionItemTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <AccordionComponent {...args}>
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

export const IndividualAccordionItem = IndividualAccordionItemTemplate.bind({});

IndividualAccordionItem.args = {
  variant: 'bordered',
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
      </AccordionComponent>
    </>
  );
};

export const AccordionItemHeaderVariants = AccordionItemHeaderVariantsTemplate.bind({});

IndividualAccordionItem.args = {
  variant: 'bordered',
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
      <AccordionItem
        icon={RoutesIcon}
        title="How can I setup Routes?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
      />
    </AccordionComponent>
  );
};

export const AccordionDeprecatedAPI = AccordionDeprecatedAPITemplate.bind({});

AccordionDeprecatedAPI.args = {
  variant: 'borderless',
  size: 'large',
};

export default meta;
