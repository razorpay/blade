import type { CountryCodeType, getFlagsForAllCountries } from '@razorpay/i18nify-js';
import { getDialCodeByCountryCode, getFlagOfCountry } from '@razorpay/i18nify-js';
import React from 'react';
import { size as sizes } from '~tokens/global';
import { makeSize } from '~utils';
import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemText,
} from '~components/ActionList';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import type { DropdownOverlayProps } from '~components/Dropdown';
import { Dropdown, DropdownHeader, DropdownOverlay, InputDropdownButton } from '~components/Dropdown';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { useIsMobile } from '~utils/useIsMobile';

const countryNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });

type CountryData = {
  code: CountryCodeType;
  name: string;
}[];
type CounterSelectorProps = {
  selectedCountry: CountryCodeType;
  inputWrapperRef: DropdownOverlayProps['referenceRef'];
  countryData: CountryData;
  onItemClick: (props: { name: string }) => void;
  flags: ReturnType<typeof getFlagsForAllCountries>;
  isDisabled?: boolean;
  size: 'xsmall' | 'small' | 'medium' | 'large';
};

const flagSize = {
  xsmall: makeSize(sizes[16]),
  small: makeSize(sizes[16]),
  medium: makeSize(sizes[20]),
  large: makeSize(sizes[24]),
} as const;

const CountrySelector = ({
  isDisabled,
  selectedCountry,
  inputWrapperRef,
  countryData,
  onItemClick,
  flags,
  size,
}: CounterSelectorProps): React.ReactElement => {
  const isMobile = useIsMobile();
  const countryValues = React.useMemo(() => countryData.map((c) => c.code), [countryData]);
  const [filteredValues, setFilteredValues] = React.useState<string[]>(countryValues);

  const handleInputValueChange = ({ value }: { value: string | null }): void => {
    const query = (value ?? '').trim().toLowerCase().replace(/^\+/, '');
    if (!query) {
      setFilteredValues(countryValues);
      return;
    }
    const matching = countryData
      .filter((country) => {
        const dialCode = getDialCodeByCountryCode(country.code).replace(/^\+/, '');
        return (
          country.name.toLowerCase().includes(query) ||
          country.code.toLowerCase().includes(query) ||
          dialCode.startsWith(query)
        );
      })
      .map((c) => c.code);
    setFilteredValues(matching);
  };

  // Reset filtered list when dropdown closes so it shows all countries on next open
  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      setFilteredValues(countryValues);
    }
  };

  const searchInput = (
    <AutoComplete
      accessibilityLabel="Search countries"
      placeholder="Search by country or dial code"
      onInputValueChange={handleInputValueChange}
      filteredValues={filteredValues}
    />
  );

  const actionList = (
    <ActionList isVirtualized={!isMobile}>
      {countryData.map((country) => {
        return (
          <ActionListItem
            key={country.code}
            leading={<ActionListItemAsset src={flags[country.code]['4X3']} alt={country.name} />}
            title={country.name}
            value={country.code}
            trailing={
              <ActionListItemText>{getDialCodeByCountryCode(country.code)}</ActionListItemText>
            }
          />
        );
      })}
    </ActionList>
  );

  const flagImage = (
    <img
      loading="lazy"
      role="presentation"
      width={flagSize[size]}
      src={getFlagOfCountry(selectedCountry)['4X3']}
      alt=""
    />
  );

  return (
    <Dropdown onOpenChange={handleOpenChange}>
      <InputDropdownButton
        value={selectedCountry}
        onChange={({ value }) => onItemClick({ name: value })}
        accessibilityLabel={`${countryNameFormatter.of(selectedCountry)} - Select Country`}
        isDisabled={isDisabled}
        size={size}
        leading={flagImage}
      />
      {isMobile ? (
        <BottomSheet>
          <BottomSheetHeader title="Select A Country">{searchInput}</BottomSheetHeader>
          <BottomSheetBody>{actionList}</BottomSheetBody>
        </BottomSheet>
      ) : (
        <DropdownOverlay referenceRef={inputWrapperRef}>
          <DropdownHeader>{searchInput}</DropdownHeader>
          {actionList}
        </DropdownOverlay>
      )}
    </Dropdown>
  );
};

export { CountrySelector, countryNameFormatter };
