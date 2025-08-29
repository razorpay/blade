import { default as React } from 'react';
import { IconComponent } from '../components/Icons';
export type PaymentCardBrand = 'visa' | 'mastercard' | 'amex' | 'unknown';
/**
 * Detects the payment card brand based on the card number
 * @param cardNumber - The card number to analyze
 * @returns The detected payment card brand
 */
export declare const detectPaymentCardBrand: (cardNumber: string) => PaymentCardBrand;
/**
 * Payment card brand assets mapping for displaying brand logos
 */
export declare const paymentCardBrandAssets: {
    visa: string;
    mastercard: string;
    amex: string;
};
/**
 * Returns the appropriate icon for the payment card brand
 * @param brand - The payment card brand
 * @returns React element with the brand icon or IconComponent for fallback
 */
export declare const getPaymentCardBrandIcon: (brand: string) => React.ReactElement | IconComponent;
/**
 * Returns the formatting pattern for the payment card number based on brand
 * @param brand - The payment card brand
 * @returns Formatting pattern string
 */
export declare const getPaymentCardNumberFormat: (brand: string) => string;
/**
 * Returns the expected CVV length for the payment card brand
 * @param brand - The payment card brand
 * @returns Expected CVV length (3 or 4 digits)
 */
export declare const getPaymentCardCVVLength: (brand: string) => number;
export declare const usePaymentCardDetection: () => {
    detectPaymentCardBrand: (cardNumber: string) => PaymentCardBrand;
    getPaymentCardBrandIcon: (brand: string) => React.ReactElement | IconComponent;
    getPaymentCardNumberFormat: (brand: string) => string;
    getPaymentCardCVVLength: (brand: string) => number;
    paymentCardBrandAssets: typeof paymentCardBrandAssets;
};
