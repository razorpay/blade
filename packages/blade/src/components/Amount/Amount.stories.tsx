import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { AmountProps } from './Amount';
import { Amount as AmountComponent } from './Amount';
import type { AmountHeadingProps, AmountDisplayProps, AmountBodyProps } from './amountTokens';
import { currencyIndicatorMapping } from './amountTokens';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Display, Text } from '~components/Typography';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { objectKeysWithType } from '~utils/objectKeysWithType';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28012%3A580578&t=WfWp7qiwZ3lvvbdw-0"
      componentName="Amount"
      componentDescription="Amounts are used to show small amount of color coded metadata, which are ideal for getting user attention."
      note="This component only displays the provided value in the specified currency, it does not perform any currency conversion."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Amount } from '@razorpay/blade/components';
        
        function App(): React.ReactElement {
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
  tags: ['autodocs'],
  argTypes: { ...getStyledPropsArgTypes() },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<AmountProps>;

const AmountDefaultTemplate: StoryFn<typeof AmountComponent> = (args) => {
  return <AmountComponent {...args} />;
};

export const Amount = AmountDefaultTemplate.bind({});
Amount.args = {
  value: 12500.45,
};
Amount.storyName = 'Default';

const AmountTemplateWithText: StoryFn<typeof AmountComponent> = (args) => {
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
  value: 1000.0,
  type: 'body',
  size: 'medium',
};
AmountWithText.storyName = 'With Text';

const AmountSizesTemplate: StoryFn<typeof AmountComponent> = (args) => {
  const sizes: {
    heading: AmountHeadingProps['size'][];
    body: AmountBodyProps['size'][];
    display: AmountDisplayProps['size'][];
  } = {
    body: ['xsmall', 'small', 'medium', 'large'],
    heading: ['small', 'medium', 'large', 'xlarge', '2xlarge'],
    display: ['small', 'medium', 'large', 'xlarge'],
  };

  return (
    <Box justifyContent="center">
      {objectKeysWithType(sizes).map((amountTypeProp) => (
        <Box key={amountTypeProp}>
          <Display size="small" marginTop="spacing.8" marginBottom="spacing.4">
            Type {amountTypeProp}
          </Display>
          {sizes[amountTypeProp].map((size) => (
            <Box key={size} marginBottom="spacing.4">
              <Text>{size}</Text>
              <BaseBox marginBottom="spacing.1" />
              {/* @ts-expect-error */}
              <AmountComponent {...args} type={amountTypeProp} size={size} />
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
};

const defaultArgs: AmountProps = {
  value: 123456.789,
  size: 'medium',
};

export const AmountSizes: StoryFn<typeof AmountComponent> = AmountSizesTemplate.bind({});
AmountSizes.args = {
  ...defaultArgs,
};
AmountSizes.storyName = 'Sizes';

const AmountTemplate: StoryFn<typeof AmountComponent> = (args) => {
  const colors = ['positive', 'negative', 'notice', 'information'] as const;

  return (
    <BaseBox justifyContent="flex-start">
      {colors.map((color) => (
        <BaseBox
          display="flex"
          key={color}
          alignItems="baseline"
          paddingRight="spacing.3"
          paddingTop="spacing.3"
          flexDirection="column"
        >
          <Text marginBottom="spacing.1">{color}</Text>
          <AmountComponent {...args} color={`feedback.text.${color}.intense`} />
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

const AmountHumanizeSuffixTemplate: StoryFn<typeof AmountComponent> = (args) => {
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

const AmountCurrencyTemplate: StoryFn<typeof AmountComponent> = (args) => {
  const values = Object.keys(currencyIndicatorMapping);

  return (
    <BaseBox justifyContent="flex-start" maxHeight="300px" overflowY="auto">
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
          <AmountComponent {...args} currency={value as AmountProps['currency']} />
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

export const StrikeThrough = AmountDefaultTemplate.bind({});
StrikeThrough.args = {
  ...defaultArgs,
  isStrikethrough: true,
};
StrikeThrough.storyName = 'Strike Through';
