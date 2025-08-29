import { CountryCodeType, getFlagsForAllCountries } from '@razorpay/i18nify-js';
import { default as React } from 'react';
import { DropdownOverlayProps } from '../../Dropdown';
declare const countryNameFormatter: Intl.DisplayNames;
type CountryData = {
    code: CountryCodeType;
    name: string;
}[];
type CounterSelectorProps = {
    selectedCountry: CountryCodeType;
    inputWrapperRef: DropdownOverlayProps['referenceRef'];
    countryData: CountryData;
    onItemClick: (props: {
        name: string;
    }) => void;
    flags: ReturnType<typeof getFlagsForAllCountries>;
    isDisabled?: boolean;
    size: 'medium' | 'large';
};
declare const CountrySelector: ({ isDisabled, selectedCountry, inputWrapperRef, countryData, onItemClick, flags, size, }: CounterSelectorProps) => React.ReactElement;
export { CountrySelector, countryNameFormatter };
