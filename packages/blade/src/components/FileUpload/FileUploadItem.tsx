import { memo } from 'react';
import { StyledFileUploadItemWrapper } from './StyledFileUploadItemWrapper';
import type { FileUploadItemProps } from './types';
import { FileUploadItemIcon } from './FileUploadItemIcon';
import { TrashIcon, EyeIcon, CloseIcon, CheckCircleIcon, RefreshIcon } from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Divider } from '~components/Divider';
import { IconButton } from '~components/Button/IconButton';
import { ProgressBar } from '~components/ProgressBar';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import { BaseLink } from '~components/Link/BaseLink';

const FileUploadItem = memo(
  ({
    file,
    onPreview,
    onRemove,
    onReupload,
    onDismiss,
    size: containerSize,
  }: FileUploadItemProps): React.ReactElement => {
    const { name, size, uploadPercent, errorText, status } = file;
    const isUploading = status === 'uploading';
    const sizeInKB = size / 1024;
    const sizeInMB = sizeInKB / 1024;
    const showSizeInKB = sizeInKB < 1024;

    return (
      <StyledFileUploadItemWrapper
        size={containerSize ?? 'medium'}
        status={status ?? 'success'}
        borderRadius="medium"
        borderWidth="thin"
      >
        <BaseBox width="100%" display="flex" flexDirection="column">
          <BaseBox
            display="flex"
            flexDirection="row"
            margin={containerSize === 'large' ? 'spacing.4' : 'spacing.3'}
          >
            <BaseBox marginRight="spacing.3">
              <FileUploadItemIcon fileName={name} uploadStatus={status} />
            </BaseBox>
            <BaseBox flexGrow={1}>
              <BaseBox alignItems="center" display="flex">
                <BaseBox alignItems="center" maxWidth="70%" display="flex" marginRight="spacing.3">
                  <Text
                    size="medium"
                    weight="medium"
                    color="surface.text.gray.subtle"
                    truncateAfterLines={1}
                  >
                    {name}
                  </Text>
                </BaseBox>
                {status === 'success' && (
                  <CheckCircleIcon
                    size="medium"
                    marginRight="spacing.2"
                    color="interactive.icon.positive.normal"
                  />
                )}
              </BaseBox>
              <Text
                size="small"
                weight="regular"
                color={
                  status === 'error' ? 'feedback.text.negative.intense' : 'surface.text.gray.muted'
                }
              >
                {errorText ??
                  `${(showSizeInKB ? sizeInKB : sizeInMB).toFixed(2)} ${
                    showSizeInKB ? 'KB' : 'MB'
                  } ${isUploading && uploadPercent ? `(${uploadPercent}%)` : ''}`}
              </Text>
            </BaseBox>
            {status === 'uploading' ? (
              <BaseBox>
                <IconButton
                  accessibilityLabel="Remove File"
                  icon={CloseIcon}
                  onClick={() => onDismiss?.({ file })}
                />
              </BaseBox>
            ) : status === 'error' ? (
              <BaseBox display="flex" flexDirection="row" alignItems="center">
                <BaseLink
                  marginX="spacing.1"
                  variant="button"
                  icon={RefreshIcon}
                  color="negative"
                  size="small"
                  onClick={() => {
                    onReupload?.({ file });
                  }}
                >
                  Re-upload
                </BaseLink>
              </BaseBox>
            ) : (
              <BaseBox display="flex" flexDirection="row" alignItems="center">
                {onPreview ? (
                  <BaseBox
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    padding="spacing.0"
                    gap="spacing.3"
                  >
                    <IconButton
                      accessibilityLabel="Preview File"
                      icon={EyeIcon}
                      onClick={() => onPreview?.({ file })}
                    />
                    <Divider orientation="vertical" thickness="thinner" variant="normal" />
                    <IconButton
                      accessibilityLabel="Remove File"
                      icon={TrashIcon}
                      onClick={() => onRemove?.({ file })}
                    />
                  </BaseBox>
                ) : (
                  <IconButton
                    accessibilityLabel="Remove File"
                    icon={TrashIcon}
                    onClick={() => onRemove?.({ file })}
                  />
                )}
              </BaseBox>
            )}
          </BaseBox>
          {isUploading && (
            <BaseBox width="100%" position="absolute" bottom="spacing.0">
              <ProgressBar
                left="spacing.0"
                showPercentage={false}
                value={uploadPercent ?? 0}
                isIndeterminate={isUndefined(uploadPercent)}
              />
            </BaseBox>
          )}
        </BaseBox>
      </StyledFileUploadItemWrapper>
    );
  },
);

export { FileUploadItem };
