import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { getCurrencyList } from '@razorpay/i18nify-js/currency';
import { I18nProvider, useI18nContext } from '@razorpay/i18nify-react';
import { useState } from 'react';
import type { AmountProps } from './Amount';
import { Amount as AmountComponent } from './Amount';
import type { AmountHeadingProps, AmountDisplayProps, AmountBodyProps } from './amountTokens';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Display, Text } from '~components/Typography';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { objectKeysWithType } from '~utils/objectKeysWithType';
import { ActionList, ActionListItem } from '~components/ActionList';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { Divider } from '~components/Divider';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Amount"
      componentDescription="Amounts are used to show small amount of color coded metadata, which are ideal for getting user attention."
      note="This component only displays the provided value in the specified currency with the formatting capabilities enabled by @razorpay/i18nify-react, it does not perform any currency conversion."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=73923-3993&t=BlKhwBm0KrrsRDPF-1&scaling=min-zoom&page-id=27439%3A575440&mode=design"
      propsDescription="The Amount component automatically formats numbers based on the user's browser locale enabled by @razorpay/i18nify-react. To adjust the locale according to your page, utilise its hooks for updating the locale. For more details, please refer to
      the documentation of @razorpay/i18nify-react library."
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Amount } from '@razorpay/blade/components';
        
        function App() {
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
  const values = Object.keys(getCurrencyList());

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

// TODO: Replace below with i18nify getDefaultLocales API
const localeList = [
  {
    country: 'India',
    locale: 'en-IN',
  },
  {
    country: 'USA',
    locale: 'en-US',
  },
  {
    country: 'Malaysia',
    locale: 'ms-MY',
  },
  {
    country: 'France',
    locale: 'fr-FR',
  },
  {
    country: 'Germany',
    locale: 'de-DE',
  },
];

const I18nAmountWrapper = (args: AmountProps): JSX.Element => {
  const { setI18nState } = useI18nContext();
  const [currency, setCurrency] = useState('INR');

  return (
    <>
      <AmountComponent {...args} currency={currency as AmountProps['currency']} />
      <Divider marginY="spacing.4" marginTop="spacing.8" />
      <Dropdown selectionType="single">
        <SelectInput label="Select currency" />
        <DropdownOverlay>
          <ActionList>
            {Object.keys(getCurrencyList()).map((value) => (
              <ActionListItem
                key={value}
                title={value}
                value={value}
                onClick={({ name }) => {
                  setCurrency(name);
                }}
              />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Divider marginY="spacing.4" />
      <Dropdown selectionType="single">
        <SelectInput label="Select locale" />
        <DropdownOverlay>
          <ActionList>
            {localeList.map((item) => (
              <ActionListItem
                key={item.locale}
                title={`${item.country}(${item.locale})`}
                value={item.locale}
                onClick={({ name }) => {
                  setI18nState?.({ locale: name });
                }}
              />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </>
  );
};

const I18nAmountTemplate: StoryFn<typeof AmountComponent> = (args) => {
  return (
    <I18nProvider>
      <BaseBox justifyContent="flex-start" minHeight="300px" overflowY="auto">
        <BaseBox
          display="flex"
          alignItems="baseline"
          paddingRight="spacing.3"
          paddingTop="spacing.3"
          flexDirection="column"
        >
          <I18nAmountWrapper {...args} />
        </BaseBox>
      </BaseBox>
    </I18nProvider>
  );
};

export const I18nAmount = I18nAmountTemplate.bind({});
I18nAmount.args = {
  ...defaultArgs,
};
I18nAmount.storyName = 'Amount in diff locales';
