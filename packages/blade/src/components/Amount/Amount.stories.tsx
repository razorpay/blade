import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { AmountProps } from './Amount';
import { Amount as AmountComponent } from './Amount';
import BaseBox from '~components/Box/BaseBox';
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
            <Amount intent="neutral" value={value} />  
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
    <BaseBox
      display="flex"
      alignItems="baseline"
      justifyContent="center"
      paddingRight="spacing.3"
      paddingTop="spacing.2"
    >
      <AmountComponent {...args} />
    </BaseBox>
  );
};

export const Amount = AmountDefaultTemplate.bind({});
Amount.args = {
  value: 122345.678,
  intent: 'neutral',
  size: 'title-medium',
  suffix: 'decimals',
  isAffixSubtle: true,
};
Amount.storyName = 'Default';

const AmountSizesTemplate: ComponentStory<typeof AmountComponent> = ({ ...args }) => {
  return (
    <BaseBox justifyContent="center">
      <BaseBox marginBottom="spacing.3">
        <Text>Small</Text>
        <BaseBox marginBottom="spacing.2" />
        <AmountComponent {...args} size="body-small" />
      </BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Medium</Text>
        <BaseBox marginBottom="spacing.2" />
        <AmountComponent {...args} size="body-medium" />
      </BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Large</Text>
        <BaseBox marginBottom="spacing.2" />
        <AmountComponent {...args} size="heading-small" />
      </BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Extra Large</Text>
        <BaseBox marginBottom="spacing.2" />
        <AmountComponent {...args} size="heading-large" />
      </BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Extra Large</Text>
        <BaseBox marginBottom="spacing.2" />
        <AmountComponent {...args} size="title-small" />
      </BaseBox>
      <BaseBox marginBottom="spacing.3">
        <Text>Extra Large</Text>
        <BaseBox marginBottom="spacing.2" />
        <AmountComponent {...args} size="title-medium" />
      </BaseBox>
    </BaseBox>
  );
};

const defaultArgs: AmountProps = {
  value: 123456.789,
  size: 'title-medium',
};

export const AmountSizes: ComponentStory<typeof AmountComponent> = AmountSizesTemplate.bind({});
AmountSizes.args = {
  ...defaultArgs,
};
AmountSizes.storyName = 'Sizes';

const AmountTemplate: ComponentStory<typeof AmountComponent> = (args) => {
  const intents = ['positive', 'negative', 'notice', 'information', 'neutral'] as const;

  return (
    <BaseBox width="100%" justifyContent="center">
      {intents.map((intent) => (
        <BaseBox key={intent} alignItems="baseline" paddingRight="spacing.3" paddingTop="spacing.2">
          <Text>{intent}</Text>
          <AmountComponent {...args} intent={intent} />
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const RegularWeight = AmountTemplate.bind({});
RegularWeight.args = {
  ...defaultArgs,
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
