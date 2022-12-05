import { Divider } from './Divider';
import Box from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

type Action = {
  text: string;
  onClick: () => void;
};

type CardFooterProps = {
  children?: React.ReactNode;
};

const CardFooter = ({ children }: CardFooterProps): React.ReactElement => {
  return (
    <Box marginTop="spacing.7">
      <Divider />
      <Box marginTop="spacing.7" display="flex" flexDirection="row" justifyContent="space-between">
        {children}
      </Box>
    </Box>
  );
};

type CardFooterLeadingProps = {
  title: string;
  subtitle?: string;
};
const CardFooterLeading = ({ title, subtitle }: CardFooterLeadingProps): React.ReactElement => {
  return (
    <Box>
      <Text variant="body" size="medium" weight="bold">
        {title}
      </Text>
      <Text variant="body" size="small" weight="regular">
        {subtitle}
      </Text>
    </Box>
  );
};

type CardFooterTrailingProps = {
  actions?: {
    primary?: Action;
    secondary?: Action;
  };
};
const CardFooterTrailing = ({ actions }: CardFooterTrailingProps): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="row" alignSelf="center">
      {actions?.secondary ? (
        <Button size="medium" variant="secondary" onClick={actions.secondary.onClick}>
          {actions.secondary.text}
        </Button>
      ) : null}
      <Box marginLeft="spacing.5" />
      {actions?.primary ? (
        <Button size="medium" onClick={actions.primary.onClick}>
          {actions.primary.text}
        </Button>
      ) : null}
    </Box>
  );
};

export { CardFooter, CardFooterLeading, CardFooterTrailing };
