import type { DatesRangeValue } from '@mantine/dates';
import type { CalendarProps } from './types';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import { makeSpace } from '~utils';

const isSamePreset = (value1: DatesRangeValue | null, value2: DatesRangeValue | null): boolean => {
  if (!value1?.[0] || !value1?.[1]) return false;
  if (!value2?.[0] || !value2?.[1]) return false;

  return (
    value1[0].toDateString() === value2[0].toDateString() &&
    value1[1].toDateString() === value2[1].toDateString()
  );
};

type PresetSideBarProps = {
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
}: PresetSideBarProps): React.ReactElement => {
  if (!presets) return <></>;

  return (
    <Box
      padding="spacing.6"
      display="flex"
      flexDirection="column"
      gap="spacing.5"
      backgroundColor="surface.background.gray.moderate"
      width={makeSpace(155)}
    >
      {presets.map((preset, index) => {
        const isSelected = isSamePreset(selectedPreset, preset.value(date));
        return (
          <Link
            size="medium"
            key={index}
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
