import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import Box from '../Box';
import type { AmountProps } from './Amount';
import { Amount as AmountComponent } from './Amount';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import { Text } from '~components/Typography';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28012%3A580578&t=WfWp7qiwZ3lvvbdw-0',
        bankingTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28012%3A580578&t=WfWp7qiwZ3lvvbdw-0',
      }}
      componentName="Amount"
      componentDescription="Amounts are used to show small amount of color coded metadata, which are ideal for getting user attention."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Amount } from '@razorpay/blade/components';
        
        function App(): JSX.Element {
          const value = 21222.2;
          return (
            <Amount variant="neutral" value={value} />  
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Amount',
  component: AmountComponent,
  argTypes: {},
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<AmountProps>;

const AmountDefaultTemplate: ComponentStory<typeof AmountComponent> = (args) => {
  return (
    <Box
      display="flex"
      alignItems="baseline"
      justifyContent="center"
      paddingRight="spacing.3"
      paddingTop="spacing.2"
    >
      <AmountComponent {...args} />
    </Box>
  );
};

export const Amount = AmountDefaultTemplate.bind({});
Amount.args = {
  value: 122345.678,
  variant: 'neutral',
  size: 'medium',
  suffix: 'decimals',
  isAffixSubtle: true,
  weight: 'bold',
};
Amount.storyName = 'Default';

const AmountSizesTemplate: ComponentStory<typeof AmountComponent> = ({ ...args }) => {
  return (
    <Box justifyContent="center">
      <Box marginBottom="spacing.3">
        <Text>Small</Text>
        <Box marginBottom="spacing.2" />
        <AmountComponent {...args} size="small" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Medium</Text>
        <Box marginBottom="spacing.2" />
        <AmountComponent {...args} size="medium" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Large</Text>
        <Box marginBottom="spacing.2" />
        <AmountComponent {...args} size="large" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Extra Large</Text>
        <Box marginBottom="spacing.2" />
        <AmountComponent {...args} size="xlarge" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Extra Large</Text>
        <Box marginBottom="spacing.2" />
        <AmountComponent {...args} size="2xlarge" />
      </Box>
      <Box marginBottom="spacing.3">
        <Text>Extra Large</Text>
        <Box marginBottom="spacing.2" />
        <AmountComponent {...args} size="3xlarge" />
      </Box>
    </Box>
  );
};

const defaultArgs: AmountProps = {
  value: 123456.789,
  size: 'xlarge',
};

export const AmountSizes: ComponentStory<typeof AmountComponent> = AmountSizesTemplate.bind({});
AmountSizes.args = {
  ...defaultArgs,
};
AmountSizes.storyName = 'Sizes';

const AmountTemplate: ComponentStory<typeof AmountComponent> = (args) => {
  const variants = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <Box width="100%" justifyContent="center">
      {variants.map((variant) => (
        <Box
          key={variant}
          // display="flex"
          alignItems="baseline"
          paddingRight="spacing.3"
          paddingTop="spacing.2"
        >
          <Text>{variant}</Text>
          <AmountComponent {...args} variant={variant} />
        </Box>
      ))}
    </Box>
  );
};

export const RegularWeight = AmountTemplate.bind({});
RegularWeight.args = {
  ...defaultArgs,
  weight: 'regular',
};
RegularWeight.storyName = 'Regular Weight';

export const NoSuffix = AmountTemplate.bind({});
NoSuffix.args = {
  ...defaultArgs,
  suffix: 'none',
};
NoSuffix.storyName = 'No Suffix';

export const HumanizeSuffix = AmountTemplate.bind({});
HumanizeSuffix.args = {
  ...defaultArgs,
  suffix: 'humanize',
};
HumanizeSuffix.storyName = 'Humanize Suffix';

export const AffixSubtleOff = AmountTemplate.bind({});
AffixSubtleOff.args = {
  ...defaultArgs,
  isAffixSubtle: false,
};
AffixSubtleOff.storyName = 'Affix Subtle Off';
