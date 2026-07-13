import type { PresetSideBarProps } from './types';
import { Box } from '~components/Box';
import { Chip, ChipGroup } from '~components/Chip';
import { Divider } from '~components/Divider';

/**
 * Native preset selection. Native is always the "mobile" layout, so only the
 * `ChipGroup` branch is rendered (the desktop `QuickSelectionItem` sidebar is
 * web-only).
 */
const PresetSideBar = ({ onSelection, presetStates }: PresetSideBarProps): React.ReactElement => {
  if (presetStates.length === 0) return <></>;

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
};

export { PresetSideBar };
