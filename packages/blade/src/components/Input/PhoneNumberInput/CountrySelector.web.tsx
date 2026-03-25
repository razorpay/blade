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
import { useDropdown } from '~components/Dropdown/useDropdown';
import { useIsMobile } from '~utils/useIsMobile';
import { TextInput } from '~components/Input/TextInput';
import { SearchIcon } from '~components/Icons';

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

/**
 * Inner component that lives inside Dropdown context.
 * Registers as an autocomplete-in-header so the Dropdown does not
 * preventDefault on mouse-down events inside the header (which would
 * prevent the TextInput from receiving focus).
 */
const DesktopSearchHeader = ({
  searchQuery,
  onSearch,
  isDropdownOpen,
}: {
  searchQuery: string;
  onSearch: (value: string) => void;
  isDropdownOpen: boolean;
}): React.ReactElement => {
  const { setHasAutoCompleteInHeader } = useDropdown();

  React.useEffect(() => {
    setHasAutoCompleteInHeader(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownHeader>
      <TextInput
        label=""
        accessibilityLabel="Search countries"
        placeholder="Search by country or dial code"
        value={searchQuery}
        onChange={({ value }) => onSearch(value ?? '')}
        onClearButtonClick={() => onSearch('')}
        leadingIcon={SearchIcon}
        size="small"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={isDropdownOpen}
      />
    </DropdownHeader>
  );
};

const CountrySelector = ({
  isDisabled,
  selectedCountry,
  inputWrapperRef,
  countryData,
  onItemClick,
  flags,
  size,
}: CounterSelectorProps): React.ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const isMobile = useIsMobile();

  // Reset search whenever the dropdown / bottom-sheet closes
  React.useEffect(() => {
    if (!isDropdownOpen) setSearchQuery('');
  }, [isDropdownOpen]);

  // Filter countries by name, ISO country code, or dial code (with or without leading "+")
  const filteredCountries = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase().replace(/^\+/, '');
    if (!query) return countryData;
    return countryData.filter((country) => {
      const dialCode = getDialCodeByCountryCode(country.code).replace(/^\+/, '');
      return (
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        dialCode.startsWith(query)
      );
    });
  }, [countryData, searchQuery]);

  const actionList = (
    /*
     * Virtualization is intentionally disabled on mobile because enabling it
     * inside a BottomSheet conflicts with the sheet's own scroll behaviour and
     * causes rendering artefacts. On desktop the full virtual list is safe to use.
     */
    <ActionList isVirtualized={!isMobile}>
      {filteredCountries.map((country) => {
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
    <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
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
          <BottomSheetHeader title="Select A Country">
            <TextInput
              label=""
              accessibilityLabel="Search countries"
              placeholder="Search by country or dial code"
              value={searchQuery}
              onChange={({ value }) => setSearchQuery(value ?? '')}
              onClearButtonClick={() => setSearchQuery('')}
              leadingIcon={SearchIcon}
              size="small"
            />
          </BottomSheetHeader>
          <BottomSheetBody>{actionList}</BottomSheetBody>
        </BottomSheet>
      ) : (
        <DropdownOverlay referenceRef={inputWrapperRef}>
          <DesktopSearchHeader
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
            isDropdownOpen={isDropdownOpen}
          />
          {actionList}
        </DropdownOverlay>
      )}
    </Dropdown>
  );
};

export { CountrySelector, countryNameFormatter };
