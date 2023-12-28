import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { useState } from 'react';

import type { AccordionProps } from './Accordion';
import { Accordion as AccordionComponent } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { QRCodeIcon, RoutesIcon, SubscriptionsIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Alert } from '~components/Alert';
import { isReactNative } from '~utils';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Accordion"
      componentDescription="An accordion is used to allow users to toggle between different content sections in a compact vertical stack."
      figmaURL="https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=79-629874&t=sVxH3DOnx3L3F9rO-0"
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { Accordion, AccordionItem } from '@razorpay/blade/components';

        function App() {
          return (
            <Accordion>
              <AccordionItem
                title="How can I setup Route?"
                description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
              />
              <AccordionItem
                title="How can I setup QR Codes?"
                description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
              />
              <AccordionItem
                title="How can I setup Subscriptions?"
                description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
              />
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
      <AccordionItem
        title="How can I setup Route?"
        description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
      />
      <AccordionItem
        title="How can I setup QR Codes?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
      />
      <AccordionItem
        title="How can I setup Subscriptions?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
      />
    </AccordionComponent>
  );
};

const AccordionWithIconsTemplate: StoryFn<typeof AccordionComponent> = ({ ...args }) => {
  return (
    <AccordionComponent {...args}>
      <AccordionItem
        title="How can I setup Route?"
        description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
        icon={RoutesIcon}
      />
      <AccordionItem
        title="How can I setup QR Codes?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        icon={QRCodeIcon}
      />
      <AccordionItem
        title="How can I setup Subscriptions?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        icon={SubscriptionsIcon}
      />
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
        <AccordionItem
          title="How can I setup Route?"
          description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
        />
        <AccordionItem
          title="How can I setup QR Codes?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
        <AccordionItem
          title="How can I setup Subscriptions?"
          description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
        />
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
      <AccordionItem
        title="How can I setup Route?"
        description="You can use Razorpay Route from the Dashboard or using APIs to transfer money to customers. You may also check our docs for detailed instructions."
      >
        {isVisible && (
          <Alert
            title="Custom slot"
            description="You can render anything here along with description"
            onDismiss={() => setIsVisible(false)}
          />
        )}
      </AccordionItem>
      <AccordionItem title="How can I setup QR Codes?">
        <Alert
          title="Custom slot"
          description="Or you can skip description altogether and just render a custom component here"
          isDismissible={false}
          isFullWidth
        />
      </AccordionItem>
      <AccordionItem
        title="How can I setup Subscriptions?"
        description="Just use Razorpay. You may also check our docs for detailed instructions. Please use the search functionality to ask your queries."
      />
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

export default meta;
