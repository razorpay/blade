import type { FontSize, Typography } from '~tokens/global';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type AmountSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

type AmountDisplayProps = {
  type?: 'display';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

type AmountHeadingProps = {
  type?: 'heading';
  size?: Extract<AmountSizes, 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'semibold'>;
};

type AmountBodyProps = {
  type?: 'body';
  size?: Extract<AmountSizes, 'xsmall' | 'small' | 'medium' | 'large'>;
  weight?: Extract<BaseTextProps['fontWeight'], 'regular' | 'medium' | 'semibold'>;
};

type AmountTypeProps = AmountDisplayProps | AmountHeadingProps | AmountBodyProps;

const normalAmountSizes: Record<
  'body' | 'heading' | 'display',
  Partial<Record<NonNullable<AmountTypeProps['size']>, keyof FontSize>>
> = {
  body: {
    xsmall: 25,
    small: 75,
    medium: 100,
    large: 200,
  },
  heading: {
    small: 300,
    medium: 400,
    large: 500,
    xlarge: 600,
    '2xlarge': 700,
  },
  display: {
    small: 800,
    medium: 900,
    large: 1000,
    xlarge: 1100,
  },
};

const subtleFontSizes: Record<
  'body' | 'heading' | 'display',
  Partial<Record<NonNullable<AmountTypeProps['size']>, keyof FontSize>>
> = {
  body: {
    xsmall: normalAmountSizes.body.xsmall,
    small: normalAmountSizes.body.xsmall,
    medium: normalAmountSizes.body.xsmall,
    large: normalAmountSizes.body.small,
  },
  heading: {
    small: normalAmountSizes.body.small,
    medium: normalAmountSizes.body.medium,
    large: normalAmountSizes.body.large,
    xlarge: normalAmountSizes.heading.medium,
    '2xlarge': normalAmountSizes.heading.large,
  },
  display: {
    small: normalAmountSizes.heading.xlarge,
    medium: normalAmountSizes.heading['2xlarge'],
    large: normalAmountSizes.heading['2xlarge'],
    xlarge: normalAmountSizes.display.small,
  },
};

const amountLineHeights: Record<
  'body' | 'heading' | 'display',
  Partial<Record<NonNullable<AmountTypeProps['size']>, keyof Typography['lineHeights']>>
> = {
  body: {
    xsmall: 25,
    small: 75,
    medium: 100,
    large: 200,
  },
  heading: {
    small: 300,
    medium: 400,
    large: 500,
    xlarge: 600,
    '2xlarge': 700,
  },
  display: {
    small: 800,
    medium: 900,
    large: 1000,
    xlarge: 1100,
  },
};

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
  subtleFontSizes,
  normalAmountSizes,
  amountLineHeights,
  currencyPrefixMapping,
  getCurrencyAbbreviations,
};

export type { Currency, AmountBodyProps, AmountDisplayProps, AmountHeadingProps, AmountTypeProps };
