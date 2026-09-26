import { AMOUNT_AXES } from '../../index';
import type { StoryMeta } from '../types';

// oxlint-disable-next-line checkout/no-hardcoding-currency -- a currency demo needs codes to pick from
const CODES = ['INR', 'USD', 'EUR', 'JPY', 'KWD', 'MYR', 'AED'];

const meta: StoryMeta = {
  title: 'Amount',
  description:
    'A number with its currency, split into parts the component styles apart (formatAmount over the platform Intl — no currency data in the library).',
  argTypes: {
    value: { control: 'number' },
    currency: { control: 'select', options: CODES },
    unit: { control: 'select', options: ['major', 'minor'] },
    currencyDisplay: { control: 'select', options: ['symbol', 'code'] },
    locale: { control: 'text' },
    size: { control: 'select', options: AMOUNT_AXES.size },
    weight: { control: 'select', options: AMOUNT_AXES.weight },
    color: { control: 'select', options: AMOUNT_AXES.color },
    affix: { control: 'select', options: AMOUNT_AXES.affix },
    isStrikethrough: { control: 'boolean' },
  },
  stories: {
    Basic: {
      args: {
        value: 123456.5,
        // oxlint-disable-next-line checkout/no-hardcoding-currency -- the demo's starting currency
        currency: 'INR',
        unit: 'major',
        currencyDisplay: 'symbol',
        locale: 'en-IN',
        size: 'xlarge',
        weight: 'semibold',
        color: 'default',
        affix: 'subtle',
        isStrikethrough: false,
      },
    },
    Currencies: {
      description:
        'The platform decides the decimals (JPY 0, KWD 3), the grouping and which side the currency sits on.',
      argTypes: {},
    },
    Matrix: {
      description: 'Every size, generated from AMOUNT_AXES.',
      argTypes: {},
    },
  },
};

export default meta;
