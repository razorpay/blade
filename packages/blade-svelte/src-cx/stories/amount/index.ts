import { AMOUNT_AXES } from '../../index';
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
    type: { control: 'select', options: AMOUNT_AXES.type },
    size: { control: 'select', options: AMOUNT_AXES.size, description: 'inherit: the surrounding text; else per type (body xsmall–large, heading small–2xlarge, display small–xlarge)' },
    weight: { control: 'select', options: AMOUNT_AXES.weight },
    color: { control: 'select', options: AMOUNT_AXES.color },
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
        type: 'body',
        size: 'inherit',
        weight: 'inherit',
        color: 'inherit',
        isAffixSubtle: true,
        unit: 'major',
        locale: 'en-IN',
        isStrikethrough: false,
      },
    },
    Currencies: {
      description:
        "With fractionDigits auto the currency decides the decimals (JPY 0, KWD 3); the locale decides the grouping and the currency's side.",
      argTypes: {},
    },
    Variants: {
      description:
        "Every variant of Blade DSL's Amount (Figma): each type's sizes in each of its weights, then a plain affix. Size, weight and colour default to inherit.",
      argTypes: {},
    },
    Matrix: {
      description:
        'One Amount inside Text and Heading sizes, subtle and plain affixes: it takes the surrounding text’s style.',
      argTypes: {},
    },
  },
};

export default meta;
