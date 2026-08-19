import React from 'react';
import { Box } from '~components/Box';
import { Switch } from '~components/Switch';
import { Text } from '~components/Typography';

type SliderLabControlSwitchProps = {
  isChecked: boolean;
  label: string;
  onChange: (isChecked: boolean) => void;
};

const SliderLabControlSwitch = ({
  isChecked,
  label,
  onChange,
}: SliderLabControlSwitchProps): React.ReactElement => (
  <Box as="label" display="flex" alignItems="center" justifyContent="space-between" gap="spacing.4">
    <Text size="small">{label}</Text>
    <Switch
      accessibilityLabel={label}
      isChecked={isChecked}
      onChange={({ isChecked }) => onChange(isChecked)}
      size="small"
    />
  </Box>
);

export { SliderLabControlSwitch };
