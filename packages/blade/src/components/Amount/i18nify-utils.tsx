interface GetCurrencyListOutput {
  [currencyCode: keyof typeof CURRENCIES]: Currency;
}

interface Currency {
  symbol: string;
  name: string;
}

interface ByParts {
  currencySymbol: string;
  integerValue: string;
  decimalValue: string;
  separator: string;
  symbolAtFirst: boolean;
}

const CURRENCIES: { [key: string]: { symbol: string; name: string } } = {
  AED: { symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
  ALL: { symbol: 'Lek', name: 'Albanian Lek' },
  AMD: { symbol: '֏', name: 'Armenian Dram' },
  ARS: { symbol: 'ARS', name: 'Argentine Peso' },
  AUD: { symbol: 'A$', name: 'Australian Dollar' },
  AWG: { symbol: 'Afl.', name: 'Aruban Florin' },
  BBD: { symbol: '$', name: 'Barbadian Dollar' },
  BDT: { symbol: '৳', name: 'Bangladeshi Taka' },
  BMD: { symbol: '$', name: 'Bermudian Dollar' },
  BND: { symbol: 'BND', name: 'Brunei Dollar' },
  BOB: { symbol: 'Bs', name: 'Bolivian Boliviano' },
  BSD: { symbol: 'B$', name: 'Bahamian Dollar' },
  BWP: { symbol: 'P', name: 'Botswanan Pula' },
  BZD: { symbol: 'BZ$', name: 'Belize Dollar' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar' },
  CHF: { symbol: 'CHf', name: 'Swiss Franc' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  COP: { symbol: 'COL$', name: 'Colombian Peso' },
  CRC: { symbol: '₡', name: 'Costa Rican Colón' },
  CUP: { symbol: '$MN', name: 'Cuban Peso' },
  CZK: { symbol: 'Kč', name: 'Czech Koruna' },
  DKK: { symbol: 'DKK', name: 'Danish Krone' },
  DOP: { symbol: 'RD$', name: 'Dominican Peso' },
  DZD: { symbol: 'د.ج', name: 'Algerian Dinar' },
  EGP: { symbol: 'E£', name: 'Egyptian Pound' },
  ETB: { symbol: 'ብር', name: 'Ethiopian Birr' },
  EUR: { symbol: '€', name: 'Euro' },
  FJD: { symbol: 'FJ$', name: 'Fijian Dollar' },
  GBP: { symbol: '£', name: 'British Pound' },
  GHS: { symbol: 'GH₵', name: 'Ghanaian Cedi' },
  GIP: { symbol: 'GIP', name: 'Gibraltar Pound' },
  GMD: { symbol: 'D', name: 'Gambian Dalasi' },
  GTQ: { symbol: 'Q', name: 'Guatemalan Quetzal' },
  GYD: { symbol: 'G$', name: 'Guyanese Dollar' },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar' },
  HNL: { symbol: 'HNL', name: 'Honduran Lempira' },
  HRK: { symbol: 'kn', name: 'Croatian Kuna' },
  HTG: { symbol: 'G', name: 'Haitian Gourde' },
  HUF: { symbol: 'Ft', name: 'Hungarian Forint' },
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah' },
  ILS: { symbol: '₪', name: 'Israeli New Shekel' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  JMD: { symbol: 'J$', name: 'Jamaican Dollar' },
  KES: { symbol: 'Ksh', name: 'Kenyan Shilling' },
  KGS: { symbol: 'Лв', name: 'Kyrgystani Som' },
  KHR: { symbol: '៛', name: 'Cambodian Riel' },
  KYD: { symbol: 'CI$', name: 'Cayman Islands Dollar' },
  KZT: { symbol: '₸', name: 'Kazakhstani Tenge' },
  LAK: { symbol: '₭', name: 'Laotian Kip' },
  LKR: { symbol: 'රු', name: 'Sri Lankan Rupee' },
  LRD: { symbol: 'L$', name: 'Liberian Dollar' },
  LSL: { symbol: 'LSL', name: 'Lesotho Loti' },
  MAD: { symbol: 'د.م.', name: 'Moroccan Dirham' },
  MDL: { symbol: 'MDL', name: 'Moldovan Leu' },
  MKD: { symbol: 'ден', name: 'Macedonian Denar' },
  MMK: { symbol: 'MMK', name: 'Myanmar Kyat' },
  MNT: { symbol: '₮', name: 'Mongolian Tugrik' },
  MOP: { symbol: 'MOP$', name: 'Macanese Pataca' },
  MUR: { symbol: '₨', name: 'Mauritian Rupee' },
  MVR: { symbol: 'Rf', name: 'Maldivian Rufiyaa' },
  MWK: { symbol: 'MK', name: 'Malawian Kwacha' },
  MXN: { symbol: 'Mex$', name: 'Mexican Peso' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit' },
  NAD: { symbol: 'N$', name: 'Namibian Dollar' },
  NGN: { symbol: '₦', name: 'Nigerian Naira' },
  NIO: { symbol: 'NIO', name: 'Nicaraguan Córdoba' },
  NOK: { symbol: 'NOK', name: 'Norwegian Krone' },
  NPR: { symbol: 'रू', name: 'Nepalese Rupee' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar' },
  PEN: { symbol: 'S/', name: 'Peruvian Nuevo Sol' },
  PGK: { symbol: 'PGK', name: 'Papua New Guinean Kina' },
  PHP: { symbol: '₱', name: 'Philippine Peso' },
  PKR: { symbol: '₨', name: 'Pakistani Rupee' },
  QAR: { symbol: 'QR', name: 'Qatari Riyal' },
  RUB: { symbol: '₽', name: 'Russian Ruble' },
  SAR: { symbol: 'SR', name: 'Saudi Riyal' },
  SCR: { symbol: 'SRe', name: 'Seychellois Rupee' },
  SEK: { symbol: 'SEK', name: 'Swedish Krona' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar' },
  SLL: { symbol: 'Le', name: 'Sierra Leonean Leone' },
  SOS: { symbol: 'Sh.so.', name: 'Somali Shilling' },
  SSP: { symbol: 'SS£', name: 'South Sudanese Pound' },
  SVC: { symbol: '₡', name: 'Salvadoran Colón' },
  SZL: { symbol: 'E', name: 'Swazi Lilangeni' },
  THB: { symbol: '฿', name: 'Thai Baht' },
  TTD: { symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
  TZS: { symbol: 'Sh', name: 'Tanzanian Shilling' },
  USD: { symbol: '$', name: 'United States Dollar' },
  UYU: { symbol: '$U', name: 'Uruguayan Peso' },
  UZS: { symbol: "so'm", name: 'Uzbekistani Som' },
  YER: { symbol: '﷼', name: 'Yemeni Rial' },
  ZAR: { symbol: 'R', name: 'South African Rand' },
  KWD: { symbol: 'د.ك', name: 'Kuwaiti Dinar' },
  BHD: { symbol: 'د.ب.', name: 'Bahraini Dinar' },
  OMR: { symbol: 'ر.ع.', name: 'Omani Rial' },
};

// this function formats amount based on locale and options provided
export const formatAmount = (
  currencyCode: keyof typeof CURRENCIES,
  amount: string | number,
  options: {
    locale?: string;
    withSymbol?: boolean;
    currencyDisplay?: 'code' | 'symbol' | 'narrowSymbol' | 'name';
    currencySign?: 'standard' | 'accounting';
  } = {},
): string => {
  if (!Number(amount)) throw new Error('Parameter `amount` is not a number!');

  const { withSymbol = true, currencyDisplay = 'symbol', currencySign = 'standard' } = options;
  let { locale } = options;

  const numberFormatOptions: Intl.NumberFormatOptions = {
    style: withSymbol ? 'currency' : 'decimal',
    currency: currencyCode as string,
    currencySign,
  };

  // Define a separate options object for currencyDisplay
  const currencyDisplayOptions: Record<string, string> = {
    currencyDisplay,
  };

  // Merge the two options objects
  const mergedOptions = {
    ...numberFormatOptions,
    ...currencyDisplayOptions,
  };

  // If a specific locale is provided, use it; otherwise, use the browser's locale
  if (!locale) {
    locale = window.navigator.language;
  }

  let formattedAmount = '';

  try {
    formattedAmount = new Intl.NumberFormat(locale || undefined, mergedOptions).format(
      parseFloat(amount as string),
    );
  } catch (err: any) {
    throw new Error(err.message);
  }

  return formattedAmount;
};

export const getCurrencyList = (): GetCurrencyListOutput => {
  return CURRENCIES;
};

export const getCurrencySymbol = (currencyCode: keyof typeof CURRENCIES): string => {
  if (currencyCode in CURRENCIES) return CURRENCIES[currencyCode]?.symbol;
  else throw new Error('Invalid currencyCode!');
};

export const formatAmountByParts = (
  currencyCode: keyof typeof CURRENCIES,
  amount: string | number,
  locale?: string,
): ByParts => {
  if (!Number(amount)) throw new Error('Parameter `amount` is not a number!');

  // If a specific locale is provided, use it; otherwise, use the browser's locale
  if (!locale) {
    locale = window.navigator.language;
  }

  try {
    const formattedAmount = new Intl.NumberFormat(locale || undefined, {
      style: 'currency',
      currency: currencyCode as string,
    }).formatToParts(Number(amount));

    const parts = formattedAmount;
    let integerValue = '';
    let decimalValue = '';
    let currencySymbol = '';
    let separator = '';
    let symbolAtFirst = true;
    const partValues = parts.map((p: any) => {
      if (p.type === 'integer' || p.type === 'group') integerValue += p.value;
      else if (p.type === 'fraction') decimalValue += p.value;
      else if (p.type === 'currency') currencySymbol += p.value;
      else if (p.type === 'decimal') separator += p.value;
      return p.value;
    });

    if (currencySymbol.toString() !== partValues[0].toString()) symbolAtFirst = false;

    return {
      currencySymbol,
      decimalValue,
      integerValue,
      separator,
      symbolAtFirst,
    };
  } catch (error: unknown) {
    // throw new Error(`Something went wrong`);
    console.log('HOLA');
  }
};
