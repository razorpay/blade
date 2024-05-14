import type { DatesRangeValue } from '@mantine/dates';
import type { CalendarProps } from './types';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import { makeSpace } from '~utils';
import { Chip, ChipGroup } from '~components/Chip';
import { Divider } from '~components/Divider';

const isSamePreset = (value1: DatesRangeValue | null, value2: DatesRangeValue | null): boolean => {
  if (!value1?.[0] || !value1?.[1]) return false;
  if (!value2?.[0] || !value2?.[1]) return false;

  return (
    value1[0].toDateString() === value2[0].toDateString() &&
    value1[1].toDateString() === value2[1].toDateString()
  );
};

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
              <Chip value={preset.label} key={index}>
                {preset.label}
              </Chip>
            );
          })}
        </ChipGroup>
      </Box>
    );
  }

  return (
    <Box
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      gap="spacing.5"
      backgroundColor="surface.background.gray.moderate"
      width={makeSpace(160)}
      borderRightColor="surface.border.gray.muted"
      borderRightStyle="solid"
      borderRightWidth="thin"
    >
      {presets.map((preset, index) => {
        const isSelected = isSamePreset(selectedPreset, preset.value(date));
        return (
          <Link
            key={index}
            size="medium"
            variant="button"
            color={isSelected ? 'primary' : 'neutral'}
            onClick={() => onSelection(preset.value)}
          >
            {preset.label}
          </Link>
        );
      })}
    </Box>
  );
};

export { PresetSideBar };
