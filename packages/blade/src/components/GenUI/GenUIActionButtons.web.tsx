import React, { memo } from 'react';
import type { CardComponent, TableComponent, GenUIAction } from './GenUIComponents';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import { useGenUIAction } from './GenUIContext';

type GenUIActionButtonProps = {
  action: GenUIAction;
  label: string;
};

const GenUIActionButton = memo(({ action, label }: GenUIActionButtonProps) => {
  const onActionClick = useGenUIAction();

  const handleClick = () => {
    onActionClick?.(action);
  };

  return (
    <Link variant="button" size="medium" color="primary" onClick={handleClick}>
      {label}
    </Link>
  );
});

const ActionButtonsContainer = memo(({ children }: { children: React.ReactNode }) => (
  <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.3" marginTop="spacing.3" width="100%">
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
            <span style={{ margin: '0 spacing.2', color: 'var(--colors-surface-text-gray-muted)' }}>
              •
            </span>
          )}
          <GenUIActionButton action={action} label={action.data?.label as string} />
        </React.Fragment>
      ))}
    </ActionButtonsContainer>
  );
});

export { CardActionButton, TableActionButtons };
