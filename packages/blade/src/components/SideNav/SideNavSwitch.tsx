import { Box } from '~components/Box';
import { Indicator } from '~components/Indicator';
import { Switch } from '~components/Switch';
import { Text } from '~components/Typography';

const SideNavSwitch = (): React.ReactElement => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingX="spacing.4"
      height="36px"
      as="label"
    >
      <Box display="inline-flex" alignItems="center" gap="spacing.3">
        <Indicator accessibilityLabel="" color="positive" />
        <Text truncateAfterLines={1} weight="medium" size="medium" color="surface.text.gray.subtle">
          Test Mode
        </Text>
      </Box>
      <Switch accessibilityLabel="" />
    </Box>
  );
};

export { SideNavSwitch };
