import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { CurrencySelectorProps } from './CurrencySelector';
import { CurrencySelector as CurrencySelectorComponent } from './CurrencySelector';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="CurrencySelector lets users switch between currencies, displaying a flag emoji and currency code for each option."
      componentName="CurrencySelector"
      imports={`import { CurrencySelector } from '@razorpay/blade/components';\nimport type { CurrencySelectorProps, CurrencyOption } from '@razorpay/blade/components';`}
    >
      <Sandbox editorHeight={400}>
        {`
          import { Box, CurrencySelector } from '@razorpay/blade/components';

          function App() {
            return (
              <Box padding="spacing.4">
                <CurrencySelector
                  accessibilityLabel="Select currency"
                  defaultValue="USD"
                  currencies={[
                    { code: 'USD', emoji: '🇺🇸' },
                    { code: 'INR', emoji: '🇮🇳' },
                  ]}
                  onChange={(value) => console.log('Selected currency:', value)}
                />
              </Box>
            );
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<typeof CurrencySelectorComponent> = {
  title: 'Components/CurrencySelector',
  component: CurrencySelectorComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
  argTypes: {
    currencies: {
      description: 'Array of currency options to display.',
      table: {
        type: { summary: 'CurrencyOption[]' },
      },
    },
    value: {
      description: 'Controlled selected currency code.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    defaultValue: {
      description: 'Initial selected currency code (uncontrolled).',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
    isDisabled: {
      description: 'Disables all interaction.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    accessibilityLabel: {
      description: 'Accessibility label for the selector group.',
      control: 'text',
      table: {
        type: { summary: 'string' },
      },
    },
  },
};

export default meta;

const defaultCurrencies = [
  { code: 'USD', emoji: '🇺🇸' },
  { code: 'INR', emoji: '🇮🇳' },
];

const Template: StoryFn<typeof CurrencySelectorComponent> = (args) => (
  <Box padding="spacing.4">
    <CurrencySelectorComponent {...args} />
  </Box>
);

export const Default = Template.bind({});
Default.args = {
  currencies: defaultCurrencies,
  defaultValue: 'USD',
  accessibilityLabel: 'Select currency',
};
Default.storyName = 'Default';

export const DefaultINR = Template.bind({});
DefaultINR.args = {
  currencies: defaultCurrencies,
  defaultValue: 'INR',
  accessibilityLabel: 'Select currency',
};
DefaultINR.storyName = 'Default INR Selected';

export const Disabled = Template.bind({});
Disabled.args = {
  currencies: defaultCurrencies,
  defaultValue: 'USD',
  isDisabled: true,
  accessibilityLabel: 'Select currency (disabled)',
};
Disabled.storyName = 'Disabled';

export const MultipleCurrencies = Template.bind({});
MultipleCurrencies.args = {
  currencies: [
    { code: 'USD', emoji: '🇺🇸' },
    { code: 'INR', emoji: '🇮🇳' },
    { code: 'EUR', emoji: '🇪🇺' },
    { code: 'GBP', emoji: '🇬🇧' },
  ],
  defaultValue: 'USD',
  accessibilityLabel: 'Select currency',
};
MultipleCurrencies.storyName = 'Multiple Currencies';

const ControlledTemplate: StoryFn<typeof CurrencySelectorComponent> = () => {
  const [selected, setSelected] = React.useState<string>('USD');
  return (
    <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
      <CurrencySelectorComponent
        currencies={defaultCurrencies}
        value={selected}
        onChange={setSelected}
        accessibilityLabel="Select currency"
      />
      <Text variant="body" size="medium" color="surface.text.gray.subtle">
        Selected: {selected}
      </Text>
    </Box>
  );
};

export const Controlled = ControlledTemplate.bind({});
Controlled.storyName = 'Controlled';
