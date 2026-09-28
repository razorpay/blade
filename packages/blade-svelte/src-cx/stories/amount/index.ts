import type { StoryMeta } from '../types';

// oxlint-disable-next-line checkout/no-hardcoding-currency -- a currency demo needs codes to pick from
const CODES = ['INR', 'USD', 'EUR', 'JPY', 'KWD', 'MYR', 'AED'];

const meta: StoryMeta = {
  title: 'Amount',
  description:
    'A number with its currency, split into parts the component styles apart; formatted by i18nify, as Blade React.',
  argTypes: {
    value: { control: 'number' },
    currency: { control: 'select', options: CODES },
    suffix: { control: 'select', options: ['decimals', 'none', 'humanize'] },
    currencyIndicator: {
      control: 'select',
      options: ['currency-symbol', 'currency-code'],
    },
    isAffixSubtle: { control: 'boolean' },
    unit: { control: 'select', options: ['major', 'minor'] },
    locale: { control: 'text' },
    isStrikethrough: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        value: 123456.5,
        // oxlint-disable-next-line checkout/no-hardcoding-currency -- the demo's starting currency
        currency: 'INR',
        suffix: 'decimals',
        currencyIndicator: 'currency-symbol',
        isAffixSubtle: true,
        unit: 'major',
        locale: 'en-IN',
        isStrikethrough: false,
      },
    },
    Currencies: {
      description:
        'With fractionDigits auto the currency decides the decimals (JPY 0, KWD 3); the locale decides the grouping and the currency\'s side.',
      argTypes: {},
    },
    Matrix: {
      description: 'One Amount inside Text and Heading sizes, subtle and plain affixes: it takes the surrounding text’s style.',
      argTypes: {},
    },
  },
};

export default meta;
