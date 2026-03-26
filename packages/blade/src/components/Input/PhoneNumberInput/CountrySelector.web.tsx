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

  // Auto-focus search on desktop when the dropdown opens.
  // This runs after DropdownOverlay's useEffect (child effects run first in React),
  // so it wins the focus race against DropdownOverlay's triggererRef.focus() call.
  React.useEffect(() => {
    if (isDropdownOpen && !isMobile) {
      searchInputRef.current?.focus();
    }
  }, [isDropdownOpen, isMobile]);

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
          <BaseBox
            padding="spacing.3"
            // Prevent click/mousedown from bubbling through the React portal tree
            // to BaseInput's onClick handler, which focuses the phone number input
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <TextInput
              ref={searchInputRef}
              label=""
              accessibilityLabel="Search countries"
              placeholder="Search by country or dial code"
              value={searchQuery}
              onChange={({ value }) => setSearchQuery(value ?? '')}
              onClearButtonClick={() => setSearchQuery('')}
              leadingIcon={SearchIcon}
              size="small"
            />
          </BaseBox>
          {actionList}
        </DropdownOverlay>
      )}
    </Dropdown>
  );
};

export { CountrySelector, countryNameFormatter };
