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
import { useDropdown } from '~components/Dropdown/useDropdown';

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

type CountrySelectorSearchProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  countryData: CountryData;
};

/**
 * Inner search-input component that must render inside a <Dropdown> tree.
 *
 * Responsibilities:
 *  1. Sets `hasAutoCompleteInHeader = true` so the Dropdown disables its built-in
 *     typeahead and routes arrow-key navigation through the filtered list.
 *  2. Keeps `filteredValues` in the Dropdown context in sync with `searchQuery` so
 *     that ActionList's `useFilteredItems` shows only matching rows (this is what
 *     the VirtualizedList and, after this PR, the non-virtualized list both use).
 *  3. Forwards ArrowUp / ArrowDown / Enter to the Dropdown's keyboard handler so
 *     the user can navigate and select without leaving the search box.
 */
const CountrySelectorSearch = React.forwardRef<HTMLElement, CountrySelectorSearchProps>(
  ({ searchQuery, onSearchChange, countryData }, ref) => {
    const { isOpen, setHasAutoCompleteInHeader, setFilteredValues, onTriggerKeydown } =
      useDropdown();

    // Register as an autocomplete-style header.
    // This single flag:
    //  - disables the Dropdown's built-in typeahead (onComboType returns early)
    //  - enables filtered arrow-key navigation (onOptionChange uses filteredValues)
    React.useEffect(() => {
      setHasAutoCompleteInHeader(true);
      // Initialize with all countries so the list is full before any search
      setFilteredValues(countryData.map((c) => c.code));
      return () => {
        setHasAutoCompleteInHeader(false);
        setFilteredValues([]);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Keep filteredValues in sync whenever isOpen, searchQuery, or countryData changes.
    React.useEffect(() => {
      if (!isOpen) return;

      const query = searchQuery.trim().toLowerCase().replace(/^\+/, '');
      if (!query) {
        setFilteredValues(countryData.map((c) => c.code));
      } else {
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
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, searchQuery, countryData]);

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
          value={searchQuery}
          onChange={({ value }) => onSearchChange(value ?? '')}
          onClearButtonClick={() => onSearchChange('')}
          leadingIcon={SearchIcon}
          size="small"
          onKeyDown={({ event }) => {
            // Forward ArrowUp / ArrowDown / Enter to the Dropdown's keyboard handler.
            // This lets the user navigate the filtered list without leaving the search box.
            // Escape is handled natively by the Dropdown (closes it).
            if (['ArrowUp', 'ArrowDown', 'Enter'].includes(event.key)) {
              event.preventDefault();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onTriggerKeydown?.({ event: event as any });
            }
          }}
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

  // All countries are always passed to ActionList — filtering is done inside the
  // Dropdown context via setFilteredValues (managed by CountrySelectorSearch above).
  // This prevents the `options` array in the Dropdown context from changing on every
  // search keystroke, which was the root cause of the TypeAhead state-desync bug.
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
            <CountrySelectorSearch
              ref={searchInputRef}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              countryData={countryData}
            />
          </BottomSheetHeader>
          <BottomSheetBody>{actionList}</BottomSheetBody>
        </BottomSheet>
      ) : (
        <DropdownOverlay referenceRef={inputWrapperRef}>
          <CountrySelectorSearch
            ref={searchInputRef}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            countryData={countryData}
          />
          {actionList}
        </DropdownOverlay>
      )}
    </Dropdown>
  );
};

export { CountrySelector, countryNameFormatter };
