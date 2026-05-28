import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-displaynames/polyfill';
import '@formatjs/intl-displaynames/locale-data/en';
import type { CountryCodeType, getFlagsForAllCountries } from '@razorpay/i18nify-js';
import { getDialCodeByCountryCode, getFlagOfCountry } from '@razorpay/i18nify-js';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { size as sizes } from '~tokens/global';
import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemText,
} from '~components/ActionList';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import { Chevron } from '~components/Input/DropdownInputTriggers/Chevron';
import { BaseBox } from '~components/Box/BaseBox';

let countryNameFormatter: { of: (code: string) => string | undefined };
try {
  countryNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });
} catch {
  countryNameFormatter = { of: (code: string) => code };
}

type CountryData = {
  code: CountryCodeType;
  name: string;
}[];

type CountrySelectorProps = {
  selectedCountry: CountryCodeType;
  countryData: CountryData;
  onItemClick: (props: { name: string }) => void;
  flags: ReturnType<typeof getFlagsForAllCountries>;
  isDisabled?: boolean;
  size: 'xsmall' | 'small' | 'medium' | 'large';
};

const flagSize = {
  xsmall: sizes[16],
  small: sizes[16],
  medium: sizes[20],
  large: sizes[24],
} as const;

const FlagImage = ({
  uri,
  width,
  height,
}: {
  uri: string;
  width: number;
  height: number;
}): React.ReactElement => (
  <View style={{ width, height, borderRadius: 2, overflow: 'hidden' }}>
    <SvgUri uri={uri} width={width} height={height} />
  </View>
);

const CountrySelector = ({
  isDisabled,
  selectedCountry,
  countryData,
  onItemClick,
  flags,
  size,
}: CountrySelectorProps): React.ReactElement => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);

  const handleItemClick = (countryCode: string): void => {
    onItemClick({ name: countryCode });
    setIsBottomSheetOpen(false);
  };

  const flagWidth = flagSize[size];
  const flagHeight = (flagWidth * 3) / 4;

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (!isDisabled) {
            setIsBottomSheetOpen(true);
          }
        }}
        disabled={isDisabled}
        accessibilityLabel={`${countryNameFormatter.of(selectedCountry)} - Select Country`}
        accessibilityRole="button"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          justifyContent: 'center',
        }}
      >
        <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
          <FlagImage
            uri={getFlagOfCountry(selectedCountry)['4X3']}
            width={flagWidth}
            height={flagHeight}
          />
          <Chevron isDisabled={isDisabled} isOpen={isBottomSheetOpen} />
        </BaseBox>
      </TouchableOpacity>

      <BottomSheet isOpen={isBottomSheetOpen} onDismiss={() => setIsBottomSheetOpen(false)}>
        <BottomSheetHeader title="Select A Country" />
        <BottomSheetBody>
          <ActionList isVirtualized={true}>
            {isBottomSheetOpen ? countryData.map((country) => {
              return (
                <ActionListItem
                  key={country.code}
                  leading={
                    <ActionListItemAsset
                      src={flags[country.code]['4X3']}
                      alt={country.name}
                    />
                  }
                  title={country.name}
                  value={country.code}
                  isSelected={country.code === selectedCountry}
                  onClick={() => handleItemClick(country.code)}
                  trailing={
                    <ActionListItemText>
                      {getDialCodeByCountryCode(country.code)}
                    </ActionListItemText>
                  }
                />
              );
            }) : null}
          </ActionList>
        </BottomSheetBody>
      </BottomSheet>
    </>
  );
};

export { CountrySelector, countryNameFormatter };
