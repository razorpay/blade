import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import { Heading, Text } from '../Typography';
import type { ChipGroupProps } from './ChipGroup/ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup/ChipGroup';
import { Chip as ChipComponent } from './Chip';
import { InfoIcon } from '~components/Icons';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import type { BladeElementRef } from '~utils/useBladeInnerRef';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context)."
      componentName="Chip & ChipGroup"
      imports={`import { Chip, ChipGroup } from '@razorpay/blade/components';\nimport type { ChipProps, ChipGroupProps } from '@razorpay/blade/components';`}
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=52377%3A23885&mode=design&t=y7gUIBIzzNMRd3w6-1',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=18358%3A3135&mode=design&t=FzNrQV6ZZaLoxzcj-1',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole editorHeight={400} editorWidthPercentage={60}>
        {`
          import { Box, Chip, ChipGroup, Text } from '@razorpay/blade/components';

          function App(): React.ReactElement {
            return (
              <Box>
                <Text> Select Business type: </Text>
                <ChipGroup defaultValue="proprietorship" onChange={({name, value}) => console.log({name, value})}>
                  <Chip value="proprietorship">Proprietorship</Chip>
                  <Chip value="public">Public</Chip>
                  <Chip value="small-business">Small Business</Chip>
                </ChipGroup>
              </Box>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Chip & ChipGroup',
  component: ChipGroupComponent,
  args: {
    isDisabled: false,
    name: undefined,
    defaultValue: undefined,
    onChange: undefined,
    value: undefined,
    selectionType: 'single',
    accessibilityLabel: 'Select Business type:',
  },
  argTypes: {
    value: {
      options: ['proprietorship', 'public', 'small-business'],
      control: {
        type: 'select',
      },
    },
    defaultValue: {
      options: ['proprietorship', 'public', 'small-business'],
      control: {
        type: 'select',
      },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChipGroupProps>;

const ChipTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent {...args}>
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const Default = ChipTemplate.bind({});
Default.storyName = 'Default';

export const SingleSelection = ChipTemplate.bind({});
SingleSelection.storyName = 'Single Selection';
SingleSelection.args = {
  selectionType: 'single',
};

export const MultiSelection = ChipTemplate.bind({});
MultiSelection.storyName = 'Multi Selection';
MultiSelection.args = {
  selectionType: 'multiple',
};

export const DefaultSelectedSingle = ChipTemplate.bind({});
DefaultSelectedSingle.storyName = 'Default Single Selection';
DefaultSelectedSingle.args = {
  defaultValue: 'Proprietorship',
};

export const DefaultMultiSelected = ChipTemplate.bind({});
DefaultMultiSelected.storyName = 'Default Multiple Selection';
DefaultMultiSelected.args = {
  defaultValue: ['Proprietorship', 'Public'],
  selectionType: 'multiple',
};

const ControlledSingleSelectionTemplate: ComponentStory<typeof ChipGroupComponent> = () => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  const [value, setValue] = React.useState('Proprietorship');
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent
        selectionType="single"
        value={value}
        onChange={({ values }) => setValue(values[0])}
      >
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={InfoIcon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>

      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Selected value is &quot;{value}&quot;
      </Text>
    </Box>
  );
};

export const ControlledSingleSelection = ControlledSingleSelectionTemplate.bind({});
ControlledSingleSelection.storyName = 'Controlled Single Selection';

const ControlledMultiSelectionTemplate: ComponentStory<typeof ChipGroupComponent> = () => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  const [value, setValue] = React.useState(['Proprietorship']);
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent
        selectionType="multiple"
        value={value}
        onChange={({ values }) => setValue(values)}
      >
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={InfoIcon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>

      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Selected values are &quot;{value.join(', ')}&quot;
      </Text>
    </Box>
  );
};

export const ControlledMultiSelection = ControlledMultiSelectionTemplate.bind({});
ControlledMultiSelection.storyName = 'Controlled Multiple Selection';

export const Disabled = ChipTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
};

const ChipWithIconTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent {...args}>
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={InfoIcon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const ChipWithIcon = ChipWithIconTemplate.bind({});
ChipWithIcon.storyName = 'With Icon';
ChipWithIcon.args = {
  selectionType: 'multiple',
  defaultValue: ['Proprietorship'],
};

const AllChipSizesTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  const sizes = ['xsmall', 'small', 'medium', 'large'];
  return (
    <Box>
      {sizes.map((size, index) => (
        <Box key={index}>
          <Heading size="medium">{size}</Heading>
          <Text marginBottom="spacing.3" marginTop="spacing.3" size="medium">
            Select Business type:
          </Text>

          <ChipGroupComponent size={size as ChipGroupProps['size']} {...args}>
            {chipValues.map((chipValue: string) => (
              <ChipComponent key={chipValue} value={chipValue} icon={InfoIcon}>
                {chipValue}
              </ChipComponent>
            ))}
          </ChipGroupComponent>
        </Box>
      ))}
    </Box>
  );
};

export const AllChipSizes = AllChipSizesTemplate.bind({});
AllChipSizes.storyName = 'All Sizes';
AllChipSizes.args = {
  selectionType: 'multiple',
  defaultValue: ['Proprietorship'],
};

const AllChipIntentsTemplate: ComponentStory<typeof ChipGroupComponent> = ({
  children,
  ...args
}) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  const intents = ['neutral', 'positive', 'negative'];
  return (
    <Box>
      {intents.map((intent, index) => (
        <Box key={index}>
          <Heading size="medium">{intent}</Heading>
          <Text marginBottom="spacing.3" marginTop="spacing.3" size="medium">
            Select Business type:
          </Text>

          <ChipGroupComponent intent={intent as ChipGroupProps['intent']} {...args}>
            {chipValues.map((chipValue: string) => (
              <ChipComponent key={chipValue} value={chipValue} icon={InfoIcon}>
                {chipValue}
              </ChipComponent>
            ))}
          </ChipGroupComponent>
        </Box>
      ))}
    </Box>
  );
};

export const AllChipIntents = AllChipIntentsTemplate.bind({});
AllChipIntents.storyName = 'All Intents';
AllChipIntents.args = {
  selectionType: 'multiple',
  defaultValue: ['Proprietorship'],
};

export const chipRef: ComponentStory<typeof ChipComponent> = (args) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chipRef = React.useRef<BladeElementRef>(null);

  return (
    <Box gap="spacing.3" display="flex" flexDirection="column">
      <ChipGroupComponent {...args}>
        <ChipComponent ref={chipRef} value="Proprietorship" icon={InfoIcon}>
          Proprietorship
        </ChipComponent>
        <ChipComponent value="Public" icon={InfoIcon}>
          Public
        </ChipComponent>
        <ChipComponent value="Small Business" icon={InfoIcon}>
          Small Business
        </ChipComponent>
      </ChipGroupComponent>
      <Box maxWidth="200px">
        <Button isFullWidth={false} onClick={() => chipRef?.current?.focus()}>
          Click to focus the Chip
        </Button>
      </Box>
    </Box>
  );
};

chipRef.storyName = 'Chip Ref';
chipRef.parameters = {
  docs: {
    description: {
      story:
        'Chip component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programmatically control the DOM element',
    },
  },
};
