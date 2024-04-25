import type { CountryCodeType, getFlagsForAllCountries } from '@razorpay/i18nify-js';
import { getDialCodeByCountryCode, getFlagOfCountry } from '@razorpay/i18nify-js';
import React from 'react';
import styled from 'styled-components';
import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemText,
} from '~components/ActionList';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import type { DropdownOverlayProps } from '~components/Dropdown';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { useIsMobile } from '~utils/useIsMobile';
import { size as sizes } from '~tokens/global';
import { makeSize } from '~utils';
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
  size: 'medium' | 'large';
};

const CountryDropdownButtonWrapper = styled(BaseBox)(() => {
  return {
    '& > button': {
      padding: '0',
      width: '100%',
    },
  };
});

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

  const flagSize = {
    medium: makeSize(sizes[20]),
    large: makeSize(sizes[24]),
  } as const;

  return (
    <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      {/* TODO: Remove once CountrySelector's button sizing is fixed in figma */}
      <CountryDropdownButtonWrapper
        width={size === 'medium' ? '45px' : '60px'}
        marginLeft={size === 'medium' ? '-3px' : '-2px'}
      >
        <DropdownButton
          isDisabled={isDisabled}
          size={size === 'medium' ? 'xsmall' : 'medium'}
          variant="tertiary"
          accessibilityLabel={`${countryNameFormatter.of(selectedCountry)} - Select Country`}
          icon={isDropdownOpen ? ChevronUpIcon : ChevronDownIcon}
          iconPosition="right"
          // We need to prevent the click event from propagating to the BaseInputWrapper,
          // Because the BaseInputWrapper is listening for click events to focus the input.
          // We don't want that to happen when the user clicks on the dropdown button
          // otherwise the dropdown will close immediately after opening
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* @ts-expect-error */}
          <img
            loading="lazy"
            role="presentation"
            width={flagSize[size]}
            src={getFlagOfCountry(selectedCountry)['4X3']}
            alt=""
          />
        </DropdownButton>
      </CountryDropdownButtonWrapper>
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
