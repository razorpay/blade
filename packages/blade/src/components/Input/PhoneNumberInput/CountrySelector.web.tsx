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
import { Dropdown, DropdownOverlay, InputDropdownButton } from '~components/Dropdown';
import { useIsMobile } from '~utils/useIsMobile';
import { TextInput } from '~components/Input/TextInput';
import { SearchIcon } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';

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

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClearButtonClick: () => void;
};

const SearchInput = React.forwardRef<HTMLElement, SearchInputProps>(
  ({ value, onChange, onClearButtonClick }, ref) => {
    return (
      <BaseBox
        padding="spacing.3"
        // Prevent the click from bubbling to BaseInput's onClick, which focuses the phone input
        onClick={(e) => e.stopPropagation()}
      >
        <TextInput
          ref={ref}
          label=""
          accessibilityLabel="Search countries"
          placeholder="Search by country or dial code"
          value={value}
          onChange={({ value: inputValue }) => onChange(inputValue ?? '')}
          onClearButtonClick={onClearButtonClick}
          leadingIcon={SearchIcon}
          size="small"
        />
      </BaseBox>
    );
  },
);

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
  const searchInputRef = React.useRef<HTMLElement | null>(null);

  // Reset search whenever the dropdown / bottom-sheet closes
  React.useEffect(() => {
    if (!isDropdownOpen) setSearchQuery('');
  }, [isDropdownOpen]);

  // Auto-focus search when the dropdown / bottom-sheet opens.
  // This runs after DropdownOverlay's useEffect (child effects run first in React),
  // so it wins the focus race against DropdownOverlay's triggererRef.focus() call.
  React.useEffect(() => {
    if (isDropdownOpen) {
      searchInputRef.current?.focus();
    }
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
    <ActionList>
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
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChange={setSearchQuery}
              onClearButtonClick={() => setSearchQuery('')}
            />
          </BottomSheetHeader>
          <BottomSheetBody>{actionList}</BottomSheetBody>
        </BottomSheet>
      ) : (
        <DropdownOverlay referenceRef={inputWrapperRef}>
          <SearchInput
            ref={searchInputRef}
            value={searchQuery}
            onChange={setSearchQuery}
            onClearButtonClick={() => setSearchQuery('')}
          />
          {actionList}
        </DropdownOverlay>
      )}
    </Dropdown>
  );
};

export { CountrySelector, countryNameFormatter };
