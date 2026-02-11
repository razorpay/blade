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
  const isMobile = useIsMobile();

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
          <BottomSheetHeader title="Select A Country" />
          <BottomSheetBody>{actionList}</BottomSheetBody>
        </BottomSheet>
      ) : (
        <DropdownOverlay referenceRef={inputWrapperRef}>{actionList}</DropdownOverlay>
      )}
    </Dropdown>
  );
};

export { CountrySelector, countryNameFormatter };
