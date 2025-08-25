import type { DatesRangeValue } from '../types';
import { usePresetContext } from './PresetContext';
import { QuickSelectionItem } from './QuickSelectionItem.web';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Chip, ChipGroup } from '~components/Chip';
import { Divider } from '~components/Divider';
import { size } from '~tokens/global';
import { makeSpace } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';

type PresetSideBarProps = {
  isMobile?: boolean;
  onSelection: (value: (date: Date) => DatesRangeValue) => void;
};

const PresetSideBar = ({ onSelection, isMobile }: PresetSideBarProps): React.ReactElement => {
  const { presetStates } = usePresetContext();

  if (presetStates.length === 0) return <></>;

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
            const selectedPreset = presetStates.find((state) => state.preset.label === values[0]);
            if (selectedPreset) {
              onSelection(selectedPreset.preset.value);
            }
          }}
        >
          {presetStates.map(({ preset }, index) => {
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
      {presetStates.map(({ preset, isSelected }, index) => {
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
