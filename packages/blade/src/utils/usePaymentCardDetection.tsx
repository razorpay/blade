import React from 'react';
import { CreditCardIcon } from '~components/Icons';

export type PaymentCardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';

/**
 * Detects the payment card brand based on the card number
 * @param cardNumber - The card number to analyze
 * @returns The detected payment card brand
 */
export const detectPaymentCardBrand = (cardNumber: string): PaymentCardBrand => {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  // Visa: starts with 4
  if (cleanNumber.startsWith('4')) {
    return 'visa';
  }

  // Mastercard: starts with 5[1-5] or 2[2-7]
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard';
  }

  // American Express: starts with 34 or 37
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  }

  return 'unknown';
};

/**
 * Payment card brand assets mapping for displaying brand logos
 */
export const paymentCardBrandAssets = {
  visa: 'https://cdn.razorpay.com/card-networks/visa.svg',
  mastercard: 'https://cdn.razorpay.com/card-networks/mastercard.svg',
  amex: 'https://cdn.razorpay.com/card-networks/amex.svg',
};

/**
 * Returns the appropriate icon for the payment card brand
 * @param brand - The payment card brand
 * @returns React element with the brand icon or fallback CreditCardIcon
 */
export const getPaymentCardBrandIcon = (brand: string): React.ReactElement => {
  const assetPath = paymentCardBrandAssets[brand as keyof typeof paymentCardBrandAssets];

  return assetPath ? (
    <img
      src={assetPath}
      alt={brand}
      style={{
        width: '25px',
        height: '25px',
        objectFit: 'contain',
      }}
    />
  ) : (
    <CreditCardIcon size="large" />
  );
};

/**
 * Returns the formatting pattern for the payment card number based on brand
 * @param brand - The payment card brand
 * @returns Formatting pattern string
 */
export const getPaymentCardNumberFormat = (brand: string): string => {
  if (brand === 'amex') {
    return '#### ###### #####';
  }
  return '#### #### #### ####';
};

/**
 * Returns the expected CVV length for the payment card brand
 * @param brand - The payment card brand
 * @returns Expected CVV length (3 or 4 digits)
 */
export const getPaymentCardCVVLength = (brand: string): number => {
  if (brand === 'amex') {
    return 4;
  }
  return 3;
};

export const usePaymentCardDetection = (): {
  detectPaymentCardBrand: (cardNumber: string) => PaymentCardBrand;
  getPaymentCardBrandIcon: (brand: string) => React.ReactElement;
  getPaymentCardNumberFormat: (brand: string) => string;
  getPaymentCardCVVLength: (brand: string) => number;
  paymentCardBrandAssets: typeof paymentCardBrandAssets;
} => {
  return {
    detectPaymentCardBrand,
    getPaymentCardBrandIcon,
    getPaymentCardNumberFormat,
    getPaymentCardCVVLength,
    paymentCardBrandAssets,
  };
};
