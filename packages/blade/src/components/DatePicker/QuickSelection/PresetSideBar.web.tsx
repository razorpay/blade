import type { CalendarProps, DatesRangeValue } from '../types';
import { QuickSelectionItem } from './QuickSelectionItem.web';
import { Box } from '~components/Box';
import { makeSpace } from '~utils';
import { Chip, ChipGroup } from '~components/Chip';
import { Divider } from '~components/Divider';
import BaseBox from '~components/Box/BaseBox';
import { makeAccessible } from '~utils/makeAccessible';
import { size } from '~tokens/global';
import { isCustomSelected, isSamePreset } from './utils';

type PresetSideBarProps = {
  isMobile?: boolean;
  date: Date;
  presets: CalendarProps<'single'>['presets'];
  onSelection: (value: (date: Date) => DatesRangeValue) => void;
  selectedPreset: DatesRangeValue | null;
};

const PresetSideBar = ({
  date,
  presets,
  selectedPreset,
  onSelection,
  isMobile,
}: PresetSideBarProps): React.ReactElement => {
  if (!presets) return <></>;

  if (isMobile) {
    return (
      <Box>
        <Divider marginTop="spacing.4" />
        <ChipGroup
          marginTop="spacing.7"
          size="small"
          selectionType="single"
          accessibilityLabel="Select Presets"
          onChange={({ values }) => {
            onSelection(presets.find((preset) => preset.label === values[0])!.value);
          }}
        >
          {presets.map((preset, index) => {
            return (
              <Chip value={preset.label} key={index} data-analytics-name={preset.label}>
                {preset.label}
              </Chip>
            );
          })}
        </ChipGroup>
      </Box>
    );
  }

  return (
    <BaseBox
      padding="spacing.5"
      display="flex"
      flexDirection="column"
      gap="spacing.2"
      backgroundColor="surface.background.gray.moderate"
      minWidth={makeSpace(size[160])}
      borderRightColor="surface.border.gray.muted"
      borderRightStyle="solid"
      borderRightWidth="thin"
      {...makeAccessible({ role: 'listbox', label: 'Select Presets' })}
    >
      {presets.map((preset, index) => {
        const isSelected =
          preset.label === 'Custom' && isCustomSelected
            ? isCustomSelected(selectedPreset, date, presets)
            : isSamePreset(selectedPreset, preset.value(date));
        return (
          <QuickSelectionItem
            key={index}
            isSelected={isSelected}
            onClick={() => onSelection(preset.value)}
          >
            {preset.label}
          </QuickSelectionItem>
        );
      })}
    </BaseBox>
  );
};

export { PresetSideBar };
