import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Text, Title } from '../Typography';
import type { ChipGroupProps } from './ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup';
import { Chip as ChipComponent } from './Chip';
import {
  PaymentLinksIcon,
  OffersIcon,
  SmartphoneIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from '~components/Icons';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import type { BladeElementRef } from '~utils/types';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context)."
      componentName="Chip"
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

const propsCategory = { CHIP: 'Chip Props', CHIP_GROUP: 'ChipGroup Props' };

export default {
  title: 'Components/Chip/Chip',
  args: {
    isDisabled: false,
  },
  argTypes: {
    // ChipGroup props
    isDisabled: {
      description:
        'Disables or enables `ChipGroup`, it will propagate down to all the children `Chip` components.',
      control: {
        type: 'boolean',
      },
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'boolean',
        },
      },
    },
    value: {
      description:
        'Value of the Chip group Acts as a controlled component by specifying the ChipGroup value Use onChange to update its value.',
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'string',
        },
      },
    },
    icon: {
      name: 'icon',
      description: 'Displays the Blade Icon component within the Chip',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'IconComponent',
        },
      },
    },
    intent: {
      description: 'Sets the intent of the Chip',
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: '"none" | "positive" | "negative"',
        },
      },
      options: ['none', 'positive', 'negative'],
      control: {
        type: 'select',
      },
    },

    // Styled Props
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChipGroupProps>;

const ChipTemplate: ComponentStory<typeof ChipComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent accessibilityLabel="Choose one business type from the options below">
        {chipValues.map((chipValue: string, index) => (
          <ChipComponent key={index} value={chipValue} {...args}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const Default = ChipTemplate.bind({});
Default.storyName = 'Default';

export const Disabled = ChipTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
};

const ChipWithIconTemplate: ComponentStory<typeof ChipComponent> = ({ children, ...args }) => {
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        What other capabilities are you looking for?
      </Text>

      <ChipGroupComponent
        accessibilityLabel="Choose one business type from the options below"
        defaultValue="payment-links"
        {...args}
      >
        <ChipComponent value="payment-links" icon={PaymentLinksIcon} {...args}>
          Automated Payment Links
        </ChipComponent>
        <ChipComponent value="wallet" icon={SmartphoneIcon} {...args}>
          Wallet on My App
        </ChipComponent>
        <ChipComponent value="offers" icon={OffersIcon} {...args}>
          Offer discounts, Pay Later & EMI options
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const ChipWithIcon = ChipWithIconTemplate.bind({});
ChipWithIcon.storyName = 'With Icon';

const ChipIntentsTemplate: ComponentStory<typeof ChipComponent> = (args) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" weight="bold" marginBottom="spacing.3">
        Is the result helpful?
      </Text>

      <ChipGroupComponent
        defaultValue="yes"
        accessibilityLabel="Is the result helpful? Please select either yer or no"
      >
        <ChipComponent intent="positive" value="yes" icon={ThumbsUpIcon} {...args}>
          Yes
        </ChipComponent>
        <ChipComponent intent="negative" value="no" icon={ThumbsDownIcon} {...args}>
          No
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const ChipWithIntent = ChipIntentsTemplate.bind({});
ChipWithIntent.storyName = 'With Intent';

const TextTransformationTemplate: ComponentStory<typeof ChipComponent> = ({
  children,
  ...args
}) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent
        accessibilityLabel="Choose one business type from the options below"
        defaultValue="Proprietorship"
      >
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} {...args}>
            {chipValue.toUpperCase()}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const TextTransformationUppercase = TextTransformationTemplate.bind({});
TextTransformationUppercase.storyName = 'Text Transformation (Uppercase)';

export const chipRef: ComponentStory<typeof ChipComponent> = (args) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chipRef = React.useRef<BladeElementRef>(null);

  return (
    <Box gap="spacing.3" display="flex" flexDirection="column">
      <ChipGroupComponent accessibilityLabel="Select business type" selectionType="single">
        <ChipComponent ref={chipRef} value="Proprietorship" {...args}>
          Proprietorship
        </ChipComponent>
        <ChipComponent value="Public" {...args}>
          Public
        </ChipComponent>
        <ChipComponent value="Small Business" {...args}>
          Small Business
        </ChipComponent>
      </ChipGroupComponent>
      <Box maxWidth="400px" display="flex" flexDirection="row" gap="spacing.3">
        <Button
          isFullWidth={true}
          onClick={() => {
            chipRef?.current?.focus();
            chipRef?.current?.click();
          }}
        >
          Select Proprietorship
        </Button>
        <Button
          isFullWidth={true}
          variant="secondary"
          onClick={() => {
            chipRef?.current?.blur();
          }}
        >
          Remove Focus
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
