import type { CountryCodeType, getFlagsForAllCountries } from '@razorpay/i18nify-js';
import { getDialCodeByCountryCode, getFlagOfCountry } from '@razorpay/i18nify-js';
import React from 'react';
import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemText,
} from '~components/ActionList';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import { Box } from '~components/Box';
import type { DropdownOverlayProps } from '~components/Dropdown';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
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
  size: 'medium' | 'large';
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
  const isMobile = useIsMobile();

  const actionList = (
    <ActionList>
      {countryData.map((country) => {
        return (
          <ActionListItem
            key={country.code}
            onClick={onItemClick}
            leading={<ActionListItemAsset src={flags[country.code]} alt={country.name} />}
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

  return (
    <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownButton
        isDisabled={isDisabled}
        size={size === 'medium' ? 'xsmall' : 'medium'}
        variant="tertiary"
        accessibilityLabel={countryNameFormatter.of(selectedCountry)}
        icon={() => (
          <Box display="flex" flexDirection="row" gap="spacing.2">
            <img
              loading="lazy"
              role="presentation"
              width="24px"
              src={getFlagOfCountry(selectedCountry)}
              alt=""
            />
            {isDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Box>
        )}
      />
      {isMobile ? (
        <BottomSheet>
          <BottomSheetHeader title="Sort By" />
          <BottomSheetBody>{actionList}</BottomSheetBody>
        </BottomSheet>
      ) : (
        <DropdownOverlay referenceRef={inputWrapperRef}>{actionList}</DropdownOverlay>
      )}
    </Dropdown>
  );
};

export { CountrySelector, countryNameFormatter };
