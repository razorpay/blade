import type { CountryCodeType, getFlagsForAllCountries } from '@razorpay/i18nify-js';
import { getDialCodeByCountryCode, getFlagOfCountry } from '@razorpay/i18nify-js';
import React from 'react';
import { Image, Pressable } from 'react-native';
import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemText,
} from '~components/ActionList';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import { ChevronUpDownIcon } from '~components/Icons';
import { size as sizes } from '~tokens/global';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';

const countryNameFormatter = {
  of(code: string): string {
    try {
      const formatter = new Intl.DisplayNames(['en'], { type: 'region' });
      return formatter.of(code) ?? code;
    } catch {
      return code;
    }
  },
};

type CountryData = {
  code: CountryCodeType;
  name: string;
}[];

type CounterSelectorProps = {
  selectedCountry: CountryCodeType;
  countryData: CountryData;
  onItemClick: (props: { name: string }) => void;
  flags: ReturnType<typeof getFlagsForAllCountries>;
  isDisabled?: boolean;
  size: 'xsmall' | 'small' | 'medium' | 'large';
};

const flagSizeMap = {
  xsmall: sizes[16],
  small: sizes[16],
  medium: sizes[20],
  large: sizes[24],
} as const;

const CountrySelector = ({
  isDisabled,
  selectedCountry,
  countryData,
  onItemClick,
  flags,
  size,
}: CounterSelectorProps): React.ReactElement => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);
  const { theme } = useTheme();
  const flagDimension = flagSizeMap[size];

  const handleItemClick = ({ name }: { name: string }): void => {
    onItemClick({ name });
    setIsBottomSheetOpen(false);
  };

  return (
    <>
      <Pressable
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
          paddingHorizontal: theme.spacing[2],
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        <Image
          source={{ uri: getFlagOfCountry(selectedCountry)['4X3'] }}
          style={{ width: flagDimension, height: flagDimension * 0.75, borderRadius: 2 }}
          resizeMode="contain"
        />
        <BaseBox marginLeft="spacing.1">
          <ChevronUpDownIcon size="xsmall" color="interactive.icon.gray.muted" />
        </BaseBox>
      </Pressable>
      <BottomSheet isOpen={isBottomSheetOpen} onDismiss={() => setIsBottomSheetOpen(false)}>
        <BottomSheetHeader title="Select A Country" />
        <BottomSheetBody>
          <ActionList>
            {countryData.map((country) => {
              return (
                <ActionListItem
                  key={country.code}
                  onClick={handleItemClick}
                  leading={
                    <ActionListItemAsset src={flags[country.code]['4X3']} alt={country.name} />
                  }
                  title={country.name}
                  value={country.code}
                  trailing={
                    <ActionListItemText>
                      {getDialCodeByCountryCode(country.code)}
                    </ActionListItemText>
                  }
                />
              );
            })}
          </ActionList>
        </BottomSheetBody>
      </BottomSheet>
    </>
  );
};

export { CountrySelector, countryNameFormatter };
