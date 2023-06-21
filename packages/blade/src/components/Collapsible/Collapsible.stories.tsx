import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { useState } from 'react';
import type { CollapsibleProps } from './Collapsible';
import { Collapsible as CollapsibleComponent } from './Collapsible';
import { CollapsibleButton } from './CollapsibleButton';
import { CollapsibleBody } from './CollapsibleBody';
import { CollapsibleLink } from './CollapsibleLink';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Box } from '~components/Box';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Collapsible"
      componentDescription="[Only available for web PRE RELEASE currently]: Collapsible is used to allow users to toggle the visibility of hidden content within a container."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=79-629874&t=sVxH3DOnx3L3F9rO-0',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=16868-832623&t=rK6ydo54uVejIH9p-0',
      }}
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { Collapsible_PRE_RELEASE as Collapsible, CollapsibleButton, CollapsibleBody, Text, Amount, Box } from '@razorpay/blade/components';

        function App() {
          return (
            <Collapsible>
              <CollapsibleButton>View Price Breakdown</CollapsibleButton>
              <CollapsibleBody>
                <Box display="flex" flexDirection="column" minWidth="200px">
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Text>Actual amount</Text>
                    <Amount value={1000} intent="positive" />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Text marginTop="spacing.2">Razorpay Platform Fees</Text>
                    <Text>2%</Text>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="baseline"
                  >
                    <Text marginTop="spacing.2">GST</Text>
                    <Text>18%</Text>
                  </Box>
                </Box>
              </CollapsibleBody>
            </Collapsible>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<CollapsibleProps> = {
  title: 'Components/Collapsible (PRE RELEASE)',
  component: CollapsibleComponent,
  args: {},
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const CollapsibleButtonTemplate: ComponentStory<typeof CollapsibleComponent> = ({ ...args }) => {
  return (
    <CollapsibleComponent {...args}>
      <CollapsibleButton>View Price Breakdown</CollapsibleButton>
      <CollapsibleBody>
        <Box display="flex" flexDirection="column" minWidth="200px">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text>Actual amount</Text>
            <Amount value={1000} intent="positive" />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text marginTop="spacing.2">Razorpay Platform Fees</Text>
            <Text>2%</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text marginTop="spacing.2">GST</Text>
            <Text>18%</Text>
          </Box>
        </Box>
      </CollapsibleBody>
    </CollapsibleComponent>
  );
};

export const WithCollapsibleButton = CollapsibleButtonTemplate.bind({});

const CollapsibleLinkTemplate: ComponentStory<typeof CollapsibleComponent> = ({ ...args }) => {
  return (
    <CollapsibleComponent {...args}>
      <CollapsibleLink>View Price Breakdown</CollapsibleLink>
      <CollapsibleBody>
        <Box display="flex" flexDirection="column" minWidth="200px">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text>Actual amount</Text>
            <Amount value={1000} intent="positive" />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text marginTop="spacing.2">Razorpay Platform Fees</Text>
            <Text>2%</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text marginTop="spacing.2">GST</Text>
            <Text>18%</Text>
          </Box>
        </Box>
      </CollapsibleBody>
    </CollapsibleComponent>
  );
};

export const WithCollapsibleLink = CollapsibleLinkTemplate.bind({});

WithCollapsibleLink.parameters = {
  docs: {
    description: {
      story: 'Compose `Collapsible` with `CollapsibleLink` and `CollapsibleBody`',
    },
  },
};

export const WithDirection = CollapsibleLinkTemplate.bind({});

WithDirection.args = {
  direction: 'top',
};
WithDirection.parameters = {
  docs: {
    description: {
      story: 'Use `direction` prop to control in which direction the `Collapsible` expands in',
    },
  },
};

const CollapsibleControlledTemplate: ComponentStory<typeof CollapsibleComponent> = ({
  isExpanded: _isExpanded,
  onExpandChange,
  defaultIsExpanded,
  ...rest
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <CollapsibleComponent
      {...rest}
      isExpanded={isExpanded}
      onExpandChange={({ isExpanded }) => setIsExpanded(isExpanded)}
    >
      <CollapsibleButton>{isExpanded ? 'Hide' : 'Show'} Price Breakdown</CollapsibleButton>
      <CollapsibleBody>
        <Box display="flex" flexDirection="column" minWidth="200px">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text>Actual amount</Text>
            <Amount value={1000} intent="positive" />
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text marginTop="spacing.2">Razorpay Platform Fees</Text>
            <Text>2%</Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Text marginTop="spacing.2">GST</Text>
            <Text>18%</Text>
          </Box>
        </Box>
      </CollapsibleBody>
    </CollapsibleComponent>
  );
};

export const ControlledExample = CollapsibleControlledTemplate.bind({});

ControlledExample.parameters = {
  docs: {
    description: {
      story:
        'Use in combination with `isExpanded`: `boolean` and `onExpandChange`: `({ isExpanded }) => void`',
    },
  },
};

export default meta;
