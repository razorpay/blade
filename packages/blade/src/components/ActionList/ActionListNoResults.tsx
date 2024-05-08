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
      <SearchIcon size="xlarge" color="surface.icon.gray.muted" />
      <Text marginTop="spacing.5" weight="semibold">
        No Search Result Found
      </Text>
      <Text color="surface.text.gray.subtle" marginTop="spacing.3" size="small">
        Try searching for a different value
      </Text>
    </Box>
  );
};

export { ActionListNoResults };
