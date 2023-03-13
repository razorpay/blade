const prefixSuffixTextSizes = {
  'body-small': 50,
  'body-medium': 50,
  'heading-small': 50,
  'heading-large': 75,
  'title-small': 200,
  'title-medium': 300,
} as const;

const amountTextSizes = {
  'body-small': 50,
  'body-medium': 75,
  'heading-small': 100,
  'heading-large': 300,
  'title-small': 500,
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
    { value: 1e9, symbol: 'Cr' },
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
