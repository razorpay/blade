import { Divider } from './Divider';
import { useInsideCard } from './CardContext';
import Box from '~components/Box';
import type { ButtonProps } from '~components/Button';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

export type CardFooterAction = Pick<
  ButtonProps,
  'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'
> & {
  text: string;
};

type CardFooterProps = {
  children?: React.ReactNode;
};

const CardFooter = ({ children }: CardFooterProps): React.ReactElement => {
  useInsideCard('CardFooter');

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
  useInsideCard('CardFooterLeading');

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
    primary?: CardFooterAction;
    secondary?: CardFooterAction;
  };
};
const CardFooterTrailing = ({ actions }: CardFooterTrailingProps): React.ReactElement => {
  useInsideCard('CardFooterTrailing');

  return (
    <Box display="flex" flexDirection="row" alignSelf="center">
      {actions?.secondary ? (
        <Button size="medium" variant="secondary" {...actions.secondary}>
          {actions.secondary.text}
        </Button>
      ) : null}
      <Box marginLeft="spacing.5" />
      {actions?.primary ? (
        <Button size="medium" {...actions.primary}>
          {actions.primary.text}
        </Button>
      ) : null}
    </Box>
  );
};

export { CardFooter, CardFooterLeading, CardFooterTrailing };
