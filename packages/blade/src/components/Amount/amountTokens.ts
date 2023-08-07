import type { AmountProps } from './Amount';
import type { FontSize, Typography } from '~tokens/global';

const affixFontSizes: Record<NonNullable<AmountProps['size']>, keyof FontSize> = {
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

const amountFontSizes: Record<NonNullable<AmountProps['size']>, keyof FontSize> = {
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

const amountLineHeights: Record<
  NonNullable<AmountProps['size']>,
  keyof Typography['lineHeights']
> = {
  'body-small': 50,
  'body-small-bold': 50,
  'body-medium': 100,
  'body-medium-bold': 100,
  'heading-small': 300,
  'heading-small-bold': 300,
  'heading-large': 400,
  'heading-large-bold': 400,
  'title-small': 500,
  'title-medium': 600,
} as const;

// All the supported currency codes are taken from Razorpay's Merchant Dashboard codebase
const currencyPrefixMapping = {
  AED: { 'currency-symbol': 'د.إ', 'currency-code': 'AED' },
  ALL: { 'currency-symbol': 'Lek', 'currency-code': 'ALL' },
  AMD: { 'currency-symbol': '֏', 'currency-code': 'AMD' },
  ARS: { 'currency-symbol': 'ARS', 'currency-code': 'ARS' },
  AUD: { 'currency-symbol': 'A$', 'currency-code': 'AUD' },
  AWG: { 'currency-symbol': 'Afl.', 'currency-code': 'AWG' },
  BBD: { 'currency-symbol': '$', 'currency-code': 'BBD' },
  BDT: { 'currency-symbol': '৳', 'currency-code': 'BDT' },
  BMD: { 'currency-symbol': '$', 'currency-code': 'BMD' },
  BND: { 'currency-symbol': 'BND', 'currency-code': 'BND' },
  BOB: { 'currency-symbol': 'Bs', 'currency-code': 'BOB' },
  BSD: { 'currency-symbol': 'B$', 'currency-code': 'BSD' },
  BWP: { 'currency-symbol': 'P', 'currency-code': 'BWP' },
  BZD: { 'currency-symbol': 'BZ$', 'currency-code': 'BZD' },
  CAD: { 'currency-symbol': 'C$', 'currency-code': 'CAD' },
  CHF: { 'currency-symbol': 'CHf', 'currency-code': 'CHF' },
  CNY: { 'currency-symbol': '¥', 'currency-code': 'CNY' },
  COP: { 'currency-symbol': 'COL$', 'currency-code': 'COP' },
  CRC: { 'currency-symbol': '₡', 'currency-code': 'CRC' },
  CUP: { 'currency-symbol': '$MN', 'currency-code': 'CUP' },
  CZK: { 'currency-symbol': 'Kč', 'currency-code': 'CZK' },
  DKK: { 'currency-symbol': 'DKK', 'currency-code': 'DKK' },
  DOP: { 'currency-symbol': 'RD$', 'currency-code': 'DOP' },
  DZD: { 'currency-symbol': 'د.ج', 'currency-code': 'DZD' },
  EGP: { 'currency-symbol': 'E£', 'currency-code': 'EGP' },
  ETB: { 'currency-symbol': 'ብር', 'currency-code': 'ETB' },
  EUR: { 'currency-symbol': '€', 'currency-code': 'EUR' },
  FJD: { 'currency-symbol': 'FJ$', 'currency-code': 'FJD' },
  GBP: { 'currency-symbol': '£', 'currency-code': 'GBP' },
  GHS: { 'currency-symbol': 'GH₵', 'currency-code': 'GHS' },
  GIP: { 'currency-symbol': 'GIP', 'currency-code': 'GIP' },
  GMD: { 'currency-symbol': 'D', 'currency-code': 'GMD' },
  GTQ: { 'currency-symbol': 'Q', 'currency-code': 'GTQ' },
  GYD: { 'currency-symbol': 'G$', 'currency-code': 'GYD' },
  HKD: { 'currency-symbol': 'HK$', 'currency-code': 'HKD' },
  HNL: { 'currency-symbol': 'HNL', 'currency-code': 'HNL' },
  HRK: { 'currency-symbol': 'kn', 'currency-code': 'HRK' },
  HTG: { 'currency-symbol': 'G', 'currency-code': 'HTG' },
  HUF: { 'currency-symbol': 'Ft', 'currency-code': 'HUF' },
  IDR: { 'currency-symbol': 'Rp', 'currency-code': 'IDR' },
  ILS: { 'currency-symbol': '₪', 'currency-code': 'ILS' },
  INR: { 'currency-symbol': '₹', 'currency-code': 'INR' },
  JMD: { 'currency-symbol': 'J$', 'currency-code': 'JMD' },
  KES: { 'currency-symbol': 'Ksh', 'currency-code': 'KES' },
  KGS: { 'currency-symbol': 'Лв', 'currency-code': 'KGS' },
  KHR: { 'currency-symbol': '៛', 'currency-code': 'KHR' },
  KYD: { 'currency-symbol': 'CI$', 'currency-code': 'KYD' },
  KZT: { 'currency-symbol': '₸', 'currency-code': 'KZT' },
  LAK: { 'currency-symbol': '₭', 'currency-code': 'LAK' },
  LKR: { 'currency-symbol': 'රු', 'currency-code': 'LKR' },
  LRD: { 'currency-symbol': 'L$', 'currency-code': 'LRD' },
  LSL: { 'currency-symbol': 'LSL', 'currency-code': 'LSL' },
  MAD: { 'currency-symbol': 'د.م.', 'currency-code': 'MAD' },
  MDL: { 'currency-symbol': 'MDL', 'currency-code': 'MDL' },
  MKD: { 'currency-symbol': 'ден', 'currency-code': 'MKD' },
  MMK: { 'currency-symbol': 'MMK', 'currency-code': 'MMK' },
  MNT: { 'currency-symbol': '₮', 'currency-code': 'MNT' },
  MOP: { 'currency-symbol': 'MOP$', 'currency-code': 'MOP' },
  MUR: { 'currency-symbol': '₨', 'currency-code': 'MUR' },
  MVR: { 'currency-symbol': 'Rf', 'currency-code': 'MVR' },
  MWK: { 'currency-symbol': 'MK', 'currency-code': 'MWK' },
  MXN: { 'currency-symbol': 'Mex$', 'currency-code': 'MXN' },
  MYR: { 'currency-symbol': 'RM', 'currency-code': 'MYR' },
  NAD: { 'currency-symbol': 'N$', 'currency-code': 'NAD' },
  NGN: { 'currency-symbol': '₦', 'currency-code': 'NGN' },
  NIO: { 'currency-symbol': 'NIO', 'currency-code': 'NIO' },
  NOK: { 'currency-symbol': 'NOK', 'currency-code': 'NOK' },
  NPR: { 'currency-symbol': 'रू', 'currency-code': 'NPR' },
  NZD: { 'currency-symbol': 'NZ$', 'currency-code': 'NZD' },
  PEN: { 'currency-symbol': 'S/', 'currency-code': 'PEN' },
  PGK: { 'currency-symbol': 'PGK', 'currency-code': 'PGK' },
  PHP: { 'currency-symbol': '₱', 'currency-code': 'PHP' },
  PKR: { 'currency-symbol': '₨', 'currency-code': 'PKR' },
  QAR: { 'currency-symbol': 'QR', 'currency-code': 'QAR' },
  RUB: { 'currency-symbol': '₽', 'currency-code': 'RUB' },
  SAR: { 'currency-symbol': 'SR', 'currency-code': 'SAR' },
  SCR: { 'currency-symbol': 'SRe', 'currency-code': 'SCR' },
  SEK: { 'currency-symbol': 'SEK', 'currency-code': 'SEK' },
  SGD: { 'currency-symbol': 'S$', 'currency-code': 'SGD' },
  SLL: { 'currency-symbol': 'Le', 'currency-code': 'SLL' },
  SOS: { 'currency-symbol': 'Sh.so.', 'currency-code': 'SOS' },
  SSP: { 'currency-symbol': 'SS£', 'currency-code': 'SSP' },
  SVC: { 'currency-symbol': '₡', 'currency-code': 'SVC' },
  SZL: { 'currency-symbol': 'E', 'currency-code': 'SZL' },
  THB: { 'currency-symbol': '฿', 'currency-code': 'THB' },
  TTD: { 'currency-symbol': 'TT$', 'currency-code': 'TTD' },
  TZS: { 'currency-symbol': 'Sh', 'currency-code': 'TZS' },
  USD: { 'currency-symbol': '$', 'currency-code': 'USD' },
  UYU: { 'currency-symbol': '$U', 'currency-code': 'UYU' },
  UZS: { 'currency-symbol': "so'm", 'currency-code': 'UZS' },
  YER: { 'currency-symbol': '﷼', 'currency-code': 'YER' },
  ZAR: { 'currency-symbol': 'R', 'currency-code': 'ZAR' },
  KWD: { 'currency-symbol': 'د.ك', 'currency-code': 'KWD' },
  BHD: { 'currency-symbol': 'د.ب.', 'currency-code': 'BHD' },
  OMR: { 'currency-symbol': 'ر.ع.', 'currency-code': 'OMR' },
};

type CurrencyLocaleMapping = {
  [key: string]: string;
};

// The locale mapping may have a few extra locales that are not supported by the currency prefix mapping
// This is ok, for consumers we expose only supported locales
const currencyLocaleMapping: CurrencyLocaleMapping = {
  AED: 'en-AE', // United Arab Emirates Dirham
  ALL: 'en-AL', // Albanian Lek
  AMD: 'en-AM', // Armenian Dram
  ANG: 'en-CW', // Netherlands Antillean Guilder
  AOA: 'en-AO', // Angolan Kwanza
  ARS: 'en-AR', // Argentine Peso
  AUD: 'en-AU', // Australian Dollar
  AWG: 'en-AW', // Aruban Florin
  AZN: 'en-Latn-AZ', // Azerbaijani Manat
  BAM: 'en-Latn-BA', // Bosnia-Herzegovina Convertible Mark
  BBD: 'en-BB', // Barbadian Dollar
  BDT: 'en-BD', // Bangladeshi Taka
  BGN: 'en-BG', // Bulgarian Lev
  BHD: 'en-BH', // Bahraini Dinar
  BIF: 'en-BI', // Burundian Franc
  BMD: 'en-BM', // Bermudian Dollar
  BND: 'en-BN', // Brunei Dollar
  BOB: 'en-BO', // Bolivian Boliviano
  BRL: 'en-BR', // Brazilian Real
  BSD: 'en-BS', // Bahamian Dollar
  BTN: 'en-BT', // Bhutanese Ngultrum
  BWP: 'en-BW', // Botswana Pula
  BYN: 'en-BY', // Belarusian Ruble
  BZD: 'en-BZ', // Belize Dollar
  CAD: 'en-CA', // Canadian Dollar
  CDF: 'en-CD', // Congolese Franc
  CHF: 'en-CH', // Swiss Franc
  CLP: 'en-CL', // Chilean Peso
  CNY: 'en-CN', // Chinese Yuan
  COP: 'en-CO', // Colombian Peso
  CRC: 'en-CR', // Costa Rican Colón
  CUC: 'en-CU', // Cuban Convertible Peso
  CUP: 'en-CU', // Cuban Peso
  CVE: 'en-CV', // Cape Verdean Escudo
  CZK: 'en-CZ', // Czech Koruna
  DJF: 'en-DJ', // Djiboutian Franc
  DKK: 'en-DK', // Danish Krone
  DOP: 'en-DO', // Dominican Peso
  DZD: 'en-DZ', // Algerian Dinar
  EGP: 'en-EG', // Egyptian Pound
  ERN: 'en-ER', // Eritrean Nakfa
  ETB: 'en-ET', // Ethiopian Birr
  EUR: 'en-EU', // Euro
  FJD: 'en-FJ', // Fijian Dollar
  FKP: 'en-FK', // Falkland Islands Pound
  GBP: 'en-GB', // British Pound Sterling
  GEL: 'en-GE', // Georgian Lari
  GHS: 'en-GH', // Ghanaian Cedi
  GIP: 'en-GI', // Gibraltar Pound
  GMD: 'en-GM', // Gambian Dalasi
  GNF: 'en-GN', // Guinean Franc
  GTQ: 'en-GT', // Guatemalan Quetzal
  GYD: 'en-GY', // Guyanese Dollar
  HKD: 'en-HK', // Hong Kong Dollar
  HNL: 'en-HN', // Honduran Lempira
  HRK: 'en-HR', // Croatian Kuna
  HTG: 'en-HT', // Haitian Gourde
  HUF: 'en-HU', // Hungarian Forint
  IDR: 'en-ID', // Indonesian Rupiah
  ILS: 'en-IL', // Israeli New Shekel
  INR: 'en-IN', // Indian Rupee
  IQD: 'en-IQ', // Iraqi Dinar
  IRR: 'en-IR', // Iranian Rial
  ISK: 'en-IS', // Icelandic Króna
  JMD: 'en-JM', // Jamaican Dollar
  JOD: 'en-JO', // Jordanian Dinar
  JPY: 'en-JP', // Japanese Yen
  KES: 'en-KE', // Kenyan Shilling
  KGS: 'en-KG', // Kyrgyzstani Som
  KHR: 'en-KH', // Cambodian Riel
  KMF: 'en-KM', // Comorian Franc
  KPW: 'en-KP', // North Korean Won
  KRW: 'en-KR', // South Korean Won
  KWD: 'en-KW', // Kuwaiti Dinar
  KYD: 'en-KY', // Cayman Islands Dollar
  KZT: 'en-KZ', // Kazakhstani Tenge
  LAK: 'en-LA', // Lao Kip
  LBP: 'en-LB', // Lebanese Pound
  LKR: 'en-LK', // Sri Lankan Rupee
  LRD: 'en-LR', // Liberian Dollar
  LSL: 'en-LS', // Lesotho Loti
  LYD: 'en-LY', // Libyan Dinar
  MAD: 'en-MA', // Moroccan Dirham
  MDL: 'en-MD', // Moldovan Leu
  MGA: 'en-MG', // Malagasy Ariary
  MKD: 'en-MK', // Macedonian Denar
  MMK: 'en-MM', // Myanmar Kyat
  MNT: 'en-MN', // Mongolian Tugrik
  MOP: 'en-MO', // Macanese Pataca
  MRO: 'en-MR', // Mauritanian Ouguiya
  MRU: 'en-MR', // Mauritanian Ouguiya
  MUR: 'en-MU', // Mauritian Rupee
  MVR: 'en-MV', // Maldivian Rufiyaa
  MWK: 'en-MW', // Malawian Kwacha
  MXN: 'en-MX', // Mexican Peso
  MYR: 'en-MY', // Malaysian Ringgit
  MZN: 'en-MZ', // Mozambican Metical
  NAD: 'en-NA', // Namibian Dollar
  NGN: 'en-NG', // Nigerian Naira
  NIO: 'en-NI', // Nicaraguan Córdoba
  NOK: 'en-NO', // Norwegian Krone
  NPR: 'en-NP', // Nepalese Rupee
  NZD: 'en-NZ', // New Zealand Dollar
  OMR: 'en-OM', // Omani Rial
  PAB: 'en-PA', // Panamanian Balboa
  PEN: 'en-PE', // Peruvian Sol
  PGK: 'en-PG', // Papua New Guinean Kina
  PHP: 'en-PH', // Philippine Peso
  PKR: 'en-PK', // Pakistani Rupee
  PLN: 'en-PL', // Polish Złoty
  PYG: 'en-PY', // Paraguayan Guarani
  QAR: 'en-QA', // Qatari Riyal
  RON: 'en-RO', // Romanian Leu
  RSD: 'en-Latn-RS', // Serbian Dinar
  RUB: 'en-RU', // Russian Ruble
  RWF: 'en-RW', // Rwandan Franc
  SAR: 'en-SA', // Saudi Riyal
  SBD: 'en-SB', // Solomon Islands Dollar
  SCR: 'en-SC', // Seychellois Rupee
  SDG: 'en-SD', // Sudanese Pound
  SEK: 'en-SE', // Swedish Krona
  SGD: 'en-SG', // Singapore Dollar
  SLL: 'en-SL', // Sierra Leonean Leone
  SOS: 'en-SO', // Somali Shilling
  SRD: 'en-SR', // Surinamese Dollar
  SSP: 'en-SS', // South Sudanese Pound
  STD: 'en-ST', // São Tomé and Príncipe Dobra
  STN: 'en-ST', // São Tomé and Príncipe Dobra
  SVC: 'en-SV', // Salvadoran Colón
  SYP: 'en-SY', // Syrian Pound
  SZL: 'en-SZ', // Eswatini Lilangeni
  THB: 'en-TH', // Thai Baht
  TJS: 'en-Cyrl-TJ', // Tajikistani Somoni
  TMT: 'en-TM', // Turkmenistani Manat
  TTD: 'en-TT', // Trinidad and Tobago Dollar
  TZS: 'en-TZ', // Tanzanian Shilling
  USD: 'en-US', // United States Dollar
  UYU: 'en-UY', // Uruguayan Peso
  YER: 'en-YE', // Yemeni Rial
  ZAR: 'en-ZA', // South African Rand
};

type CurrencyAbbreviation = {
  value: number;
  symbol: string;
};

type Currency = keyof typeof currencyPrefixMapping;

const getCurrencyAbbreviations = (currency: Currency): CurrencyAbbreviation[] => {
  if (currency === 'INR') {
    return [
      { value: 1e7, symbol: 'Cr' },
      { value: 1e5, symbol: 'L' },
      { value: 1e3, symbol: 'k' },
    ];
  }

  return [
    { value: 1e9, symbol: 'B' },
    { value: 1e6, symbol: 'M' },
    { value: 1e3, symbol: 'K' },
  ];
};

export {
  amountFontSizes,
  amountLineHeights,
  affixFontSizes,
  currencyPrefixMapping,
  currencyLocaleMapping,
  getCurrencyAbbreviations,
};

export type { Currency };
