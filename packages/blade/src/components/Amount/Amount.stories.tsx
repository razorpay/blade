import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { getStyledPropsArgTypes } from '../Box/BaseBox/storybookArgTypes';
import type { AmountProps } from './Amount';
import { Amount as AmountComponent } from './Amount';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Text } from '~components/Typography';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

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
          return <Amount value={10000} />;
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
  argTypes: { ...getStyledPropsArgTypes() },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<AmountProps>;

const AmountDefaultTemplate: ComponentStory<typeof AmountComponent> = (args) => {
  return <AmountComponent {...args} />;
};

export const Amount = AmountDefaultTemplate.bind({});
Amount.args = {
  value: 12500.45,
};
Amount.storyName = 'Default';

const AmountTemplateWithText: ComponentStory<typeof AmountComponent> = (args) => {
  return (
    <BaseBox display="flex" flexDirection="row" flexWrap="wrap">
      <Text>Total Amount is</Text>
      <AmountComponent {...args} />
      <Text>only.</Text>
    </BaseBox>
  );
};

export const AmountWithText = AmountTemplateWithText.bind({});

AmountWithText.args = {
  value: 12500.45,
  size: 'body-medium',
};
AmountWithText.storyName = 'With Text';

const AmountSizesTemplate: ComponentStory<typeof AmountComponent> = ({ ...args }) => {
  const sizes: AmountProps['size'][] = [
    'body-small',
    'body-small-bold',
    'body-medium',
    'body-medium-bold',
    'heading-small',
    'heading-small-bold',
    'heading-large',
    'heading-large-bold',
    'title-small',
    'title-medium',
  ];
  return (
    <BaseBox justifyContent="center">
      {sizes.map((size) => (
        <BaseBox key={size} marginBottom="spacing.3">
          <Text>{size}</Text>
          <BaseBox marginBottom="spacing.1" />
          <AmountComponent {...args} size={size} />
        </BaseBox>
      ))}
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
  const intents = ['positive', 'negative', 'notice', 'information'] as const;

  return (
    <BaseBox justifyContent="flex-start">
      {intents.map((intent) => (
        <BaseBox
          display="flex"
          key={intent}
          alignItems="baseline"
          paddingRight="spacing.3"
          paddingTop="spacing.3"
          flexDirection="column"
        >
          <Text marginBottom="spacing.1">{intent}</Text>
          <AmountComponent {...args} intent={intent} />
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const AllIntents = AmountTemplate.bind({});
AllIntents.args = {
  ...defaultArgs,
};
AllIntents.storyName = 'All Intents';

export const NoSuffix = AmountDefaultTemplate.bind({});
NoSuffix.args = {
  ...defaultArgs,
  suffix: 'none',
};
NoSuffix.storyName = 'No Suffix';

const AmountHumanizeSuffixTemplate: ComponentStory<typeof AmountComponent> = (args) => {
  const values = [1234, 12345, 123456, 1234567, 12345678] as const;

  return (
    <BaseBox justifyContent="flex-start">
      {values.map((value) => (
        <BaseBox paddingBottom="spacing.3" key={value}>
          <AmountComponent {...args} value={value} />
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const HumanizeSuffix = AmountHumanizeSuffixTemplate.bind({});
HumanizeSuffix.args = {
  ...defaultArgs,
  suffix: 'humanize',
};
HumanizeSuffix.storyName = 'Humanize Suffix';

const AmountCurrencyTemplate: ComponentStory<typeof AmountComponent> = (args) => {
  const values = ['INR', 'MYR'] as const;

  return (
    <BaseBox justifyContent="flex-start">
      {values.map((value) => (
        <BaseBox
          display="flex"
          key={value}
          alignItems="baseline"
          paddingRight="spacing.3"
          paddingTop="spacing.3"
          flexDirection="column"
        >
          <Text marginBottom="spacing.1">{value}</Text>
          <AmountComponent {...args} currency={value} />
        </BaseBox>
      ))}
    </BaseBox>
  );
};

export const Currency = AmountCurrencyTemplate.bind({});
Currency.args = {
  ...defaultArgs,
  suffix: 'humanize',
};
Currency.storyName = 'Currency';

export const AffixSubtleOff = AmountDefaultTemplate.bind({});
AffixSubtleOff.args = {
  ...defaultArgs,
  isAffixSubtle: false,
};
AffixSubtleOff.storyName = 'Affix Subtle Off';
