const prefixSuffixTextSizes = {
  'body-small': 75,
  'body-small-bold': 75,
  'body-medium': 75,
  'body-medium-bold': 75,
  'heading-small': 75,
  'heading-small-bold': 75,
  'heading-large': 100,
  'heading-large-bold': 100,
  'title-small': 300,
  'title-medium': 400,
} as const;

const amountTextSizes = {
  'body-small': 75,
  'body-small-bold': 75,
  'body-medium': 100,
  'body-medium-bold': 100,
  'heading-small': 200,
  'heading-small-bold': 200,
  'heading-large': 400,
  'heading-large-bold': 400,
  'title-small': 600,
  'title-medium': 700,
} as const;

const currencyPrefixMapping = {
  INR: {
    'currency-symbol': '₹',
    'currency-code': 'INR',
  },
  MYR: {
    'currency-symbol': 'RM',
    'currency-code': 'MYR',
  },
};

const currencylocaleMapping = {
  INR: 'en-IN',
  MYR: 'en-MY',
};

const currencyAbbreviationsMapping = {
  INR: [
    { value: 1e7, symbol: 'Cr' },
    { value: 1e5, symbol: 'L' },
    { value: 1e3, symbol: 'k' },
  ],
  MYR: [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ],
};

export {
  amountTextSizes,
  prefixSuffixTextSizes,
  currencyPrefixMapping,
  currencylocaleMapping,
  currencyAbbreviationsMapping,
};
