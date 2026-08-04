import React, { memo, useState, useCallback } from 'react';
import type { CardComponent, TableComponent } from './GenUIComponents';
import { serializeTableToCsv } from './exportUtils/csv';
import { copyToClipboard } from './exportUtils/clipboard';
import { downloadBlob } from './exportUtils/downloadBlob';
import { captureNodeAsPng } from './exportUtils/captureNodeAsPng';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute/makeAnalyticsConstants';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Link } from '~components/Link';
import { CheckIcon, CloseIcon, DownloadIcon, CopyIcon } from '~components/Icons';
import type { IconComponent } from '~components/Icons';
import { useGenUIAction } from './GenUIContext';

const toFileNameSlug = (title?: string, fallback = 'export'): string => {
  const slug = (title ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
};

type GenUIActionLinkProps = {
  icon: IconComponent;
  label: string;
  successLabel: string;
  errorLabel: string;
  analyticsName: string;
  action: { type: string; eventName: string; data: Record<string, unknown> };
  onAction: () => void | Promise<void>;
};

const GenUIActionLink = memo(
  ({
    icon,
    label,
    successLabel,
    errorLabel,
    analyticsName,
    action,
    onAction,
  }: GenUIActionLinkProps) => {
    const onActionClick = useGenUIAction();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleClick = useCallback(async () => {
      if (status !== 'idle') return;
      setStatus('loading');
      try {
        await onAction();
        onActionClick?.({ ...action, data: { ...action.data, status: 'success' } });
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } catch {
        onActionClick?.({ ...action, data: { ...action.data, status: 'error' } });
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }, [status, onAction, onActionClick, action]);

    const isSuccess = status === 'success';
    const isError = status === 'error';

    return (
      <Link
        variant="button"
        icon={isSuccess ? CheckIcon : isError ? CloseIcon : icon}
        iconPosition="left"
        size="medium"
        color={isError ? 'negative' : 'primary'}
        isDisabled={status === 'loading'}
        onClick={handleClick}
        data-analytics-name={analyticsName}
      >
        {isSuccess ? successLabel : isError ? errorLabel : label}
      </Link>
    );
  },
);

const ActionButtonsContainer = memo(({ children }: { children: React.ReactNode }) => (
  <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.3" width="100%">
    {children}
  </Box>
));

const CardActionButton = memo(({ cardComponent }: { cardComponent: CardComponent }) => {
  const { title, description, footer, children } = cardComponent;
  const hasContent =
    Boolean(title) || Boolean(description) || Boolean(footer) || Boolean(children?.length);

  if (!hasContent) {
    return null;
  }

  const handleDownloadPng = useCallback(async (): Promise<void> => {
    const cardElement = document.querySelector('[data-genui-card-ref]') as HTMLElement;
    if (!cardElement) return;
    const blob = await captureNodeAsPng(cardElement);
    downloadBlob(blob, `${toFileNameSlug(title, 'card')}.png`, 'image/png');
  }, [title]);

  return (
    <ActionButtonsContainer>
      <GenUIActionLink
        icon={DownloadIcon}
        label="Download as PNG"
        successLabel="Downloaded!"
        errorLabel="Download failed"
        analyticsName={MAKE_ANALYTICS_CONSTANTS.GEN_UI.CARD_DOWNLOAD_BUTTON}
        action={{ type: 'DOWNLOAD', eventName: 'card_download', data: { format: 'png' } }}
        onAction={handleDownloadPng}
      />
    </ActionButtonsContainer>
  );
});

const TableActionButtons = memo(({ tableComponent }: { tableComponent: TableComponent }) => {
  const { headers, rows } = tableComponent;

  if (!headers || !rows || headers.length === 0 || rows.length === 0) {
    return null;
  }

  const handleCopyCsv = useCallback(async (): Promise<void> => {
    const csv = serializeTableToCsv(headers, rows);
    const didCopy = await copyToClipboard(csv);
    if (!didCopy) {
      throw new Error('[GenUI]: Failed to copy table as CSV');
    }
  }, [headers, rows]);

  const handleDownloadCsv = useCallback((): void => {
    const csv = serializeTableToCsv(headers, rows);
    downloadBlob(csv, 'table.csv', 'text/csv;charset=utf-8');
  }, [headers, rows]);

  return (
    <ActionButtonsContainer>
      <GenUIActionLink
        icon={CopyIcon}
        label="Copy"
        successLabel="Copied!"
        errorLabel="Copy failed"
        analyticsName={MAKE_ANALYTICS_CONSTANTS.GEN_UI.TABLE_COPY_BUTTON}
        action={{
          type: 'COPY',
          eventName: 'table_copy',
          data: { format: 'csv', rowCount: rows.length },
        }}
        onAction={handleCopyCsv}
      />
      <GenUIActionLink
        icon={DownloadIcon}
        label="Download as CSV"
        successLabel="Downloaded!"
        errorLabel="Download failed"
        analyticsName={MAKE_ANALYTICS_CONSTANTS.GEN_UI.TABLE_DOWNLOAD_BUTTON}
        action={{
          type: 'DOWNLOAD',
          eventName: 'table_download',
          data: { format: 'csv', rowCount: rows.length },
        }}
        onAction={handleDownloadCsv}
      />
    </ActionButtonsContainer>
  );
});

export { CardActionButton, TableActionButtons };
