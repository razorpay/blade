import { Divider } from './Divider';
import Box from '~components/Box';
import { Text } from '~components/Typography';

type CardHeaderProps = {
  title: string;
  subtitle?: string;
  titlePrefix?: React.ReactNode;
  titleSuffix?: React.ReactNode;
  trailingVisual?: React.ReactNode;
};

const CardHeader = ({
  title,
  subtitle,
  titlePrefix,
  titleSuffix,
  trailingVisual,
}: CardHeaderProps): React.ReactElement => {
  return (
    <Box marginBottom="spacing.7">
      <Box
        marginBottom="spacing.7"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box display="flex" flexDirection="row">
          <Box marginRight="spacing.3" alignSelf="center">
            {titlePrefix}
          </Box>
          <Box>
            <Text variant="body" size="medium" weight="bold">
              {title}
            </Text>
            <Text variant="body" size="small" weight="regular">
              {subtitle}
            </Text>
          </Box>
          <Box marginLeft="spacing.3">{titleSuffix}</Box>
        </Box>
        <Box alignSelf="center">{trailingVisual}</Box>
      </Box>
      <Divider />
    </Box>
  );
};

export { CardHeader };
