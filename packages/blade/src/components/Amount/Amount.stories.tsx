import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import Box from '../Box';
import type { AmountProps } from './Amount';
import { Amount as AmountComponent } from './Amount';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8110%3A417',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=9727%3A118573',
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

const AmountTemplate: ComponentStory<typeof AmountComponent> = (args) => {
  const variants = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <Box>
      {variants.map((variant) => (
        <Box key={variant} paddingRight="spacing.3" paddingTop="spacing.2">
          <AmountComponent {...args} variant={variant} />
        </Box>
      ))}
    </Box>
  );
};

export const Amount = AmountTemplate.bind({});
Amount.args = {
  value: 121322.231,
  variant: 'neutral',
  weight: 'bold',
  size: 'small',
};
Amount.storyName = 'Default';

const defaultArgs = {
  value: 121322.231,
};

export const Negative = AmountTemplate.bind({});

Negative.args = {
  ...defaultArgs,
  value: -121322.231,
  variant: 'negative',
};
Negative.storyName = 'Negative';

export const Notice = AmountTemplate.bind({});
Notice.args = {
  ...defaultArgs,
  variant: 'notice',
};
Notice.storyName = 'Notice';

export const Information = AmountTemplate.bind({});
Information.args = {
  ...defaultArgs,
  variant: 'information',
};
Information.storyName = 'Information';

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

export const SmallSize = AmountTemplate.bind({});
SmallSize.args = {
  ...defaultArgs,
  size: 'small',
};
SmallSize.storyName = 'Small Size';

export const AffixSubtleOff = AmountTemplate.bind({});
AffixSubtleOff.args = {
  ...defaultArgs,
  isAffixSubtle: false,
};
AffixSubtleOff.storyName = 'Affix Subtle Off';
