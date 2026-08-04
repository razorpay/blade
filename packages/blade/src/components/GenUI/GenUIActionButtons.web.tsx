import React, { memo, useState, useCallback } from 'react';
import type { CardComponent, TableComponent, GenUIAction } from './GenUIComponents';
import { CheckIcon, CloseIcon } from '~components/Icons';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import { Text } from '~components/Typography';
import { useGenUIAction } from './GenUIContext';

type GenUIActionButtonProps = {
  action: GenUIAction;
  label: string;
  successLabel: string;
  errorLabel: string;
};

const GenUIActionButton = memo(
  ({ action, label, successLabel, errorLabel }: GenUIActionButtonProps) => {
    const onActionClick = useGenUIAction();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleClick = useCallback(async () => {
      if (status !== 'idle') return;
      setStatus('loading');
      try {
        await Promise.resolve(onActionClick?.(action));
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } catch {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, [status, onActionClick, action]);

    const isSuccess = status === 'success';
    const isError = status === 'error';

    return (
      <Link
        variant="button"
        icon={isSuccess ? CheckIcon : isError ? CloseIcon : undefined}
        iconPosition="left"
        size="medium"
        color={isError ? 'negative' : 'primary'}
        isDisabled={status === 'loading'}
        onClick={handleClick}
      >
        {isSuccess ? successLabel : isError ? errorLabel : label}
      </Link>
    );
  },
);

const ActionButtonsContainer = memo(({ children }: { children: React.ReactNode }) => (
  <Box
    display="flex"
    flexDirection="row"
    alignItems="center"
    gap="spacing.3"
    marginTop="spacing.3"
    width="100%"
  >
    {children}
  </Box>
));

const CardActionButton = memo(({ cardComponent }: { cardComponent: CardComponent }) => {
  const { actions } = cardComponent;

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <ActionButtonsContainer>
      {actions.map((action, index) => (
        <GenUIActionButton
          key={index}
          action={action}
          label={action.data?.label as string}
          successLabel={action.data?.successLabel as string}
          errorLabel={action.data?.errorLabel as string}
        />
      ))}
    </ActionButtonsContainer>
  );
});

const TableActionButtons = memo(({ tableComponent }: { tableComponent: TableComponent }) => {
  const { actions } = tableComponent;

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <ActionButtonsContainer>
      {actions.map((action, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Text as="span" color="surface.text.gray.muted" marginX="spacing.2">
              •
            </Text>
          )}
          <GenUIActionButton
            action={action}
            label={action.data?.label as string}
            successLabel={action.data?.successLabel as string}
            errorLabel={action.data?.errorLabel as string}
          />
        </React.Fragment>
      ))}
    </ActionButtonsContainer>
  );
});

export { CardActionButton, TableActionButtons };
