import { Box } from '~components/Box';
import { SearchIcon } from '~components/Icons';
import { Text } from '~components/Typography';

const ActionListNoResults = (): React.ReactElement => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="spacing.5"
    >
      <SearchIcon size="xlarge" color="surface.text.normal.lowContrast" />
      <Text marginTop="spacing.5" weight="bold">
        No Search Result Found
      </Text>
      <Text marginTop="spacing.3" size="small" type="subtle">
        Try Searching for a Different Text
      </Text>
    </Box>
  );
};

export { ActionListNoResults };
